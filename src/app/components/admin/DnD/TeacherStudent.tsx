import { Box } from '@mui/material';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

export function TeacherStudent({ student: { id, name }, index }: any) {
  return (
    <Draggable draggableId={`${id}`} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            marginTop: '30px',
            border: '1px solid black',
            borderRadius: '20px',
            padding: '10px',
            textAlign: 'center',
            backgroundColor: snapshot.isDragging ? '#ebf5ef' : 'white'
          }}
        >
          {name}
        </Box>
      )}
    </Draggable>
  );
}
