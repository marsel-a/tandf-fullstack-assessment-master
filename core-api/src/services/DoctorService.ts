import { Doctor } from '@/entities/Doctor';
import { Slot } from '@/models/appointments/Slot';
import { NotImplementedException } from '@/models/errors/NotImplementedException';
import { SLOT_DURATION } from '@/utils/constants';
import {
  addMinutes,
  eachMinuteOfInterval,
  getDay,
  isWithinInterval,
  setHours,
  setMinutes,
  setSeconds,
  subMinutes,
  subSeconds,
} from 'date-fns';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>
  ) {}

  getDoctors() {
    return this.doctorRepo.find();
  }

  addDoctor(): Promise<Doctor> {
    throw new NotImplementedException('addDoctor: Not implemented!');
  }

  async getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    const doctors = await this.doctorRepo.find({
      relations: ['availability', 'appointments'],
    });

    const normalisedFrom = setSeconds(from, 0);
    const normalisedTo = subSeconds(setSeconds(to, 0), 1);

    const timeIntervals = eachMinuteOfInterval(
      {
        start: normalisedFrom,
        end: normalisedTo,
      },
      { step: SLOT_DURATION }
    );

    const slots = Array<Slot>();
    doctors.forEach((doctor) => {
      doctor.availability.forEach((avail) => {
        timeIntervals.forEach((timeInterval) => {
          if (getDay(timeInterval) === avail.dayOfWeek) {
            const [startHour, startMinute] = avail.startTimeUtc.split(':');
            const [endHour, endMinute] = avail.endTimeUtc.split(':');
            const sDate = setMinutes(setHours(new Date(timeInterval), parseInt(startHour)), parseInt(startMinute));
            const eDate = subMinutes(
              setMinutes(setHours(new Date(timeInterval), parseInt(endHour)), parseInt(endMinute)),
              SLOT_DURATION
            );
            const isWithinAvailability = isWithinInterval(timeInterval, { start: sDate, end: eDate });

            if (isWithinAvailability) {
              const slot = new Slot();
              slot.doctorId = doctors[0].id;
              slot.start = timeInterval;
              slot.end = addMinutes(timeInterval, SLOT_DURATION);

              const appointmentFound = doctor.appointments.find((appointment) => {
                const normalisedAppointmentStartDate = subSeconds(setSeconds(appointment.startTime, 0), 1);
                const normalisedAppointmentEndDate = subSeconds(
                  addMinutes(normalisedAppointmentStartDate, appointment.durationMinutes),
                  1
                );
                return isWithinInterval(slot.start, {
                  start: normalisedAppointmentStartDate,
                  end: normalisedAppointmentEndDate,
                });
              });

              if (!appointmentFound) {
                slots.push(slot);
              }
            }
          }
        });
      });
    });

    return slots;
  }
}

