import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Box,
} from '@mui/material';
import { EventDisplay } from './EventDisplay';
import { EventSelection } from './EventSelection';

export function ScheduleTable({
  rooms,
  times,
  handleMouseEnter,
  isEvent,
  isSelected,
  getEventHeight,
  handleMouseDown,
  handleMouseUp,
}: any) {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{ borderBottom: 'none', minWidth: '200px' }}
          ></TableCell>
          {rooms.map((room: any, index: any) => (
            <TableCell
              key={index}
              sx={{
                minWidth: '200px',
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
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}></TableCell>
          {rooms.map((_: any, index: any) => (
            <TableCell
              key={index}
              sx={{
                minWidth: '200px',
                borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            ></TableCell>
          ))}
        </TableRow>
        {times.map((timeSlot: any, rowIndex: any) => (
          <TableRow key={rowIndex}>
            <TableCell
              onMouseEnter={() => handleMouseEnter(null, timeSlot)}
              sx={{
                minWidth: '200px',
                borderBottom: 'none',
                position: 'relative',
                width: '200px',
              }}
            >
              <Grid
                container
                flexWrap="nowrap"
                justifyContent="flex-end"
                alignItems="baseline"
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '24px',
                    right: rowIndex % 4 === 0 ? '90px' : '45px',
                    color: 'rgba(0, 0, 0, 0.6)',
                  }}
                >
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
                    position: 'absolute',
                    bottom: '33px',
                    left: rowIndex % 4 === 0 ? '120px' : '165px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    width: rowIndex % 4 === 0 ? '90px' : '45px',
                    height: '1px',
                  }}
                ></Box>
              </Grid>
            </TableCell>
            {rooms.map((_: any, colIndex: any) => {
              const event = isEvent(colIndex, timeSlot);
              return (
                <TableCell
                  key={colIndex}
                  sx={{
                    // paddingX: '1%',
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
                        (slot: any) =>
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
  );
}
