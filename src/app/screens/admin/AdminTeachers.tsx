import AddIcon from '@mui/icons-material/Add';
import { AdminStudentDialog } from 'src/app/components/admin/AdminStudentDialog';
import { BranchContext } from 'src/app/components/admin/WithBranches';
import {
  Button,
  Fade,
  Grid,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { Search } from '@mui/icons-material';
import { SearchField } from './styled';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import { useDeleteTeacher, useGetTeachers } from './hooks/teacher';
import { AdminTeacherDialog } from 'src/app/components/admin/AdminTeacherDialog';

const columns = [
  { label: 'Id', name: 'id' },
  { label: 'Name', name: 'name' },
  { label: 'Lastname', name: 'lastname' },
];

export function AdminTeachers() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teacher, setTeacher] = useState<any>(null);
  const [deletableTeacher, setDeletableTeacher] = useState<number | null>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  // const { students, studentsLoading, hasMore, getStudents } = useGetStudents();
  const { teachers, teachersLoading, getTeachers } = useGetTeachers();
  const {
    teacherDeleteLoading,
    teacherDeleteError,
    isTeacherDeleted,
    resetTeacherDeleteSuccess,
    deleteTeacher,
  } = useDeleteTeacher();
  // const { groups, groupsLoading, getTeacherGroups } = useGetTeacherGroups();
  const loadingTimeOut = useRef<any>();
  const currentBranch = useContext(BranchContext);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTeacher(null);
  };

  const handleDialogOpen = (teacherData?: any) => {
    if (teacherData) {
      setTeacher(teacherData);
      if (teacherData.id) {
        // getTeacherGroups(studentData.teacherId);
      }
    }
    // getTeachers(currentBranch);
    setDialogOpen(true);
  };

  const handleDialogSubmit = (teacherData: any) => {
    if (teacherData.id) {
      // updateStudent(studentData);
    } else {
      // createStudent({ ...studentData, branchName: currentBranch });
    }
  };

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

  useEffect(() => {
    if (currentBranch) {
      getTeachers(currentBranch);
    }
  }, [currentBranch]);

  // useEffect(() => {
  //   if (isStudentCreated || isStudentUpdated) {
  //     getStudents(currentBranch, true);
  //     setTimeout(() => {
  //       resetStudentCreationSuccess();
  //       resetStudentUpdateSuccess();
  //     }, 2000);
  //     setTimeout(() => handleDialogClose(), 500);
  //   }
  // }, [isStudentCreated, isStudentUpdated]);

  useEffect(() => {
    if (isTeacherDeleted) {
      getTeachers(currentBranch);
      setTimeout(() => {
        resetTeacherDeleteSuccess();
      }, 2000);
    }
  }, [isTeacherDeleted]);

  useEffect(() => {
    if (
      // teacherCreationLoading ||
      // teacherUpdateLoading ||
      teacherDeleteLoading
    ) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [
    /* teacherCreationLoading, teacherUpdateLoading,  */ teacherDeleteLoading,
  ]);

  return (
    <Fragment>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <SearchField
          sx={{ marginY: 3, marginX: 2 }}
          placeholder="Search..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
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
        onEdit={handleDialogOpen}
        onDelete={handleDeleteOpen}
        hasMore={false}
      />
      {dialogOpen && (
        <AdminTeacherDialog
          teacher={teacher}
          handleSubmit={handleDialogSubmit}
          isOpen={dialogOpen}
          handleClose={handleDialogClose}
          // teachers={teachers}
          // teachersLoading={teachersLoading}
          // groups={groups}
          // groupsLoading={groupsLoading}
          // getTeacherGroups={getTeacherGroups}
        />
      )}
      {/* {(isStudentCreated || isStudentUpdated || isStudentDeleted) && (
        <TopCenterSnackbar
          message="Success"
          open={isStudentCreated || isStudentUpdated || isStudentDeleted}
        />
      )} */}
      {deletableTeacher && (
        <ConfirmationDialog
          open={Boolean(deletableTeacher)}
          onConfirm={handleDelete}
          onCancel={handleDeleteClose}
          message="Are you sure you want to delete this student?"
        />
      )}
      {isLoadingShowing && <LoadingIndicator open={isLoadingShowing} />}
    </Fragment>
  );
}
