import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  LinearProgress,
  styled,
  Tab,
  Tabs,
  Tooltip,
  TooltipProps,
} from '@mui/material';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { StudentDialog } from 'src/app/components/StudentDialog';
import { cloneElement, Fragment, useEffect, useState } from 'react';
import { useGetBranches, useGetStudents, useGetTeachers } from './hooks';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const columns = [{ name: 'id' }, { name: 'name' }, { name: 'lastname' }];

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  '& .MuiTooltip-tooltip': {
    fontWeight: 900,
  },
}));

export function StyledIcon(props: any) {
  return (
    <StyledTooltip
      title={props.tooltipTitle}
      placement={props.placement}
      enterDelay={500}
    >
      <IconButton onClick={props.onClick} size="large">
        {cloneElement(props.children, {
          fontSize: props.fontSize || 'medium',
        })}
      </IconButton>
    </StyledTooltip>
  );
}

const SearchField = styled(TextField)({
  width: '60vh',
  borderRadius: 25,
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'gray',
    },
  },
});

export const AdminHome = () => {
  const { branches, branchesLoading, getBranches } = useGetBranches();
  const [currentBranch, setCurrentBranch] = useState(null);
  const { students, studentsLoading, hasMore, getStudents } = useGetStudents();
  const { teachers, teachersLoading, getTeachers } = useGetTeachers();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBranchChange = (_event: any, branch: any) => {
    setCurrentBranch(branch);
  };

  const loadMore = () => {
    getStudents(currentBranch);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  useEffect(() => {
    if (branches.length && !currentBranch) {
      setCurrentBranch(branches[0].name);
    }
    if (currentBranch) {
      getStudents(currentBranch, true);
    }
  }, [branches, currentBranch]);

  useEffect(() => {
    getBranches();
  }, []);

  return (
    <Fragment>
      <Box
        sx={{
          width: '80%',
          maxHeight: '90vh',
          marginX: 'auto',
          marginTop: 3,
        }}
      >
        {<StudentDialog isOpen={dialogOpen} handleClose={handleDialogClose} />}
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
              padding: 1,
              width: '200px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            variant="outlined"
            onClick={handleDialogOpen}
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
          loadMore={loadMore}
          hasMore={hasMore}
        />
      </Box>
    </Fragment>
  );
};
