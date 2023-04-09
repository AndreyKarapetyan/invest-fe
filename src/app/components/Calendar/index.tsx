import moment from 'moment';
import React, { Fragment, useState } from 'react';
import { Box, TableContainer } from '@mui/material';
import { DatePicker } from './DatePicker';
import { events } from './mockData';
import { ScheduleTable } from './ScheduleTable';
import { SLIDER_WIDTH } from 'src/app/constants';

export function Calendar() {
  const rooms = [
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4',
    'Room 5',
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4',
    'Room 5',
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4',
    'Room 5',
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4',
    'Room 5',
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4',
    'Room 5',
    'Room 1',
    'Room 2',
    'Room 3',
    'Room 4',
    'Room 5',
  ];
  const times = generateTimeSlots();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedStart, setSelectedStart] = useState<any>(null);
  const [selectedEnd, setSelectedEnd] = useState<any>(null);
  const [value, setValue] = React.useState<any>(moment());

  function generateTimeSlots() {
    const slots = [];
    for (let i = 9; i <= 22; i++) {
      for (let j = 0; j < 60; j += 15) {
        slots.push({ hour: i, minute: j });
      }
    }
    return slots;
  }

  const handleMouseDown = (roomIndex: any, timeSlot: any) => {
    const eventAtCurrentPosition = isEvent(roomIndex, timeSlot);
    if (eventAtCurrentPosition) {
      return;
    }
    setIsSelecting(true);
    setSelectedRoom(roomIndex);
    setSelectedStart(timeSlot);
    setSelectedEnd(timeSlot);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const hasEventInSelectionRange = (
    roomIndex: any,
    startIndex: number,
    endIndex: number
  ) => {
    for (let i = startIndex; i <= endIndex; i++) {
      if (isEvent(roomIndex, times[i])) {
        return true;
      }
    }
    return false;
  };

  const handleMouseEnter = (_: any, timeSlot: any) => {
    if (isSelecting) {
      const selectedIndex = times.findIndex(
        (slot) => slot.hour === timeSlot.hour && slot.minute === timeSlot.minute
      );
      const endIndex = times.findIndex(
        (slot) =>
          slot.hour === selectedEnd.hour && slot.minute === selectedEnd.minute
      );
      if (
        !hasEventInSelectionRange(
          selectedRoom,
          Math.min(selectedIndex, endIndex) + 1,
          Math.max(selectedIndex, endIndex)
        )
      ) {
        setSelectedEnd(timeSlot);
      }
    }
  };

  const isSelected = (roomIndex: any, timeSlot: any) => {
    if (roomIndex === selectedRoom) {
      const selectedIndex = times.findIndex(
        (slot) => slot.hour === timeSlot.hour && slot.minute === timeSlot.minute
      );
      const startIndex = times.findIndex(
        (slot) =>
          slot.hour === selectedStart.hour &&
          slot.minute === selectedStart.minute
      );
      const endIndex = times.findIndex(
        (slot) =>
          slot.hour === selectedEnd.hour && slot.minute === selectedEnd.minute
      );

      return (
        selectedIndex >= Math.min(startIndex, endIndex) &&
        selectedIndex <= Math.max(startIndex, endIndex)
      );
    }
    return false;
  };

  const isEvent = (roomIndex: any, timeSlot: any) => {
    const event = events.find(
      (e) =>
        e.roomIndex === roomIndex &&
        times.findIndex(
          (slot) =>
            slot.hour === timeSlot.hour && slot.minute === timeSlot.minute
        ) >=
          times.findIndex(
            (slot) =>
              slot.hour === e.start.hour && slot.minute === e.start.minute
          ) &&
        times.findIndex(
          (slot) =>
            slot.hour === timeSlot.hour && slot.minute === timeSlot.minute
        ) <=
          times.findIndex(
            (slot) => slot.hour === e.end.hour && slot.minute === e.end.minute
          )
    );

    return event;
  };

  const getEventHeight = (
    start: { hour: number; minute: number },
    end: { hour: number; minute: number }
  ) => {
    const startIndex = times.findIndex(
      (slot) => slot.hour === start.hour && slot.minute === start.minute
    );
    const endIndex = times.findIndex(
      (slot) => slot.hour === end.hour && slot.minute === end.minute
    );
    return (endIndex - startIndex) * 100;
  };

  return (
    <Fragment>
      <Box sx={{ marginTop: 7, position: 'fixed' }}>
        <DatePicker
          value={value}
          onChange={(newValue: any) => setValue(newValue)}
        />
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
            isEvent={isEvent}
            isSelected={isSelected}
            getEventHeight={getEventHeight}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
          />
      </TableContainer>
    </Fragment>
  );
}
