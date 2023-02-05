import { useMemo, useState } from 'react';

import {
  Heading,
  Box,
  Text,
  Flex,
  Progress,
  useDisclosure,
} from '@chakra-ui/react';
import { addDays } from 'date-fns';

import AppointmentModal from './AppointmentModal';

import DoctorSelector from '@/components/DoctorSelector';
import SlotSelector from '@/components/SlotSelector';
import {
  Doctor,
  Slot,
  useDoctorsQuery,
  useSlotsLazyQuery,
} from '@/generated/core.graphql';
import { SlotWithKey } from '@/types/domain';

const generateSlots = (
  slots: Slot[],
  selectedDoctor: Doctor
): SlotWithKey[] => {
  return slots
    .filter((slot) => slot.doctorId === selectedDoctor.id)
    .map((slot) => ({
      key: slot.start,
      start: Date.parse(slot.start),
      end: Date.parse(slot.end),
      doctorId: slot.doctorId,
    }));
};

const Appointments = () => {
  const {
    isOpen,
    onOpen: onOpenAppointmentModal,
    onClose: onCloseAppointmentModal,
  } = useDisclosure();
  const { data, loading } = useDoctorsQuery();
  const [getSlots, { loading: isLoadingSlots }] = useSlotsLazyQuery();
  const [error, setError] = useState<string>();
  const [slots, setSlots] = useState<SlotWithKey[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [isLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotWithKey>();
  const minimumStartDate = useMemo(() => new Date(), []);
  const maximumStartDate = useMemo(
    () => minimumStartDate && addDays(minimumStartDate, 30),
    [minimumStartDate]
  );

  const fetchAvailabilities = (doc: Doctor) => {
    getSlots({
      fetchPolicy: 'no-cache',
      variables: {
        from: minimumStartDate,
        to: maximumStartDate,
      },
    }).then((res) => {
      if (res.data) {
        const generatedSlots = generateSlots(res.data.slots, doc);
        setSlots(generatedSlots);
      }
    });
  };

  const onChangeSelectedDoctor = (doc: Doctor | undefined) => {
    setSelectedDoctor(doc);

    if (!doc) {
      setSlots([]);
      return;
    }

    // fetch availabilities
    // generate slots
    fetchAvailabilities(doc);
  };

  const onChangeSelectedSlot = (slot: SlotWithKey) => {
    setSelectedSlot(slot);
    onOpenAppointmentModal();
  };

  const refetchAvailabilities = () => {
    if (selectedDoctor) {
      fetchAvailabilities(selectedDoctor);
    }
  };

  return (
    <Flex
      direction={'column'}
      justifyItems={'center'}
      alignItems={'center'}
      gap={'8'}
    >
      {isLoadingSlots && (
        <Progress
          position={'absolute'}
          width={'100vw'}
          size='xs'
          isIndeterminate
        />
      )}
      <Heading>Appointments</Heading>
      {error && (
        <Box>
          <Text>{error}</Text>
        </Box>
      )}
      <DoctorSelector
        doctors={data?.doctors as Doctor[]}
        value={selectedDoctor}
        onChange={onChangeSelectedDoctor}
      />
      {slots?.length > 0 ? (
        <SlotSelector
          minimumStartDate={minimumStartDate}
          maximumStartDate={maximumStartDate}
          availableSlots={slots}
          value={selectedSlot}
          onChange={onChangeSelectedSlot}
          loadingSlots={isLoading}
        />
      ) : (
        <Text>No slots available</Text>
      )}

      <AppointmentModal
        onClose={onCloseAppointmentModal}
        onSuccess={refetchAvailabilities}
        isOpen={isOpen}
        doctor={selectedDoctor}
        slot={selectedSlot}
      />
    </Flex>
  );
};

export default Appointments;
