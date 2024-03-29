import AddIcon from '@mui/icons-material/Add';
import { AllStudents } from './AllStudents';
import { Box, Button, Fade, Grid, LinearProgress } from '@mui/material';
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import { deepClone } from 'src/app/utils/deepClone';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { isEqual } from 'lodash';
import { SearchField } from '../../SearchField';
import { TeacherGroup } from './TeacherGroup';
import { v4 as uuid } from 'uuid';

export const DnD = memo(function DnD({
  inputGroups,
  students,
  // hasMore,
  areStudentsLoading,
  // loadMore,
  handleGroupChange,
  shouldUpdateGroupsFromDnD,
  cancelSubmit,
}: any) {
  const [groups, setGroups] = useState<any>(inputGroups);
  const [groupNameErrors, setGroupNameErrors] = useState<{ [index: string]: boolean }>({});
  const previousInputGroups = useRef(null);
  const [searchString, setSearchString] = useState('');
  // const gridRef = useInfiniteLoading({
  //   hasMore,
  //   isLoading: areStudentsLoading,
  //   loadMore,
  // });

  const handleSearchChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchString(value);
  };

  const handleGroupNameChange = (groupId: string, newName: string) => {
    const groupsCopy = deepClone(groups);
    groupsCopy[groupId].name = newName;
    setGroups(groupsCopy);
    setGroupNameErrors((curErrors) => ({
      ...curErrors,
      [groupId]: !newName,
    }));
  };

  const handleGroupDelete = (groupId: number) => {
    const groupsCopy = deepClone(groups);
    delete groupsCopy[groupId];
    setGroups(groupsCopy);
  };

  const handleGroupCreate = () => {
    const groupsCopy = deepClone(groups);
    const newGroupId = uuid();
    groupsCopy[newGroupId] = {
      id: newGroupId,
      isNew: true,
      name: '',
      students: [],
    };
    setGroups(groupsCopy);
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) {
        return;
      }
      const groupsCopy = deepClone(groups);
      const students = groupsCopy[source.droppableId].students;
      const [reorderedItem] = students.splice(source.index, 1);
      students.splice(destination.index, 0, reorderedItem);
      groupsCopy[source.droppableId].students = students;
      setGroups(groupsCopy);
    } else {
      const groupsCopy = deepClone(groups);
      const sourceStudents = groupsCopy[source.droppableId].students;
      const [reorderedItem] = sourceStudents.splice(source.index, 1);
      const destinationStudents = groupsCopy[destination.droppableId].students;
      destinationStudents.splice(destination.index, 0, reorderedItem);
      groupsCopy[source.droppableId].students = sourceStudents;
      groupsCopy[destination.droppableId].students = destinationStudents;
      setGroups(groupsCopy);
    }
  };

  useEffect(() => {
    let groupsCopy: any;
    if (!previousInputGroups.current || !isEqual(previousInputGroups.current, inputGroups)) {
      groupsCopy = deepClone(inputGroups);
      previousInputGroups.current = inputGroups;
    } else {
      groupsCopy = deepClone(groups);
    }
    const studentGroup = groupsCopy['studentList'];
    const curStudentIds = Object.values(groupsCopy)
      .flatMap(({ students }: any) => students.map(({ id }: any) => id))
      .reduce((acc: any, id) => {
        acc[id] = true;
        return acc;
      }, {});
    const added = students.filter(({ id }: any) => !curStudentIds[id]);
    const existingStudents = studentGroup.students;
    const updatedStudents = [...existingStudents, ...added];
    groupsCopy['studentList'].students = updatedStudents;
    setGroups(groupsCopy);
  }, [inputGroups, students]);

  useEffect(() => {
    if (shouldUpdateGroupsFromDnD) {
      const errors = Object.entries(groups).reduce((acc: { [index: string]: boolean }, [key, { name }]: any) => {
        if (key === 'studentList') {
          return acc;
        }
        acc[key] = !name;
        return acc;
      }, {});
      setGroupNameErrors(errors as any);
      const areErrors = Object.values(errors).some((err) => err);
      if (areErrors) {
        cancelSubmit();
      } else {
        handleGroupChange(groups);
      }
    }
  }, [shouldUpdateGroupsFromDnD]);

  const teacherGroups = Object.values(groups).filter((group: any) => group.id !== 'studentList');
  // Need this workaround because DnD works with indexes
  const allStudentsList = groups['studentList'].students.map(({ fullName, ...rest }: any) => ({
    fullName,
    ...rest,
    isFilteredOut: !fullName.includes(searchString),
  }));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container direction="row" flexWrap="wrap" justifyContent="space-between" height="800px">
        <Grid container direction="column" width="50%" justifyContent="flex-start" alignItems="center">
          <Box component="h2">Groups</Box>
          <Grid container justifyContent="space-around" alignItems="center" marginY={3}>
            {teacherGroups.map((group: any) => (
              <TeacherGroup
                key={group.id}
                group={group}
                nameError={groupNameErrors[group.id]}
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
              marginBottom: '50px',
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
            value={searchString}
            onChange={handleSearchChange}
          />
          {areStudentsLoading && (
            <Fade
              in={areStudentsLoading}
              style={{
                transitionDelay: areStudentsLoading ? '100ms' : '0ms',
              }}
              unmountOnExit
            >
              <LinearProgress
                sx={{
                  width: '280px',
                  position: 'relative',
                  bottom: '10px',
                }}
              />
            </Fade>
          )}
          <AllStudents /* gridRef={gridRef} */ students={allStudentsList} />
        </Grid>
      </Grid>
    </DragDropContext>
  );
});
