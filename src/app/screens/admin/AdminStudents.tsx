import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AdminStudentDialog } from 'src/app/components/admin/AdminStudentDialog';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import { Button, debounce, Fade, Grid, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { SearchField } from 'src/app/components/SearchField';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { useCreateStudent, useDeleteStudent, useGetStudents, useUpdateStudent } from './hooks/student';
import { useErrorBoundary } from 'react-error-boundary';
import { useGetTeacherGroups, useGetTeachers } from './hooks/teacher';

export function AdminStudents() {
  const branchDetails = useContext<any>(BranchContext);
  const currentBranch = branchDetails?.name;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [searchString, setSearchString] = useState('');
  const [deletableStudent, setDeletableStudent] = useState<number | null>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const { studentsError, students, studentsLoading, hasMore, getStudents } = useGetStudents();
  const { teachersError, teachers, teachersLoading, getTeachers } = useGetTeachers();
  const { groupsError, groups, groupsLoading, getTeacherGroups } = useGetTeacherGroups();
  const { studentCreationError, resetStudentCreationSuccess, isStudentCreated, studentCreationLoading, createStudent } =
    useCreateStudent();
  const { isStudentUpdated, resetStudentUpdateSuccess, studentUpdateError, studentUpdateLoading, updateStudent } =
    useUpdateStudent();
  const {
    deleteStudent,
    isStudentDeleted,
    resetStudentDeleteSuccess, // @TODO: problematic if two deletes within the timeout: do something (move to local state)
    studentDeleteError,
    studentDeleteLoading,
  } = useDeleteStudent();
  const loadingTimeOut = useRef<any>();
  const { showBoundary } = useErrorBoundary();

  const debouncedGetStudents = useCallback(
    debounce((searchString: string) => {
      getStudents(currentBranch, true, searchString);
    }, 300),
    [currentBranch, getStudents],
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchString(value);
      debouncedGetStudents(value);
    },
    [debouncedGetStudents],
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
    [currentBranch, getTeacherGroups, getTeachers],
  );

  const handleDialogSubmit = useCallback(
    (studentData: any) => {
      if (studentData.id) {
        updateStudent({ ...studentData, branchName: currentBranch });
      } else {
        createStudent({ ...studentData, branchName: currentBranch });
      }
    },
    [currentBranch],
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
      getStudents(currentBranch, true, searchString);
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
    if (studentCreationLoading || studentUpdateLoading || studentDeleteLoading) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [studentCreationLoading, studentUpdateLoading, studentDeleteLoading]);

  const columns = useMemo(
    () => [
      { label: 'Id', name: 'id', Component: Fragment, withValue: true },
      { label: 'Name', name: 'name', Component: Fragment, withValue: true },
      { label: 'Lastname', name: 'lastname', Component: Fragment, withValue: true },
      { label: 'Status', name: 'status', Component: Fragment, withValue: true },
      { label: 'Formal Fee', name: 'formalFee', Component: Fragment, withValue: true },
      { label: 'Actual Fee', name: 'actualFee', Component: Fragment, withValue: true },
      { label: 'Teacher', name: 'teacherFullName', Component: Fragment, withValue: true },
      {
        label: 'Edit',
        name: 'edit',
        Component: ({ row }: any) => (
          <Tooltip title="Edit">
            <IconButton onClick={() => handleDialogOpen(row)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
        withValue: false,
      },
      {
        label: 'delete',
        name: 'delete',
        Component: ({ row }: any) => (
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteOpen(row.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
        withValue: false,
      },
    ],
    [handleDeleteOpen, handleDialogOpen],
  );

  const error =
    studentsError || teachersError || groupsError || studentCreationError || studentUpdateError || studentDeleteError;

  return (
    <Grid width="80%" marginX="auto">
      <Grid container justifyContent="space-between" alignItems="center">
        <SearchField sx={{ marginY: 3, marginX: 2, width: '60vh' }} onChange={handleSearchChange} />
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
      <InfiniteLoadingTable columns={columns} rows={students} loadMore={loadMore} />
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
        <TopCenterSnackbar message="Success" open={isStudentCreated || isStudentUpdated || isStudentDeleted} />
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
      {error && showBoundary(error)}
    </Grid>
  );
}
