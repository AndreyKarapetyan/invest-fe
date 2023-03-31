import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, IconButton, TextField, Theme } from '@mui/material';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { TeacherStudent } from './TeacherStudent';

export function TeacherGroup({
  group: { id, name, students },
  handleGroupNameChange,
  handleGroupDelete,
}: any) {
  return (
    <Droppable droppableId={id}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <Grid
          ref={provided.innerRef}
          {...provided.droppableProps}
          container
          item
          direction="column"
          border="1px solid black"
          borderRadius="15px"
          padding="20px"
          width="300px"
          marginBottom="75px"
          marginX="15px"
          minHeight="150px"
          bgcolor={snapshot.isDraggingOver ? '#faf5f5' : 'white'}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'relative',
              backgroundColor: 'lightgray',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -15,
                right: -15,
                zIndex: (theme: Theme) => theme.zIndex.snackbar + 1,
              }}
            >
              <IconButton
                sx={{ color: 'red' }}
                onClick={() => handleGroupDelete(id)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Grid>
          <TextField
            sx={{ maxWidth: '400px' }}
            variant="standard"
            label="Group Name"
            name="groupName"
            value={name}
            onChange={(e) => handleGroupNameChange(id, e.target.value)}
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
