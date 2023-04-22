import { Box, TableContainer } from '@mui/material';
import { convertToMinutes, generateTimeSlots, TimeSlot } from './utils';
import { DatePicker } from './DatePicker';
import { events } from './mockData';
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ScheduleTable } from './ScheduleTable';
import { SLIDER_WIDTH } from 'src/app/constants';

export const Calendar = memo(function Calendar({
  rooms,
  /* events, */ date,
  handleDateChange,
  handleDialogOpen,
  shouldUpdateSubmissionData,
  updateSubmissionData,
  checkSubmissionStatus,
}: any) {
  const times = useMemo(generateTimeSlots, []);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedStart, setSelectedStart] = useState<TimeSlot | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<TimeSlot | null>(null);

  const handleMouseDown = useCallback((roomIndex: any, timeSlot: any) => {
    const eventAtCurrentPosition = getEventAtPosition(roomIndex, timeSlot);
    console.log(roomIndex, timeSlot);
    if (eventAtCurrentPosition) {
      return;
    }
    setIsSelecting(true);
    setSelectedRoom(roomIndex);
    setSelectedStart(timeSlot);
    setSelectedEnd(timeSlot);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    handleDialogOpen();
  }, []);

  const handleMouseEnter = useCallback(
    (_: any, timeSlot: TimeSlot) => {
      if (isSelecting) {
        const { hour, minute } = timeSlot;
        const selectedTime = convertToMinutes(times[`${hour} ${minute}`]);
        const startTime = convertToMinutes(selectedStart!);
        const isEventInSelectionRange = events.some(
          ({ start, end, roomIndex: eventRoomIndex }: any) =>
            selectedRoom === eventRoomIndex &&
            ((Math.min(startTime, selectedTime) <
              convertToMinutes({ hour: start.hour, minute: start.minute }) &&
              Math.max(startTime, selectedTime) + 15 >
                convertToMinutes({
                  hour: start.hour,
                  minute: start.minute,
                })) ||
              (Math.min(startTime, selectedTime) <
                convertToMinutes({ hour: end.hour, minute: end.minute }) &&
                Math.max(startTime, selectedTime) >
                  convertToMinutes({ hour: end.hour, minute: end.minute })))
        );
        if (!isEventInSelectionRange) {
          setSelectedEnd(timeSlot);
        }
      }
    },
    [isSelecting, selectedRoom]
  );

  const isSelected = useCallback(
    (roomIndex: number, timeSlot: TimeSlot) => {
      if (roomIndex === selectedRoom) {
        const selectedTime = convertToMinutes(timeSlot);
        const startTime = convertToMinutes(selectedStart!);
        const endTime = convertToMinutes(selectedEnd!);
        return (
          selectedTime >= Math.min(startTime, endTime) &&
          selectedTime <= Math.max(startTime, endTime)
        );
      }
      return false;
    },
    [selectedRoom, selectedStart, selectedEnd]
  );

  const getEventAtPosition = useCallback(
    (roomIndex: number, timeSlot: TimeSlot) => {
      const selectedTime = convertToMinutes(timeSlot);
      return events.find(
        ({ start, end, roomIndex: eventRoomIndex }: any) =>
          eventRoomIndex === roomIndex &&
          selectedTime >=
            convertToMinutes({ hour: start.hour, minute: start.minute }) &&
          selectedTime <
            convertToMinutes({ hour: end.hour, minute: end.minute })
      );
    },
    []
  );

  const getEventHeight = useCallback(
    (
      start: {
        hour: number;
        minute: number;
      },
      end: {
        hour: number;
        minute: number;
      }
    ) => {
      const startTime = convertToMinutes(start);
      const endTime = convertToMinutes(end);
      return ((endTime - startTime) * 100) / 15;
    },
    []
  );

  useEffect(() => {
    if (shouldUpdateSubmissionData.slots) {
      updateSubmissionData({
        startHour: selectedStart?.hour,
        startMinute: selectedStart?.minute,
        endHour: selectedEnd?.hour,
        endMinute: selectedEnd?.minute,
        roomId: selectedRoom && rooms[selectedRoom as number].id,
      });
      checkSubmissionStatus('slots', false);
    }
  }, [shouldUpdateSubmissionData]);

  return (
    <Fragment>
      <Box sx={{ marginTop: 7, position: 'fixed' }}>
        <DatePicker value={date} onChange={handleDateChange} />
      </Box>
      <TableContainer
        sx={{
          userSelect: 'none',
          maxHeight: '80vh',
          maxWidth: `calc(100vw - 400px - ${SLIDER_WIDTH}px)`,
          marginTop: 3,
          marginLeft: '350px',
        }}
      >
        <ScheduleTable
          rooms={rooms}
          times={times}
          handleMouseEnter={handleMouseEnter}
          getEventAtPosition={getEventAtPosition}
          isSelected={isSelected}
          getEventHeight={getEventHeight}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleEventClick={handleDialogOpen}
        />
      </TableContainer>
    </Fragment>
  );
});
