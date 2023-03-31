import { AllStudents } from './AllStudents';
import { groupMockData } from './mockData';
import { Box, Button, Grid } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { TeacherGroup } from './TeacherGroup';
import { useCallback, useEffect, useState } from 'react';
import { deepClone } from 'src/app/utils/deepClone';
import { SearchField } from '../../SearchField';
import { useInfiniteLoading } from 'src/app/hooks/useInfiniteLoading';
import { useGetStudents } from 'src/app/screens/admin/hooks/student';
import AddIcon from '@mui/icons-material/Add';

// @TODO: can we get around without deepClone, instead using setState with function?
// @TODO: groupId as key

export function DnD() {
  const [groups, setGroups] = useState(groupMockData);
  // const [studentList, setStudentList] = useState(allStudents);
  const { students, studentsLoading, hasMore, getStudents } = useGetStudents();

  const loadMore = useCallback(() => {
    getStudents('Artashat');
  }, [getStudents]);

  const gridRef = useInfiniteLoading({
    hasMore,
    isLoading: studentsLoading,
    loadMore,
  });

  const handleGroupNameChange = (groupId: number, newName: string) => {
    const groupsCopy = deepClone(groups);
    const groupIndex = groupsCopy.findIndex((group) => group.id === groupId);
    groupsCopy[groupIndex].name = newName;
    setGroups(groupsCopy);
  };

  const handleGroupDelete = (groupId: number) => {
    const groupsCopy = deepClone(groups);
    const groupIndex = groupsCopy.findIndex((group) => group.id === groupId);
    groupsCopy.splice(groupIndex, 1);
    setGroups(groupsCopy);
  };

  const handleGroupCreate = () => {
    const groupsCopy = deepClone(groups);
    groupsCopy.push({
      id: -Math.round(Math.random() * 10 ** 6),
      name: '',
      students: [],
    });
    setGroups(groupsCopy);
  };

  useEffect(() => {
    getStudents('Artashat', true);
  }, []);

  useEffect(() => {
    const allStudentsGroup = groups.find(({ id }) => id === 'studentList');
    if (!allStudentsGroup) {
      setGroups((curGroups) => [
        ...curGroups,
        { id: 'studentList', students } as any,
      ]);
    }
    setGroups((curGroups) => {
      const curStudentIds = curGroups
        .flatMap(({ students }) => students.map(({ id }) => id))
        .reduce((acc: any, id) => {
          acc[id] = true;
          return acc;
        }, {});
      const added = students.filter(({ id }) => !curStudentIds[id]);
      const curGroupsCopy = deepClone(curGroups);
      const studentGroupIndex = curGroupsCopy.findIndex(
        (group) => group.id === 'studentList'
      );
      const existingStudents = curGroupsCopy[studentGroupIndex].students as any;
      const updatedStudents = [...existingStudents, ...added];
      curGroupsCopy[studentGroupIndex].students = updatedStudents;
      return curGroupsCopy;
    });
  }, [students]);

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
        justifyContent="space-between"
        height="800px"
      >
        <Grid
          container
          direction="column"
          width="50%"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box component="h2">Groups</Box>
          <Grid container justifyContent="space-around" alignItems="center">
            {teacherGroups.map((group) => (
              <TeacherGroup
                key={group.id}
                group={group}
                handleGroupNameChange={handleGroupNameChange}
                handleGroupDelete={handleGroupDelete}
              />
            ))}
          </Grid>
          <Button
            sx={{
              width: '200px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            variant="contained"
            onClick={handleGroupCreate}
            startIcon={<AddIcon />}
          >
            New Group
          </Button>
        </Grid>
        <Grid
          container
          direction="column"
          width="50%"
          justifyContent="flex-start"
          alignItems="center"
          paddingLeft="10%"
        >
          <Box component="h2">List of Students</Box>
          <SearchField
            sx={{ marginY: 3, marginX: 2, width: '52%', minWidth: '250px' }}
          />
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
            <AllStudents students={allStudentsList} />
          </Grid>
        </Grid>
      </Grid>
    </DragDropContext>
  );
}
