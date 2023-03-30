import { Grid, TextField } from '@mui/material';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { TeacherStudent } from './TeacherStudent';

export function TeacherGroup({ group: { id, name, students } }: any) {
  return (
    <Droppable droppableId={`${id}`}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <Grid
          ref={provided.innerRef}
          {...provided.droppableProps}
          container
          direction="column"
          border="1px solid black"
          borderRadius="15px"
          padding="20px"
          width="25%"
          minWidth="300px"
          maxWidth="400px"
          marginBottom="100px"
          bgcolor={snapshot.isDraggingOver ? '#faf5f5' : 'white'}
        >
          <TextField
            variant="standard"
            label="Group Name"
            name="groupName"
            value={name}
          />
          {students.map((student: any, index: any) => (
            <TeacherStudent key={student.id} student={student} index={index} />
          ))}
          {provided.placeholder}
        </Grid>
      )}
    </Droppable>
  );
}
