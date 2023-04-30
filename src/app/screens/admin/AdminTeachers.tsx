import AddIcon from '@mui/icons-material/Add';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import { Button, Fade, Grid, LinearProgress } from '@mui/material';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { useContext, useEffect, useRef, useState } from 'react';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { SearchField } from 'src/app/components/SearchField';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { useDeleteTeacher, useGetTeachers } from './hooks/teacher';
import { useNavigate } from 'react-router-dom';

const columns = [
  { label: 'Id', name: 'id' },
  { label: 'Name', name: 'name' },
  { label: 'Lastname', name: 'lastname' },
];

export default function AdminTeachers() {
  const [deletableTeacher, setDeletableTeacher] = useState<number | null>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const { teachers, teachersLoading, getTeachers } = useGetTeachers();
  const {
    teacherDeleteLoading,
    teacherDeleteError,
    isTeacherDeleted,
    resetTeacherDeleteSuccess,
    deleteTeacher,
  } = useDeleteTeacher();
  const loadingTimeOut = useRef<any>();
  const branchDetails = useContext<any>(BranchContext);
  const currentBranch = branchDetails?.name;
  const navigate = useNavigate();

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

  return (
    <Grid width="80%" marginX="auto">
      <Grid container justifyContent="space-between" alignItems="center">
        <SearchField sx={{ marginY: 3, marginX: 2, width: '60vh' }} />
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
      {isTeacherDeleted && (
        <TopCenterSnackbar message="Success" open={isTeacherDeleted} />
      )}
      {deletableTeacher && (
        <ConfirmationDialog
          open={Boolean(deletableTeacher)}
          onConfirm={handleDelete}
          onCancel={handleDeleteClose}
          message="Are you sure you want to delete this student?"
        />
      )}
      {isLoadingShowing && <LoadingIndicator open={isLoadingShowing} />}
    </Grid>
  );
}
