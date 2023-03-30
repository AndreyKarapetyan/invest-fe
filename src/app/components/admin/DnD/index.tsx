import { AllStudents } from './AllStudents';
import { allStudents, groupMockData } from './mockData';
import { Box, Grid, InputAdornment } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { TeacherGroup } from './TeacherGroup';
import { useState } from 'react';
import { deepClone } from 'src/app/utils/deepClone';
import { Search } from '@mui/icons-material';
import { SearchField } from '../../SearchField';
import { useInfiniteLoading } from 'src/app/hooks/useInfiniteLoading';

export function DnD() {
  const [groups, setGroups] = useState(groupMockData);
  const [studentList, setStudentList] = useState(allStudents);

  // const gridRef = useInfiniteLoading({ hasMore: true, isLoading: false, loadMore });

  const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) {
        return;
      }
      const newGroups: typeof groups = deepClone(groups);
      const sourceGroupIndex = newGroups.findIndex(
        (group) => group.id.toString() === source.droppableId
      );
      const students = [...newGroups[sourceGroupIndex].students];
      const [reorderedItem] = students.splice(source.index, 1);
      students.splice(destination.index, 0, reorderedItem);
      newGroups[sourceGroupIndex].students = students;
      setGroups(newGroups);
    } else {
      const newGroups: typeof groups = deepClone(groups);
      const sourceGroupIndex = newGroups.findIndex(
        (group) => group.id.toString() === source.droppableId
      );
      const sourceStudents = [...newGroups[sourceGroupIndex].students];
      const [reorderedItem] = sourceStudents.splice(source.index, 1);
      const destinationGroupIndex = newGroups.findIndex(
        (group) => group.id.toString() === destination.droppableId
      );
      const destinationStudents = [
        ...newGroups[destinationGroupIndex].students,
      ];
      destinationStudents.splice(destination.index, 0, reorderedItem);
      newGroups[sourceGroupIndex].students = sourceStudents;
      newGroups[destinationGroupIndex].students = destinationStudents;
      setGroups(newGroups);
    }
  };

  const teacherGroups = groups.filter((group) => group.id !== 'studentList');
  const allStudentsList = groups.filter(
    (group) => group.id === 'studentList'
  )[0].students;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid
        container
        direction="row"
        flexWrap="wrap"
        justifyContent="space-evenly"
        height="800px"
      >
        <Grid
          container
          direction="column"
          width="40%"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box component="h2">Groups</Box>
          {teacherGroups.map((group) => (
            <TeacherGroup key={group.id} group={group} />
          ))}
        </Grid>
        <Grid
          container
          direction="column"
          width="40%"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box component="h2">List of Students</Box>
          <SearchField
            sx={{ marginY: 3, marginX: 2, width: '52%', minWidth: '250px' }}
          />
          <AllStudents students={allStudentsList} />
        </Grid>
      </Grid>
    </DragDropContext>
  );
}

// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';

// const initialItems = [
//   { id: '1', content: 'Item 1' },
//   { id: '2', content: 'Item 2' },
//   { id: '3', content: 'Item 3' },
//   { id: '4', content: 'Item 4' },
// ];

// export function DnD() {
//   const [items, setItems] = useState(initialItems);

//   const onDragEnd = (result: any) => {
//     if (!result.destination) return;

//     const newItems = [...items];
//     const [reorderedItem] = newItems.splice(result.source.index, 1);
//     newItems.splice(result.destination.index, 0, reorderedItem);

//     setItems(newItems);
//   };

//   return (
//     <Grid container justifyContent="center">
//       <Grid item xs={6}>
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="items">
//             {(provided) => (
//               <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ width: '100%' }}>
//                 {items.map(({ id, content }, index) => (
//                   <Draggable key={id} draggableId={id} index={index}>
//                     {(provided) => (
//                       <Box
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         sx={{
//                           border: '1px solid black',
//                           borderRadius: '5px',
//                           padding: '10px',
//                           marginY: '5px',
//                           background: 'white',
//                         }}
//                       >
//                         {content}
//                       </Box>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </Box>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </Grid>
//     </Grid>
//   );
// }
