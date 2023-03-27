import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import {
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import {
  formFieldStyles,
  StyledAutoComplete,
  StyledDialog,
  StyledFormControl,
  StyledTextField,
} from './styled/student-dialog';
import { Fragment, useState } from 'react';
import { StudentStatus } from '../../types/student';

interface AdminDialogProps {
  isOpen: boolean;
  student: any;
  handleSubmit: (data: any) => void;
  teachers: any;
  teachersLoading: boolean;
  groups: any;
  groupsLoading: boolean;
  getTeacherGroups: (teacherId: number) => void;
  handleClose: () => void;
}

export function AdminStudentDialog({
  isOpen,
  student,
  handleSubmit,
  handleClose,
  teachers,
  teachersLoading,
  groups,
  groupsLoading,
  getTeacherGroups,
}: AdminDialogProps) {
  const [studentData, setStudentData] = useState(
    student || {
      name: null,
      lastname: null,
      status: StudentStatus.Pending,
      actualFee: null,
      formalFee: null,
      groupId: null,
      groupName: null,
      teacherId: null,
    }
  );
  const [teacherOptionsOpen, setTeacherOptionsOpen] = useState(false); // For circular progress
  const [groupOptionsOpen, setGroupOptionsOpen] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(!studentData.teacherId);
  const [groupFieldOpen, setGroupFieldOpen] = useState(
    Boolean(studentData.teacherId)
  );

  const handleStudentDataChange = (key: string, value: any) => {
    setStudentData((curStudent: any) => ({
      ...curStudent,
      [key]: value,
    }));
  };

  const handleTeacherOpen = () => {
    setTeacherOptionsOpen(true);
  };

  const handleTeacherClose = () => {
    setTeacherOptionsOpen(false);
  };

  const handleTeacherChange = (_event: any, option: any) => {
    if (option && option.id) {
      handleStudentDataChange('teacherId', option.id);
      getTeacherGroups(option.id);
    } else {
      handleStudentDataChange('teacherId', null);
      handleStudentDataChange('groupId', null);
      handleStudentDataChange('groupName', null);
      setGroupFieldOpen(false);
    }
  };

  const handleGroupChange = (_event: any, option: any) => {
    if (option && option.id) {
      handleStudentDataChange('groupId', option.id);
    } else {
      handleStudentDataChange('groupId', null);
    }
  };

  const handleNewGroupOpen = () => {
    handleStudentDataChange('groupId', null);
    setGroupFieldOpen(true);
    setIsNewGroup(true);
  };

  const handleExistingGroupOpen = () => {
    setGroupFieldOpen(true);
    setIsNewGroup(false);
    handleStudentDataChange('groupName', null);
  };

  const handleGroupOptionsOpen = () => {
    setGroupOptionsOpen(true);
  };

  const handleGroupOptionsClose = () => {
    setGroupOptionsOpen(false);
  };

  const onInputChange = ({ target: { name, value } }: any) => {
    handleStudentDataChange(name, value || null);
  };

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
          <StyledTextField
            name="name"
            label="Name"
            value={studentData.name}
            variant="outlined"
            required
            onChange={onInputChange}
          />
          <StyledTextField
            name="lastname"
            label="Lastname"
            value={studentData.lastname}
            variant="outlined"
            required
            onChange={onInputChange}
          />
          <StyledTextField
            name="formalFee"
            label="Formal Fee"
            value={studentData.formalFee}
            variant="outlined"
            required
            onChange={onInputChange}
          />
          <StyledTextField
            name="actualFee"
            label="Actual Fee"
            value={studentData.actualFee}
            variant="outlined"
            required
            onChange={onInputChange}
          />
          <StyledTextField
            name="email"
            label="Email"
            value={studentData.email}
            variant="outlined"
            onChange={onInputChange}
          />
          <StyledFormControl>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              label="Status"
              value={studentData.status}
              onChange={onInputChange}
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
            getOptionLabel={(option: any) =>
              `${option.name} ${option.lastname}`
            }
            value={
              teachers.find((t: any) => t.id === studentData.teacherId) || null
            }
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
          {studentData.teacherId && (
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
                name="groupName"
                label="New Group Name"
                variant="outlined"
                required
                onChange={onInputChange}
              />
            ) : (
              <StyledAutoComplete
                onOpen={handleGroupOptionsOpen}
                onClose={handleGroupOptionsClose}
                onChange={handleGroupChange}
                options={(!groupsLoading && groups) || []}
                loading={groupsLoading}
                getOptionLabel={(option: any) => option.name}
                value={
                  groups.find((g: any) => g.id === studentData.groupId) || null
                }
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
        <Button autoFocus onClick={() => handleSubmit(studentData)}>
          Save changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
