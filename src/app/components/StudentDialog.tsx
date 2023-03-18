import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { StudentStatus } from '../types/student';
import { Fragment, useState } from 'react';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '50%',
  },
}));

const formFieldStyles = {
  marginLeft: '10%',
  marginRight: '20%',
  marginBottom: '7%',
  width: '70%',
};

const StyledTextField = styled(TextField)(() => formFieldStyles);
const StyledFormControl = styled(FormControl)(() => formFieldStyles);
const StyledAutoComplete = styled(Autocomplete)(() => formFieldStyles);

interface DialogProps {
  isOpen: boolean;
  teachers: any;
  teachersLoading: boolean;
  groups: any;
  groupsLoading: boolean;
  getTeacherGroups: (teacherId: number) => void;
  handleClose: () => void;
}

export function StudentDialog(props: DialogProps) {
  const {
    isOpen,
    handleClose,
    teachers,
    teachersLoading,
    groups,
    groupsLoading,
    getTeacherGroups,
  } = props;
  const [teacherOptionsOpen, setTeacherOptionsOpen] = useState(false);
  const [groupSelectionOpen, setGroupSelectionOpen] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [groupFieldOpen, setGroupFieldOpen] = useState(false);
  const [groupOptionsOpen, setGroupOptionsOpen] = useState(false);

  const handleTeacherOpen = () => {
    setTeacherOptionsOpen(true);
  };

  const handleTeacherClose = () => {
    setTeacherOptionsOpen(false);
  };

  const handleTeacherChange = (_event: any, option: any) => {
    if (option && option.id) {
      if (!groupSelectionOpen) {
        setGroupSelectionOpen(true);
      }
      getTeacherGroups(option.id);
    } else {
      setGroupSelectionOpen(false);
      setGroupFieldOpen(false);
    }
  };

  const handleNewGroupOpen = () => {
    setGroupFieldOpen(true);
    setIsNewGroup(true);
  };

  const handleExistingGroupOpen = () => {
    setGroupFieldOpen(true);
    setIsNewGroup(false);
  };

  const handleGroupOptionsOpen = () => {
    setGroupOptionsOpen(true);
  }

  const handleGroupOptionsClose = () => {
    setGroupOptionsOpen(false);
  }

  return (
    <StyledDialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        New Student
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column" marginTop={1}>
          <StyledTextField label="Name" variant="outlined" required />
          <StyledTextField label="Lastname" variant="outlined" required />
          <StyledTextField label="Formal Fee" variant="outlined" required />
          <StyledTextField label="Actual Fee" variant="outlined" required />
          <StyledTextField label="Email" variant="outlined" />
          <StyledFormControl>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              defaultValue={StudentStatus.Pending}
            >
              <MenuItem value={StudentStatus.Pending}>Pending</MenuItem>
              <MenuItem value={StudentStatus.Registered}>Registered</MenuItem>
            </Select>
          </StyledFormControl>
          <StyledAutoComplete
            onOpen={handleTeacherOpen}
            onClose={handleTeacherClose}
            onChange={handleTeacherChange}
            options={(!teachersLoading && teachers) || []}
            loading={teachersLoading}
            getOptionLabel={(option: any) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teacher"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {teachersLoading && teacherOptionsOpen ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            )}
          />
          {groupSelectionOpen && (
            <Grid
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                ...formFieldStyles,
              }}
            >
              <Button variant="outlined" onClick={handleNewGroupOpen}>
                New Group
              </Button>
              <Button variant="outlined" onClick={handleExistingGroupOpen}>
                Select Existing
              </Button>
            </Grid>
          )}
          {groupFieldOpen &&
            (isNewGroup ? (
              <StyledTextField
                label="New Group Name"
                variant="outlined"
                required
              />
            ) : (
              <StyledAutoComplete
                onOpen={handleGroupOptionsOpen}
                onClose={handleGroupOptionsClose}
                onChange={() => {}}
                options={(!groupsLoading && groups) || []}
                loading={groupsLoading}
                getOptionLabel={(option: any) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Existing Group Name"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {groupsLoading && groupOptionsOpen ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      ),
                    }}
                  />
                )}
              />
            ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
