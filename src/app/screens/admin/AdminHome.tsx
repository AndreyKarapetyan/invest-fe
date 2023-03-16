import { Box, Button, Fade, LinearProgress } from '@mui/material';
import { InfiniteLoadingTable } from 'src/app/components/InfiniteLoadingTable';
import { useEffect, useState } from 'react';
import { useGetBranches, useGetStudents } from './hooks';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const columns = [{ name: 'id' }, { name: 'name' }, { name: 'lastname' }];

export const AdminHome = () => {
  const { branches, branchesLoading, getBranches } = useGetBranches();
  const [currentBranch, setCurrentBranch] = useState(null);
  const { students, studentsLoading, hasMore, getStudents } =
    useGetStudents();

  const handleBranchChange = (event: any, branch: any) => {
    setCurrentBranch(branch);
  };

  const loadMore = () => {
    getStudents(currentBranch);
  };

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
    <Box sx={{ maxWidth: '600px', maxHeight: '90vh', margin: 'auto' }}>
      <br></br>
      {currentBranch && (
        <Tabs
          value={currentBranch}
          onChange={handleBranchChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          {branches.map(({ name }) => (
            <Tab key={name} value={name} label={name} />
          ))}
        </Tabs>
      )}
      <br></br>
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
  );
};
