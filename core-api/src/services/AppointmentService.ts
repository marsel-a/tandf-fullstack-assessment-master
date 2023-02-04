import { Appointment } from '@/entities/Appointment';
import { Doctor } from '@/entities/Doctor';
import { BookAppointmentInput } from '@/models/appointments/BookAppointmentInput';
import { differenceInMinutes } from 'date-fns';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>
  ) {}

  getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  async bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    const doctorId = options.slot.doctorId;
    const startTime = options.slot.start;
    const durationMinutes = differenceInMinutes(options.slot.end, options.slot.start);

    const appointmentFound = await this.appointmentRepo.findOne({
      where: {
        startTime,
      },
    });

    if (appointmentFound) {
      throw new Error('Appointment slot already taken');
    }

    const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
    const appointment = new Appointment();
    appointment.startTime = startTime;
    appointment.doctor = doctor;
    appointment.durationMinutes = durationMinutes;
    appointment.patientName = options.patientName;
    appointment.description = options.description;

    const newAppointment = this.appointmentRepo.create(appointment);
    return this.appointmentRepo.save(newAppointment);
  }
}

