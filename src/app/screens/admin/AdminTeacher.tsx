import { Box, Grid } from '@mui/material';
import { DnD } from 'src/app/components/admin/DnD';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { TeacherFormComponents } from 'src/app/components/admin/SimpleFormComponents/TeacherFormComponents';
import { useCallback, useEffect, useState } from 'react';
import { useGetTeacher } from './hooks/teacher';
import { useParams } from 'react-router-dom';

export function AdminTeacher(props: any) {
  const { teacherId } = useParams();
  const [teacherData, setTeacherData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    level: '',
    phoneNumber: '',
    salaryPercent: '',
  });
  const { teacherLoading, teacherError, teacher, getTeacher } = useGetTeacher();

  const handleTeacherDataChange = (key: string, value: any) => {
    setTeacherData((curTeacher: any) => ({
      ...curTeacher,
      [key]: value,
    }));
  };

  const onInputChange = useCallback(({ target: { name, value } }: any) => {
    handleTeacherDataChange(name, value || null);
  }, []);

  useEffect(() => {
    const id = Number(teacherId);
    if (!isNaN(id) && id > 0) {
      getTeacher(id);
    }
  }, []);

  useEffect(() => {
    if (teacher) {
      setTeacherData(teacher);
    }
  }, [teacher]);

  console.log(teacherData);

  return teacherLoading ? (
    <LoadingIndicator open={teacherLoading} />
  ) : (
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
        direction="column"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          width="80%"
          container
          direction="row"
          flexWrap="wrap"
          justifyContent="space-evenly"
        >
          <TeacherFormComponents
            teacherData={teacherData}
            onInputChange={onInputChange}
          />
        </Grid>
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
