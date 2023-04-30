import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import {
  formFieldStyles,
  StyledAutoComplete,
  StyledDialog,
  StyledFormControl,
  StyledTextField,
} from './styled/student-dialog';
import { Fragment, useState } from 'react';
import { StudentStatus } from '../../types/student';
import { isEmail, isInt, isPositive } from 'class-validator';

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
      email: null,
      groupId: null,
      groupName: null,
      teacherId: null,
    },
  );
  const [formErrors, setFormErrors] = useState({
    name: false,
    lastname: false,
    status: false,
    actualFee: false,
    formalFee: false,
    email: false,
    groupId: false,
    groupName: false,
    teacherId: false,
  });
  const validationFuncMapping = {
    name: (name: any) => name,
    lastname: (lastname: any) => lastname,
    actualFee: (actualFee: any) => actualFee && isPositive(Number(actualFee)) && isInt(Number(actualFee)),
    formalFee: (formalFee: any) => formalFee && isPositive(Number(formalFee)) && isInt(Number(formalFee)),
    email: (email: any) => !email || isEmail(email),
    status: (status: any) => Object.values(StudentStatus).includes(status),
    teacherId: (teacherId: any, groupId?: any, groupName?: any) =>
      !teacherId || (teacherId && groupId) || (teacherId && groupName),
    groupName: (groupName: any) =>
      !studentData.teacherId || (studentData.groupId && !groupName) || (!studentData.groupId && groupName),
    groupId: (groupId: any) =>
      !studentData.teacherId || (studentData.groupName && !groupId) || (!studentData.groupName && groupId),
  };
  const [teacherOptionsOpen, setTeacherOptionsOpen] = useState(false); // For circular progress
  const [groupOptionsOpen, setGroupOptionsOpen] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(!studentData.teacherId);
  const [groupFieldOpen, setGroupFieldOpen] = useState(Boolean(studentData.teacherId));

  const handleStudentDataChange = (key: string, value: any) => {
    setStudentData((curStudent: any) => ({
      ...curStudent,
      [key]: value,
    }));
    setFormErrors((curErrors) => ({
      ...curErrors,
      [key]: !validationFuncMapping[key as keyof typeof validationFuncMapping](value),
    }));
    if (key === 'groupId') {
      setFormErrors((curErrors) => ({
        ...curErrors,
        teacherId: !validationFuncMapping.teacherId(studentData.teacherId, value),
      }));
    }
    if (key === 'groupName') {
      setFormErrors((curErrors) => ({
        ...curErrors,
        teacherId: !validationFuncMapping.teacherId(studentData.teacherId, null, value),
      }));
    }
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
      handleStudentDataChange('groupId', null);
      handleStudentDataChange('groupName', null);
      handleStudentDataChange('teacherId', null); // Order is important
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

  const onSaveChanges = () => {
    const { name, lastname, actualFee, formalFee, email, teacherId, status, groupId, groupName } = studentData;
    const errors: typeof formErrors = {
      name: !validationFuncMapping.name(name),
      lastname: !validationFuncMapping.lastname(lastname),
      actualFee: !validationFuncMapping.actualFee(actualFee),
      formalFee: !validationFuncMapping.formalFee(formalFee),
      email: !validationFuncMapping.email(email),
      status: !validationFuncMapping.status(status),
      teacherId: !validationFuncMapping.teacherId(teacherId, groupId, groupName),
      groupId: !validationFuncMapping.groupId(groupId),
      groupName: !validationFuncMapping.groupName(groupName),
    };
    setFormErrors(errors as any);
    const areErrors = Object.values(errors).some((err) => err);
    console.log(errors, Object.values(errors), areErrors);
    if (!areErrors) {
      handleSubmit(studentData);
    }
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
            error={formErrors.name}
            helperText={formErrors.name ? 'Name must not be empty' : ''}
            onChange={onInputChange}
          />
          <StyledTextField
            name="lastname"
            label="Lastname"
            value={studentData.lastname}
            variant="outlined"
            required
            error={formErrors.lastname}
            helperText={formErrors.lastname ? 'Lastname must not be empty' : ''}
            onChange={onInputChange}
          />
          <StyledTextField
            name="formalFee"
            label="Formal Fee"
            value={studentData.formalFee}
            variant="outlined"
            required
            error={formErrors.formalFee}
            helperText={formErrors.formalFee ? 'Formal fee must be a positive integer number' : ''}
            onChange={onInputChange}
          />
          <StyledTextField
            name="actualFee"
            label="Actual Fee"
            value={studentData.actualFee}
            variant="outlined"
            required
            error={formErrors.actualFee}
            helperText={formErrors.actualFee ? 'Actual fee must be a positive integer number' : ''}
            onChange={onInputChange}
          />
          <StyledTextField
            name="email"
            label="Email"
            value={studentData.email}
            variant="outlined"
            error={formErrors.email}
            helperText={formErrors.email ? 'Invalid email format' : ''}
            onChange={onInputChange}
          />
          <StyledFormControl required>
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
            getOptionLabel={(option: any) => `${option.name} ${option.lastname}`}
            value={teachers.find((t: any) => t.id === studentData.teacherId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teacher"
                error={formErrors.teacherId}
                helperText={formErrors.teacherId ? 'Please either create a new group or select existing' : ''}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {teachersLoading && teacherOptionsOpen ? <CircularProgress color="inherit" size={20} /> : null}
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
                error={formErrors.groupName}
                helperText={formErrors.groupName ? 'Group must not be empty' : ''}
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
                value={groups.find((g: any) => g.id === studentData.groupId) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Existing Group Name"
                    error={formErrors.groupId}
                    helperText={formErrors.groupId ? 'Group must not be empty' : ''}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {groupsLoading && groupOptionsOpen ? <CircularProgress color="inherit" size={20} /> : null}
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
        <Button autoFocus onClick={onSaveChanges}>
          Save Changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
