import { Box } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';

export function TeacherStudent({ student: { id, name }, index }: any) {
  return (
    <Draggable draggableId={`${id}`} index={index}>
      {(provided) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{
            marginTop: '30px',
            border: '1px solid black',
            borderRadius: '50%',
            padding: '10px',
            textAlign: 'center',
            backgroundColor: 'white'
          }}
        >
          {name}
        </Box>
      )}
    </Draggable>
  );
}
