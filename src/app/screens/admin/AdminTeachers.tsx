import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import { Button, Fade, Grid, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { SearchField } from 'src/app/components/SearchField';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { ChangeEvent, Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDeleteTeacher, useGetTeachers } from './hooks/teacher';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

export function AdminTeachers() {
  const [deletableTeacher, setDeletableTeacher] = useState<number | null>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const [searchString, setSearchString] = useState('');
  const { teachersError, teachers: allTeachers, teachersLoading, getTeachers } = useGetTeachers();
  const { teacherDeleteLoading, teacherDeleteError, isTeacherDeleted, resetTeacherDeleteSuccess, deleteTeacher } =
    useDeleteTeacher();
  const loadingTimeOut = useRef<any>();
  const branchDetails = useContext<any>(BranchContext);
  const currentBranch = branchDetails?.name;
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const handleSearchChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => setSearchString(value),
    [],
  );

  const handleDeleteOpen = (teacherId: number) => {
    setDeletableTeacher(teacherId);
  };

  const handleDeleteClose = () => {
    setDeletableTeacher(null);
  };

  const handleDelete = () => {
    deleteTeacher(deletableTeacher as number);
    setDeletableTeacher(null);
  };

  const navigateToTeacherPage = (teacher?: any) => {
    navigate(teacher ? `./${currentBranch}/${teacher.id}` : `./${currentBranch}/new`);
  };

  useEffect(() => {
    if (currentBranch) {
      getTeachers(currentBranch);
    }
  }, [currentBranch]);

  useEffect(() => {
    if (isTeacherDeleted) {
      getTeachers(currentBranch);
      setTimeout(() => {
        resetTeacherDeleteSuccess();
      }, 2000);
    }
  }, [isTeacherDeleted]);

  useEffect(() => {
    if (teacherDeleteLoading) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [teacherDeleteLoading]);

  const error = teachersError || teacherDeleteError;

  const columns = useMemo(
    () => [
      { label: 'Id', name: 'id', Component: Fragment, withValue: true },
      { label: 'Name', name: 'name', Component: Fragment, withValue: true },
      { label: 'Lastname', name: 'lastname', Component: Fragment, withValue: true },
      {
        label: '',
        name: '',
        Component: ({ row }: any) => (
          <Tooltip title="Edit">
            <IconButton onClick={() => navigateToTeacherPage(row)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
        withValue: false,
      },
      {
        label: '',
        name: '',
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
    [],
  );

  const teachers = allTeachers.filter(
    ({ id, name, lastname }) =>
      id.toString().includes(searchString) ||
      name.toLowerCase().includes(searchString.toLowerCase()) ||
      lastname.toLowerCase().includes(searchString.toLowerCase()),
  );

  return (
    <Grid width="80%" marginX="auto">
      <Grid container justifyContent="space-between" alignItems="center">
        <SearchField
          sx={{ marginY: 3, marginX: 2, width: '60vh' }}
          value={searchString}
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
          onClick={() => navigateToTeacherPage()}
          startIcon={<AddIcon />}
        >
          New Teacher
        </Button>
      </Grid>
      {teachersLoading && (
        <Fade
          in={teachersLoading}
          style={{
            transitionDelay: teachersLoading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <LinearProgress />
        </Fade>
      )}
      <InfiniteLoadingTable
        columns={columns}
        rows={teachers}
        onEdit={navigateToTeacherPage}
        onDelete={handleDeleteOpen}
        hasMore={false}
      />
      {isTeacherDeleted && <TopCenterSnackbar message="Success" open={isTeacherDeleted} />}
      {deletableTeacher && (
        <ConfirmationDialog
          open={Boolean(deletableTeacher)}
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
