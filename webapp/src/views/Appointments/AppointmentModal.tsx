import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form/dist/types';

import HighlightBox from '@/components/HighlightBox';
import { Doctor, useBookAppointmentMutation } from '@/generated/core.graphql';
import { SlotWithKey } from '@/types/domain';

interface Props {
  isOpen: boolean;
  doctor: Doctor | undefined;
  slot: SlotWithKey | undefined;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormInputs {
  patientName: string;
  description: string;
}

const AppointmentModal = ({
  isOpen,
  doctor,
  slot,
  onClose,
  onSuccess,
}: Props) => {
  // States & Vars
  const doctorName = doctor?.name;
  const slotDate = moment(slot?.start).format('MMMM Do YYYY');
  const slotStartTime = moment(slot?.start).format('h:mm:ss a');
  const slotEndTime = moment(slot?.end).format('h:mm:ss a');

  // Hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();
  const [bookAppointment, { loading: isBookingAppointment }] =
    useBookAppointmentMutation();

  // Functions
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    bookAppointment({
      variables: {
        bookAppointmentInput: {
          slot: {
            doctorId: slot?.doctorId!,
            start: new Date(slot?.start),
            end: new Date(slot?.end),
          },
          patientName: data.patientName,
          description: data.description,
        },
      },
    })
      .then(() => {
        alert('Appointment created!');
        onSuccess();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        onCloseModal();
      });
  };

  const onCloseModal = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      closeOnOverlayClick={!isBookingAppointment}
    >
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(2px) hue-rotate(90deg)'
      />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Book an Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Container>
              Book your appointment with{' '}
              <HighlightBox>{doctorName}</HighlightBox> on
              <HighlightBox>{slotDate}</HighlightBox> at{' '}
              <HighlightBox>
                {slotStartTime} - {slotEndTime}
              </HighlightBox>
            </Container>

            <FormControl mt={4} isInvalid={!!errors.patientName}>
              <FormLabel>
                Patient name <span style={{ color: '#E53E' }}>*</span>
              </FormLabel>
              <Input
                placeholder='Andy Smith'
                {...register('patientName', { required: true })}
                autoFocus
              />
              {errors.patientName && (
                <FormErrorMessage>Patient name is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.description}>
              <FormLabel>
                Description <span style={{ color: '#E53E' }}>*</span>
              </FormLabel>
              <Textarea {...register('description', { required: true })} />
              {errors.description && (
                <FormErrorMessage>Description is required.</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              isLoading={isBookingAppointment}
              type='submit'
            >
              Book
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentModal;
