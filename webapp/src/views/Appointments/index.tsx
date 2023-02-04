import { useEffect, useState } from 'react';

import { Heading, Box, Text } from '@chakra-ui/react';
import { addMinutes, addDays } from 'date-fns';

import DoctorSelector from '@/components/DoctorSelector';
import SlotSelector from '@/components/SlotSelector';
import { Doctor, Slot, useDoctorsQuery } from '@/generated/core.graphql';
import { SlotWithKey } from '@/types/domain';

const startDate = new Date();
const generateSlots = (): SlotWithKey[] => {
  return [
    {
      key: startDate.toString(),
      start: startDate,
      end: addMinutes(startDate, 15),
      doctorId: 1,
    },
  ];
};

const Appointments = () => {
  const { data, loading } = useDoctorsQuery();
  const [error, setError] = useState<string>();
  const [slots, setSlots] = useState<SlotWithKey[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [isLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotWithKey>();
  const minimumStartDate = slots?.[0]?.start;
  const maximumStartDate = minimumStartDate && addDays(minimumStartDate, 30);

  useEffect(() => {
    if (selectedDoctor) {
      // fetch availabilities
      // generate slots
      const slots = generateSlots();
      setSlots(slots);
    } else {
      setSlots([]);
    }
  }, [selectedDoctor]);

  return (
    <Box>
      <Heading>Appointments</Heading>
      {error && (
        <Box>
          <Text>{error}</Text>
        </Box>
      )}
      <DoctorSelector
        doctors={data?.doctors as Doctor[]}
        value={selectedDoctor}
        onChange={setSelectedDoctor}
      />
      {slots?.length > 0 ? (
        <SlotSelector
          minimumStartDate={minimumStartDate}
          maximumStartDate={maximumStartDate}
          availableSlots={slots}
          value={selectedSlot}
          onChange={setSelectedSlot}
          loadingSlots={isLoading}
        />
      ) : (
        <Text>No slots available</Text>
      )}
    </Box>
  );
};

export default Appointments;
