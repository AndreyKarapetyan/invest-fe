import { AdminMenuSliderList } from './AdminMenuSliderList';
import { LoadingIndicator } from '../LoadingIndicator';
import { MenuSlider } from '../MenuSlider';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useRef, useState, createContext, memo } from 'react';
import { useGetBranches } from 'src/app/hooks/useGetBranches';
import { AdminStudents } from 'src/app/screens/admin/AdminStudents';

export const BranchContext = createContext(null);

export function AdminRoute(props: any) {
  const [currentBranch, setCurrentBranch] = useState(null);
  const [isLoadingShowing, setIsLoadingShowing] = useState(false);
  const { branches, branchesLoading, getBranches } = useGetBranches();
  const loadingTimeOut = useRef<any>();

  const handleBranchChange = (_event: any, branch: any) => {
    setCurrentBranch(branch);
  };

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    if (branches.length && !currentBranch) {
      setCurrentBranch(branches[0].name);
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
    <MenuSlider menuList={<AdminMenuSliderList />}>
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
        {isLoadingShowing && <LoadingIndicator open={isLoadingShowing} />}
        <BranchContext.Provider value={currentBranch}>
          {props.children}
        </BranchContext.Provider>
      </Box>
    </MenuSlider>
  );
}
