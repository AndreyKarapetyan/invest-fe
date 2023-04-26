import AddIcon from '@mui/icons-material/Add';
import { AdminStudentDialog } from 'src/app/components/admin/AdminStudentDialog';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import { Button, debounce, Fade, Grid, LinearProgress } from '@mui/material';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { SearchField } from 'src/app/components/SearchField';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  useCreateStudent,
  useDeleteStudent,
  useGetStudents,
  useUpdateStudent,
} from './hooks/student';
import { useGetTeacherGroups, useGetTeachers } from './hooks/teacher';

const columns = [
  { label: 'Id', name: 'id' },
  { label: 'Name', name: 'name' },
  { label: 'Lastname', name: 'lastname' },
  { label: 'Status', name: 'status' },
  { label: 'Formal Fee', name: 'formalFee' },
  { label: 'Actual Fee', name: 'actualFee' },
  { label: 'Teacher', name: 'teacherFullName' },
];

export function AdminStudents() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [searchString, setSearchString] = useState('');
  const [deletableStudent, setDeletableStudent] = useState<number | null>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const { students, studentsLoading, hasMore, getStudents } = useGetStudents();
  const { teachers, teachersLoading, getTeachers } = useGetTeachers();
  const { groups, groupsLoading, getTeacherGroups } = useGetTeacherGroups();
  const {
    studentCreationError,
    resetStudentCreationSuccess,
    isStudentCreated,
    studentCreationLoading,
    createStudent,
  } = useCreateStudent();
  const {
    isStudentUpdated,
    resetStudentUpdateSuccess,
    studentUpdateError,
    studentUpdateLoading,
    updateStudent,
  } = useUpdateStudent();
  const {
    deleteStudent,
    isStudentDeleted,
    resetStudentDeleteSuccess, // @TODO: problematic if two deletes within the timeout: do something (move to local state)
    studentDeleteError,
    studentDeleteLoading,
  } = useDeleteStudent();
  const loadingTimeOut = useRef<any>();
  const branchDetails = useContext<any>(BranchContext);
  const currentBranch = branchDetails?.name;

  const debouncedGetStudents = useCallback(
    debounce((searchString: string) => {
      getStudents(currentBranch, true, searchString);
    }, 300),
    [currentBranch, getStudents]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchString(value);
      debouncedGetStudents(value);
    },
    [debouncedGetStudents]
  );

  const loadMore = useCallback(() => {
    getStudents(currentBranch, false, searchString);
  }, [currentBranch, getStudents, searchString]);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setStudent(null);
  }, []);

  const handleDialogOpen = useCallback(
    (studentData?: any) => {
      if (studentData) {
        setStudent(studentData);
        if (studentData.teacherId) {
          getTeacherGroups(studentData.teacherId);
        }
      }
      getTeachers(currentBranch);
      setDialogOpen(true);
    },
    [currentBranch, getTeacherGroups, getTeachers]
  );

  const handleDialogSubmit = useCallback(
    (studentData: any) => {
      if (studentData.id) {
        updateStudent(studentData);
      } else {
        createStudent({ ...studentData, branchName: currentBranch });
      }
    },
    [currentBranch]
  );

  const handleDeleteOpen = useCallback((studentId: number) => {
    setDeletableStudent(studentId);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setDeletableStudent(null);
  }, []);

  const handleDelete = useCallback(() => {
    deleteStudent(deletableStudent as number);
    setDeletableStudent(null);
  }, [deletableStudent]);

  useEffect(() => {
    if (currentBranch) {
      getStudents(currentBranch, true);
    }
  }, [currentBranch]);

  useEffect(() => {
    if (isStudentCreated || isStudentUpdated) {
      getStudents(currentBranch, true, searchString);
      setTimeout(() => {
        resetStudentCreationSuccess();
        resetStudentUpdateSuccess();
      }, 2000);
      setTimeout(() => handleDialogClose(), 500);
    }
  }, [isStudentCreated, isStudentUpdated]);

  useEffect(() => {
    if (isStudentDeleted) {
      getStudents(currentBranch, true, searchString);
      setTimeout(() => {
        resetStudentDeleteSuccess();
      }, 2000);
    }
  }, [isStudentDeleted]);

  useEffect(() => {
    if (
      studentCreationLoading ||
      studentUpdateLoading ||
      studentDeleteLoading
    ) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [studentCreationLoading, studentUpdateLoading, studentDeleteLoading]);

  return (
    <Grid width="80%" marginX="auto">
      <Grid container justifyContent="space-between" alignItems="center">
        <SearchField
          sx={{ marginY: 3, marginX: 2, width: '60vh' }}
          onChange={handleSearchChange}
        />
        <Button
          sx={{
            marginY: 3,
            marginX: 2,
            paddingY: 1,
            width: '200px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
          variant="outlined"
          onClick={() => handleDialogOpen()}
          startIcon={<AddIcon />}
        >
          New Student
        </Button>
      </Grid>
      {studentsLoading && (
        <Fade
          in={studentsLoading}
          style={{
            transitionDelay: studentsLoading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <LinearProgress />
        </Fade>
      )}
      <InfiniteLoadingTable
        columns={columns}
        rows={students}
        onEdit={handleDialogOpen}
        onDelete={handleDeleteOpen}
        loadMore={loadMore}
        hasMore={hasMore}
      />
      {dialogOpen && (
        <AdminStudentDialog
          student={student}
          handleSubmit={handleDialogSubmit}
          isOpen={dialogOpen}
          handleClose={handleDialogClose}
          teachers={teachers}
          teachersLoading={teachersLoading}
          groups={groups}
          groupsLoading={groupsLoading}
          getTeacherGroups={getTeacherGroups}
        />
      )}
      {(isStudentCreated || isStudentUpdated || isStudentDeleted) && (
        <TopCenterSnackbar
          message="Success"
          open={isStudentCreated || isStudentUpdated || isStudentDeleted}
        />
      )}
      {deletableStudent && (
        <ConfirmationDialog
          open={Boolean(deletableStudent)}
          onConfirm={handleDelete}
          onCancel={handleDeleteClose}
          message="Are you sure you want to delete this student?"
        />
      )}
      {isLoadingShowing && <LoadingIndicator open={isLoadingShowing} />}
    </Grid>
  );
}
