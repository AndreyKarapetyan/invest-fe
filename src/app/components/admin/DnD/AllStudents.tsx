import { Grid } from '@mui/material';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { TeacherStudent } from './TeacherStudent';

export function AllStudents({ students }: any) {
  return (
    <Droppable droppableId={`studentList`}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <Grid
          ref={provided.innerRef}
          {...provided.droppableProps}
          border="1px solid black"
          borderRadius="15px"
          paddingX="20px"
          paddingBottom="20px"
          width="25%"
          minWidth="300px"
          maxWidth="400px"
          bgcolor={snapshot.isDraggingOver ? '#faf5f5' : 'white'}
          maxHeight="60vh"
          sx={{ overflow: 'auto' }}
        >
          {students.map((student: any, index: number) => (
            <TeacherStudent key={student.id} student={student} index={index}/>
          ))}
          {provided.placeholder}
        </Grid>
      )}
    </Droppable>
  );
}
