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
import { TimeSlot, convertToMinutes } from './utils';

interface ScheduleTableProps {
  rooms: string[];
  times: { [index: string]: TimeSlot };
  handleMouseEnter: (_: any, timeSlot: TimeSlot) => void;
}

export function ScheduleTable({
  rooms,
  times,
  handleMouseEnter,
  getEventAtPosition,
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
            sx={{
              borderBottom: 'none',
              minWidth: '200px',
              position: 'sticky',
              borderRight: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              left: 0,
              zIndex: 10,
            }}
          ></TableCell>
          {rooms.map((room: any) => (
            <TableCell
              key={room}
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
          <TableCell
            sx={{
              borderBottom: 'none',
              position: 'sticky',
              borderRight: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              left: 0,
              zIndex: 1,
            }}
          ></TableCell>
          {rooms.map((room: any, index: any) => (
            <TableCell
              key={`_${room}`}
              sx={{
                minWidth: '200px',
                borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            ></TableCell>
          ))}
        </TableRow>
        {Object.values(times).map((timeSlot: any, rowIndex: any) => (
          <TableRow key={JSON.stringify(timeSlot)}>
            <TableCell
              onMouseEnter={() => handleMouseEnter(null, timeSlot)}
              sx={{
                minWidth: '200px',
                borderBottom: 'none',
                width: '200px',
                position: 'sticky',
                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                left: 0,
                zIndex: 1,
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
            {rooms.map((room: any, colIndex: any) => {
              const event = getEventAtPosition(colIndex, timeSlot);
              return (
                <TableCell
                  key={`${JSON.stringify(timeSlot)}_${room}`}
                  sx={{
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
                    convertToMinutes(timeSlot) ===
                    convertToMinutes(times[`${event.start.hour} ${event.start.minute}`]) && (
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
