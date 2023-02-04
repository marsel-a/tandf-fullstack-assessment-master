import { FC, useCallback, useMemo, useState } from 'react';

import { CheckIcon } from '@chakra-ui/icons';
import { Flex, FlexProps, Text, Box, Button, Progress } from '@chakra-ui/react';
import { isSameDay, format, isEqual } from 'date-fns';
import moment from 'moment';
import { DayPickerSingleDateController } from 'react-dates';

import { Slot } from '@/types/domain';

import { Container } from './styled';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

type Props = {
  minimumStartDate: Date;
  maximumStartDate: Date;
  availableSlots: Slot[];
  value?: Slot;
  onChange: (slot: Slot) => void;
  styleProps?: FlexProps;
  slotLoading?: Slot;
  loadingSlots: boolean;
}

const SlotSelector: FC<Props> = ({
  minimumStartDate,
  maximumStartDate,
  availableSlots,
  loadingSlots,
  value,
  onChange,
  styleProps,
  ...props
}) => {
  const [date, setDate] = useState(
    availableSlots?.[0]?.start || minimumStartDate,
  );

  const onSlotSelected = useCallback((slot: Slot) => {
    onChange(slot);
  }, [onChange]);

  const availableSlotsOnDate = useMemo(() => {
    return availableSlots.filter((x) => isSameDay(x.start, date));
  }, [date, availableSlots]);

  const minStartDate = moment(minimumStartDate);
  const maxStartDate = moment(maximumStartDate);

  return (
    <Container {...styleProps}>
      <DayPickerSingleDateController
        initialVisibleMonth={() => moment(date)}
        onFocusChange={() => null}
        date={moment(date)}
        focused
        hideKeyboardShortcutsPanel
        isDayBlocked={(d) => {
          const isBlocked =
            d.startOf('day') < minStartDate.startOf('day') ||
            d.endOf('day') > maxStartDate.endOf('day');
          return isBlocked;
        }}
        onDateChange={(d) => {
          if (d) {
            setDate(d.toDate());
          }
        }}
        {...props}
      />
      <Flex flexDirection="column" px="12px" w="100%">
        <Text fontSize="17px" mb="20px" mt="22px" textAlign="left">
          {format(date, 'eeee, MMMM dd')}
        </Text>
        <Box flexGrow={1} overflow="auto" position="relative">
          {loadingSlots ? (
            <Progress />
          ) : (
            availableSlotsOnDate.map((slot) => {
              const isActive = value && isEqual(value.start, slot?.start);
              const activeStyle = isActive && {
                backgroundColor: 'teal.500',
                border: 'none',
              };
              return (
                <Button
                  key={slot.key}
                  _hover={{
                    backgroundColor: 'white.10',
                  }}
                  borderColor="white.10"
                  colorScheme="gray"
                  fontSize="16px"
                  mb="8px"
                  onClick={() => onSlotSelected(slot)}
                  py="16px"
                  variant="outline"
                  width="100%"
                  {...activeStyle}
                >
                  {format(slot.start, 'hh:mm a')}{' '}
                  {isActive && <CheckIcon position="absolute" right="18px" />}
                </Button>
              );
            })
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default SlotSelector;
