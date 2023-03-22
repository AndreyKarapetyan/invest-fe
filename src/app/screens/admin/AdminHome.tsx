import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  Fade,
  Grid,
  InputAdornment,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { Search } from '@mui/icons-material';
import { SearchField, TopCenterSnackbar } from './styled';
import { AdminStudentDialog } from 'src/app/components/admin/AdminStudentDialog';
import {
  useCreateStudent,
  useGetBranches,
  useGetStudents,
  useGetTeacherGroups,
  useGetTeachers,
  useUpdateStudent,
} from './hooks';
import { useEffect, useState } from 'react';

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

  return (
    <Box
      sx={{
        width: '80%',
        maxHeight: '90vh',
        marginX: 'auto',
        marginTop: 3,
      }}
    >
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
      <Fade in={isStudentCreated || isStudentUpdated}>
        <TopCenterSnackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={isStudentCreated || isStudentUpdated}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Success
          </Alert>
        </TopCenterSnackbar>
      </Fade>
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

        loadMore={loadMore}
        hasMore={hasMore}
      />
    </Box>
  );
};
