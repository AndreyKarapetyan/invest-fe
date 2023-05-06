import { Box, TableContainer } from '@mui/material';
import {
  convertToMinutes,
  generateTimeSlots,
  getNextTimeSlot,
  getPrevTimeSlot,
  TimeSlot,
} from './utils';
import { DatePicker } from './DatePicker';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ScheduleTable } from './ScheduleTable';
import { SLIDER_WIDTH } from 'src/app/constants';
import { EventDialog } from './EventDialog';
import { ConfirmationDialog } from '../Confirmation';
import { ChangeModeDialog } from './ChangeModeDialog';
import { ChangeMode } from 'src/app/types/changeMode';

export function Calendar({
  rooms,
  events,
  date,
  getTeacherGroups,
  handleDateChange,
  handleDialogOpen,
  shouldUpdateSubmissionData,
  updateSubmissionData,
  checkSubmissionStatus,
  dialogOpen,
  handleDialogClose,
  teachers,
  teachersLoading,
  groups,
  groupsLoading,
  handleSubmitStart,
  cancelSubmit,
  event,
  deletableEvent,
  updateDeleteChangeMode,
  handleDeleteOpen,
  handleDeleteClose,
  handleDelete,
}: any) {
  const times = useMemo(generateTimeSlots, []);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedStart, setSelectedStart] = useState<TimeSlot | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<TimeSlot | null>(null);

  const handleStartChange = (timeSlot: TimeSlot) => {
    setSelectedStart(timeSlot);
  };

  const handleEndChange = (timeSlot: TimeSlot) => {
    setSelectedEnd(timeSlot);
  };

  const handleMouseDown = useCallback((roomId: any, timeSlot: any) => {
    const eventAtCurrentPosition = getEventAtPosition(roomId, timeSlot);
    if (eventAtCurrentPosition) {
      return;
    }
    setIsSelecting(true);
    setSelectedRoom(roomId);
    setSelectedStart(timeSlot);
    setSelectedEnd(timeSlot);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      handleDialogOpen();
    }
  }, [isSelecting]);

  const handleMouseEnter = useCallback(
    (_: any, { hour, minute }: TimeSlot) => {
      if (isSelecting) {
        const selectedTime = convertToMinutes(times[`${hour} ${minute}`]);
        const startTime = convertToMinutes(selectedStart!);
        const timeSlot =
          selectedTime < startTime
            ? getPrevTimeSlot({ hour, minute })
            : { hour, minute };
        const isEventInSelectionRange = events.some(
          ({ start, end, roomId }: any) =>
            selectedRoom === roomId &&
            ((Math.min(startTime, selectedTime) <
              convertToMinutes({ hour: start.hour, minute: start.minute }) &&
              Math.max(startTime, selectedTime) >
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
    (roomId: number, timeSlot: TimeSlot) => {
      if (roomId === selectedRoom && isSelecting) {
        const selectedTime = convertToMinutes(timeSlot);
        const startTime = convertToMinutes(selectedStart!);
        const endTime = convertToMinutes(selectedEnd!);
        return (
          selectedTime >= Math.min(startTime, endTime) &&
          selectedTime < Math.max(startTime, endTime)
        );
      }
      return false;
    },
    [selectedRoom, selectedStart, selectedEnd, isSelecting]
  );

  const getEventAtPosition = useCallback(
    (roomId: number, timeSlot: TimeSlot) => {
      const selectedTime = convertToMinutes(timeSlot);
      return events.find(
        ({ start, end, roomId: eventRoomId }: any) =>
          eventRoomId === roomId &&
          selectedTime >=
            convertToMinutes({ hour: start.hour, minute: start.minute }) &&
          selectedTime <
            convertToMinutes({ hour: end.hour, minute: end.minute })
      );
    },
    [events]
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
        roomId: selectedRoom,
      });
      checkSubmissionStatus('slots', false);
      setIsSelecting(false);
    }
  }, [shouldUpdateSubmissionData]);

  useEffect(() => {
    if (
      event &&
      event.start &&
      event.end &&
      !shouldUpdateSubmissionData.startedSubmitProcess
    ) {
      setSelectedStart(event.start);
      setSelectedEnd(event.end);
    }
  }, [event]);

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
      {dialogOpen && (
        <EventDialog
          event={event}
          isOpen={dialogOpen}
          handleClose={handleDialogClose}
          getTeacherGroups={getTeacherGroups}
          teachers={teachers}
          groups={groups}
          teachersLoading={teachersLoading}
          shouldUpdateSubmissionData={shouldUpdateSubmissionData}
          updateSubmissionData={updateSubmissionData}
          handleSubmitStart={handleSubmitStart}
          checkSubmissionStatus={checkSubmissionStatus}
          handleDeleteOpen={handleDeleteOpen}
          times={times}
          startTime={selectedStart}
          endTime={selectedEnd}
          handleStartChange={handleStartChange}
          handleEndChange={handleEndChange}
        />
      )}
      {deletableEvent &&
        (deletableEvent.pattern === 'once' ? (
          <ConfirmationDialog
            open={Boolean(deletableEvent && deletableEvent.pattern === 'once')}
            onConfirm={handleDelete}
            onCancel={handleDeleteClose}
            message="Are you sure you want to delete this lesson?"
          />
        ) : (
          <ChangeModeDialog
            message="Deleting Lesson"
            value={deletableEvent.changeMode}
            handleChange={updateDeleteChangeMode}
            onCancel={handleDeleteClose}
            onConfirm={handleDelete}
            open={Boolean(deletableEvent && deletableEvent.pattern !== 'once')}
          />
        ))}
      {shouldUpdateSubmissionData.startedSubmitProcess &&
        event.id &&
        !shouldUpdateSubmissionData.changeModeConfirmed &&
        event.pattern !== 'once' && (
          <ChangeModeDialog
            message="Updating Lesson"
            value={event.changeMode}
            handleChange={(value: ChangeMode) => {
              updateSubmissionData({ changeMode: value });
              // checkSubmissionStatus('changeMode', false);
            }}
            onCancel={cancelSubmit}
            onConfirm={() => checkSubmissionStatus('changeModeConfirmed', true)}
            open={Boolean(
              shouldUpdateSubmissionData.startedSubmitProcess &&
                event.id &&
                !shouldUpdateSubmissionData.changeModeConfirmed &&
                event.pattern !== 'once'
            )}
          />
        )}
    </Fragment>
  );
}
