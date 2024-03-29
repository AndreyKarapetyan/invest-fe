import { Box, Tab, Tabs } from '@mui/material';
import { Fragment, createContext, useEffect, useRef, useState } from 'react';
import { LoadingIndicator } from '../LoadingIndicator';
import { useGetBranches } from 'src/app/hooks/useGetBranches';

export const BranchContext = createContext(null);

export function WithBranches(props: any) {
  const [currentBranch, setCurrentBranch] = useState<any>(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const { branches, branchesLoading, getBranches } = useGetBranches();
  const loadingTimeOut = useRef<any>();

  const handleBranchChange = (_event: any, branchName: any) => {
    const branch = branches.find((branch) => branch.name === branchName);
    setCurrentBranch(branch);
  };

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    if (branches.length && !currentBranch) {
      setCurrentBranch(branches[0]);
    }
  }, [branches, currentBranch]);

  useEffect(() => {
    if (branchesLoading) {
      loadingTimeOut.current = setTimeout(() => setIsLoadingShowing(true), 100);
    } else {
      clearTimeout(loadingTimeOut.current);
      setIsLoadingShowing(false);
    }
  }, [branchesLoading]);

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
        {currentBranch && (
          <Tabs
            sx={{ display: 'flex', justifyContent: 'center' }}
            value={currentBranch.name}
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
      </Box>
      {currentBranch && <BranchContext.Provider value={currentBranch}>{props.children}</BranchContext.Provider>}
      {isLoadingShowing && <LoadingIndicator open={isLoadingShowing} />}
    </Fragment>
  );
}
