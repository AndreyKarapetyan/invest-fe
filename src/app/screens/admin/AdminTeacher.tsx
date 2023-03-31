import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { DnD } from 'src/app/components/admin/DnD';
import {
  StyledDialog,
  StyledTextField,
  StyledFormControl,
} from 'src/app/components/admin/styled/teacher-dialog';
import { useInfiniteLoading } from 'src/app/hooks/useInfiniteLoading';

export function AdminTeacher(props: any) {
  const teacher = null;
  const [teacherData, setTeacherData] = useState(
    teacher || {
      name: null,
      lastname: null,
      email: null,
      password: null,
      level: null,
      phoneNumber: null,
      salaryPercent: null,
    }
  );
  const [showPassword, setShowPassword] = useState(false);
  // const [teacherOptionsOpen, setTeacherOptionsOpen] = useState(false); // For circular progress
  // const [groupOptionsOpen, setGroupOptionsOpen] = useState(false);
  // const [isNewGroup, setIsNewGroup] = useState(!studentData.teacherId);
  // const [groupFieldOpen, setGroupFieldOpen] = useState(
  //   Boolean(studentData.teacherId)
  // );

  const handleTeacherDataChange = (key: string, value: any) => {
    setTeacherData((curTeacher: any) => ({
      ...curTeacher,
      [key]: value,
    }));
  };

  const handleShowPassword = () => {
    setShowPassword((cur) => !cur);
  };

  // const handleTeacherOpen = () => {
  //   setTeacherOptionsOpen(true);
  // };

  // const handleTeacherClose = () => {
  //   setTeacherOptionsOpen(false);
  // };

  // const handleTeacherChange = (_event: any, option: any) => {
  //   if (option && option.id) {
  //     handleStudentDataChange('teacherId', option.id);
  //     getTeacherGroups(option.id);
  //   } else {
  //     handleStudentDataChange('teacherId', null);
  //     handleStudentDataChange('groupId', null);
  //     handleStudentDataChange('groupName', null);
  //     setGroupFieldOpen(false);
  //   }
  // };

  // const handleGroupChange = (_event: any, option: any) => {
  //   if (option && option.id) {
  //     handleStudentDataChange('groupId', option.id);
  //   } else {
  //     handleStudentDataChange('groupId', null);
  //   }
  // };

  // const handleNewGroupOpen = () => {
  //   handleStudentDataChange('groupId', null);
  //   setGroupFieldOpen(true);
  //   setIsNewGroup(true);
  // };

  // const handleExistingGroupOpen = () => {
  //   setGroupFieldOpen(true);
  //   setIsNewGroup(false);
  //   handleStudentDataChange('groupName', null);
  // };

  // const handleGroupOptionsOpen = () => {
  //   setGroupOptionsOpen(true);
  // };

  // const handleGroupOptionsClose = () => {
  //   setGroupOptionsOpen(false);
  // };

  const onInputChange = ({ target: { name, value } }: any) => {
    handleTeacherDataChange(name, value || null);
  };

  return (
    <Box
      sx={{
        width: '90%',
        maxHeight: '90vh',
        marginX: 'auto',
        marginTop: 3,
      }}
    >
    <Grid
      container
      direction="row"
      flexWrap="wrap"
      justifyContent="space-evenly"
    >
      <StyledTextField
        name="name"
        label="Name"
        value={teacherData.name}
        variant="outlined"
        required
        onChange={onInputChange}
      />
      <StyledTextField
        name="lastname"
        label="Lastname"
        value={teacherData.lastname}
        variant="outlined"
        required
        onChange={onInputChange}
      />
      <StyledTextField
        name="email"
        label="Email"
        value={teacherData.email}
        variant="outlined"
        onChange={onInputChange}
      />
      <StyledFormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={teacherData.password}
          onChange={onInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPassword}
                // onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </StyledFormControl>
      <DnD />
    </Grid>
    </Box>
  );
}

// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import Button from '@mui/material/Button';

// const initialItems = [
//   { id: '1', content: 'Item 1' },
//   { id: '2', content: 'Item 2' },
//   { id: '3', content: 'Item 3' },
//   { id: '4', content: 'Item 4' },
// ];

// interface CustomDraggableItemProps {
//   content: string;
//   provided: any;
// }

// const CustomDraggableItem = React.forwardRef<HTMLDivElement, CustomDraggableItemProps>(
//   ({ content, provided }, ref) => (
//     <Box
//       ref={ref}
//       {...provided.draggableProps}
//       {...provided.dragHandleProps}
//       sx={{
//         border: '1px solid black',
//         borderRadius: '5px',
//         padding: '10px',
//         marginY: '5px',
//         background: 'white',
//       }}
//     >
//       {content}
//     </Box>
//   )
// );

// export function AdminTeacherDialog() {
//   const [items, setItems] = useState(initialItems);
//   const [open, setOpen] = useState(false);

//   const onDragEnd = (result: any) => {
//     if (!result.destination) return;

//     const newItems = [...items];
//     const [reorderedItem] = newItems.splice(result.source.index, 1);
//     newItems.splice(result.destination.index, 0, reorderedItem);

//     setItems(newItems);
//   };

//   return (
//     <Grid container justifyContent="center">
//       <Grid item>
//         <Button variant="outlined" onClick={() => setOpen(true)}>
//           Open Dialog
//         </Button>
//       </Grid>
//       <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         keepMounted
//       >
//         <DialogTitle>Drag and Drop List</DialogTitle>
//         <DialogContent>
//           <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="items">
//               {(provided) => (
//                 <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ width: '100%' }}>
//                   {items.map(({ id, content }, index) => (
//                     <Draggable key={id} draggableId={id} index={index}>
//                       {(provided) => (
//                         <CustomDraggableItem content={content} provided={provided} />
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </Box>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </DialogContent>
//       </Dialog>
//     </Grid>
//   );
// }
