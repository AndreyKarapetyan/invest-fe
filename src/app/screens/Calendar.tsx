import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Box,
  Grid,
} from '@mui/material';

const EventDisplay = ({ title, description, height }: any) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        height: `calc(${height}%)`,
        width: '90%',
        position: 'absolute',
        top: '1px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '2px',
        }}
      >
        {title}
      </Box>
      <Box sx={{ fontSize: '10px', textAlign: 'center' }}>{description}</Box>
    </Box>
  );
};

const EventSelection = ({
  roomIndex,
  timeSlot,
  handleMouseDown,
  handleMouseUp,
  handleMouseEnter,
  isSelected,
}: any) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isSelected ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
    }}
    onMouseDown={() => handleMouseDown(roomIndex, timeSlot)}
    onMouseUp={handleMouseUp}
    onMouseEnter={() => handleMouseEnter(roomIndex, timeSlot)}
  />
);

export const Calendar = () => {
  const timeSlotHeight = 20;
  const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4'];
  const times = generateTimeSlots();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedStart, setSelectedStart] = useState<any>(null);
  const [selectedEnd, setSelectedEnd] = useState<any>(null);

  const events = [
    {
      roomIndex: 0,
      title: 'Meeting A',
      description: 'Important Meeting',
      start: { hour: 9, minute: 30 },
      end: { hour: 10, minute: 30 },
    },
    {
      roomIndex: 2,
      title: 'Workshop B',
      description: 'Skill Development',
      start: { hour: 14, minute: 0 },
      end: { hour: 15, minute: 45 },
    },
    {
      roomIndex: 3,
      title: 'Presentation C',
      description: 'Product Launch',
      start: { hour: 17, minute: 30 },
      end: { hour: 18, minute: 15 },
    },
  ];

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

  const handleMouseEnter = (roomIndex: any, timeSlot: any) => {
    if (isSelecting) {
      const selectedIndex = times.findIndex(
        (slot) => slot.hour === timeSlot.hour && slot.minute === timeSlot.minute
      );

      const endIndex = times.findIndex(
        (slot) =>
          slot.hour === selectedEnd.hour && slot.minute === selectedEnd.minute
      );

      if (
        roomIndex === selectedRoom &&
        !hasEventInSelectionRange(
          roomIndex,
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
    <Grid container justifyContent="center">
      <TableContainer sx={{ width: '60vw', outline: '1px dashed red' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
              {rooms.map((room, index) => (
                <TableCell
                  key={index}
                  sx={{
                    textAlign: 'center',
                    borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {room}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {times.map((timeSlot, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ height: `${timeSlotHeight}px` }}
              >
                <TableCell
                  onMouseEnter={() => handleMouseEnter(null, timeSlot)}
                  sx={{
                    borderBottom: 'none',
                  }}
                >
                  <Grid
                    container
                    flexWrap="nowrap"
                    justifyContent="flex-end"
                    alignItems="baseline"
                    sx={{
                      transform: 'translateY(-130%)',
                    }}
                  >
                    <Box>
                      {rowIndex % 4 === 0 &&
                        `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:00`}
                      {rowIndex % 4 === 1 &&
                        `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:15`}
                      {rowIndex % 4 === 2 &&
                        `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:30`}
                      {rowIndex % 4 === 3 &&
                        `${timeSlot.hour < 10 ? '0' : ''}${timeSlot.hour}:45`}
                    </Box>
                    <Box
                      sx={{
                        position: 'relative',
                        bottom: '5px',
                        left: '16px',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        width: rowIndex % 4 === 0 ? '100px' : '20px',
                        height: '1px',
                      }}
                    ></Box>
                  </Grid>
                </TableCell>
                {rooms.map((room, colIndex) => {
                  const event = isEvent(colIndex, timeSlot);

                  return (
                    <TableCell
                      key={colIndex}
                      sx={{
                        paddingX: '1%',
                        textAlign: 'center',
                        borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        backgroundColor:
                          isSelected(colIndex, timeSlot) && !event
                            ? 'rgba(0, 0, 255, 0.1)'
                            : 'inherit',
                        position: 'relative',
                      }}
                    >
                      {event &&
                        rowIndex ===
                          times.findIndex(
                            (slot) =>
                              slot.hour === event.start.hour &&
                              slot.minute === event.start.minute
                          ) && (
                          <EventDisplay
                            title={event.title}
                            description={event.description}
                            height={getEventHeight(event.start, event.end)}
                          />
                        )}
                      <EventSelection
                        roomIndex={colIndex}
                        timeSlot={timeSlot}
                        handleMouseDown={handleMouseDown}
                        handleMouseUp={handleMouseUp}
                        handleMouseEnter={handleMouseEnter}
                        isSelected={isSelected(colIndex, timeSlot)}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
