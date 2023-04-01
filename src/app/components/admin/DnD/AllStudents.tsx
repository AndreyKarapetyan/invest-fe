import { Grid } from '@mui/material';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { TeacherStudent } from './TeacherStudent';
import { memo } from 'react';

export const AllStudents = memo(function ({ students, gridRef }: any) {
  return (
    <Grid
      ref={gridRef}
      sx={{ overflow: 'auto' }}
      maxHeight="60vh"
      border="1px solid black"
      borderRadius="15px"
      paddingX="20px"
      paddingBottom="20px"
      width="300px"
      minHeight="150px"
    >
      <Droppable droppableId={`studentList`}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <Grid
            ref={provided.innerRef}
            {...provided.droppableProps}
            bgcolor={snapshot.isDraggingOver ? '#faf5f5' : 'white'}
          >
            {students.map((student: any, index: number) => (
              <TeacherStudent
                key={student.id}
                student={student}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    </Grid>
  );
});
