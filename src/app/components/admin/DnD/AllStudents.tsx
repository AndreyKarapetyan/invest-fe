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
          bgcolor={snapshot.isDraggingOver ? '#faf5f5' : 'white'}
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
