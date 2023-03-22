import AddIcon from '@mui/icons-material/Add';
import { AdminStudentDialog } from 'src/app/components/admin/AdminStudentDialog';
import {
  Box,
  Button,
  Fade,
  Grid,
  InputAdornment,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import { ConfirmationDialog } from 'src/app/components/Confirmation';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { LoadingIndicator } from 'src/app/components/LoadingIndicator';
import { Search } from '@mui/icons-material';
import { SearchField } from './styled';
import { TopCenterSnackbar } from 'src/app/components/TopCenterSnackbar';
import {
  useCreateStudent,
  useDeleteStudent,
  useGetBranches,
  useGetStudents,
  useGetTeacherGroups,
  useGetTeachers,
  useUpdateStudent,
} from './hooks';
import { useEffect, useRef, useState } from 'react';

const columns = [
  { label: 'Id', name: 'id' },
  { label: 'Name', name: 'name' },
  { label: 'Lastname', name: 'lastname' },
  { label: 'Status', name: 'status' },
  { label: 'Formal Fee', name: 'formalFee' },
  { label: 'Actual Fee', name: 'actualFee' },
  { label: 'Teacher', name: 'teacherFullName' },
];

export const AdminHome = () => {
  const [currentBranch, setCurrentBranch] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [deletableStudent, setDeletableStudent] = useState<number | null>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const { branches, branchesLoading, getBranches } = useGetBranches();
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
    resetStudentDeleteSuccess,
    studentDeleteError,
    studentDeleteLoading,
  } = useDeleteStudent();
  const loadingTimeOut = useRef<any>();

  const handleBranchChange = (_event: any, branch: any) => {
    setCurrentBranch(branch);
  };

  const loadMore = () => {
    getStudents(currentBranch);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setStudent(null);
  };

  const handleDialogOpen = (studentData?: any) => {
    if (studentData) {
      setStudent(studentData);
      if (studentData.teacherId) {
        getTeacherGroups(studentData.teacherId);
      }
    }
    getTeachers(currentBranch);
    setDialogOpen(true);
  };

  const handleDialogSubmit = (studentData: any) => {
    if (studentData.id) {
      updateStudent(studentData);
    } else {
      createStudent({ ...studentData, branchName: currentBranch });
    }
  };

  const handleDeleteOpen = (studentId: number) => {
    setDeletableStudent(studentId);
  };

  const handleDeleteClose = () => {
    setDeletableStudent(null);
  };

  const handleDelete = () => {
    deleteStudent(deletableStudent as number);
    setDeletableStudent(null);
  };

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    if (branches.length && !currentBranch) {
      setCurrentBranch(branches[0].name);
    }
    if (currentBranch) {
      getStudents(currentBranch, true);
    }
  }, [branches, currentBranch]);

  useEffect(() => {
    if (isStudentCreated || isStudentUpdated) {
      getStudents(currentBranch, true);
      setTimeout(() => {
        resetStudentCreationSuccess();
        resetStudentUpdateSuccess();
      }, 2000);
      setTimeout(() => handleDialogClose(), 500);
    }
  }, [isStudentCreated, isStudentUpdated]);

  useEffect(() => {
    if (isStudentDeleted) {
      getStudents(currentBranch, true);
      setTimeout(() => {
        resetStudentDeleteSuccess();
      }, 2000);
    }
  }, [isStudentDeleted]);

  useEffect(() => {
    if (
      branchesLoading ||
      studentCreationLoading ||
      studentUpdateLoading ||
      studentDeleteLoading
    ) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [
    branchesLoading,
    studentCreationLoading,
    studentUpdateLoading,
    studentDeleteLoading,
  ]);

  return (
    <Box
      sx={{
        width: '80%',
        maxHeight: '90vh',
        marginX: 'auto',
        marginTop: 3,
      }}
    >
      {currentBranch && (
        <Tabs
          sx={{ display: 'flex', justifyContent: 'center' }}
          value={currentBranch}
          onChange={handleBranchChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          {branches.map(({ name }) => (
            <Tab key={name} value={name} label={name} sx={{ flexGrow: 1 }} />
          ))}
        </Tabs>
      )}
      <Grid
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
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
    </Box>
  );
};
