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
import { isEmail, isInt, isPositive } from 'class-validator';
import { PaymentStatus } from 'src/app/types/payment';

interface AdminDialogProps {
  isOpen: boolean;
  handleSubmit: (data: any) => void;
  teachers: any;
  teachersLoading: boolean;
  groups: any;
  groupsLoading: boolean;
  getTeacherGroups: (teacherId: number) => void;
  handleClose: () => void;
  students: any;
  studentsLoading: boolean;
  getAllStudentsMinData: (data: any) => void;
  branchName: string;
}

export function AdminPaymentsDialog({
  isOpen,
  handleSubmit,
  handleClose,
  teachers,
  teachersLoading,
  groups,
  groupsLoading,
  getTeacherGroups,
  students,
  studentsLoading,
  getAllStudentsMinData,
  branchName,
}: AdminDialogProps) {
  const [paymentData, setStudentData] = useState({
    amount: null,
    status: PaymentStatus.Paid,
    groupId: null,
    teacherId: null,
    studentId: null,
  });
  const [formErrors, setFormErrors] = useState({
    amount: false,
    status: false,
    studentId: false,
  });
  const validationFuncMapping = {
    amount: (actualFee: any) => actualFee && isPositive(Number(actualFee)) && isInt(Number(actualFee)),
    status: (status: any) => Object.values(PaymentStatus).includes(status),
    studentId: (studentId: any) => studentId,
  };
  const [teacherOptionsOpen, setTeacherOptionsOpen] = useState(false); // For circular progress
  const [groupOptionsOpen, setGroupOptionsOpen] = useState(false);
  const [studentOptionsOpen, setStudentOptionsOpen] = useState(false);

  const handlePaymentDataChange = (key: string, value: any) => {
    setStudentData((curPayment: any) => ({
      ...curPayment,
      [key]: value,
    }));
    setFormErrors((curErrors) => ({
      ...curErrors,
      [key]:
        validationFuncMapping[key as keyof typeof validationFuncMapping] &&
        !validationFuncMapping[key as keyof typeof validationFuncMapping](value),
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
      handlePaymentDataChange('teacherId', option.id);
      handlePaymentDataChange('studentId', null);
      getTeacherGroups(option.id);
      getAllStudentsMinData({ teacherId: option.id, branchName });
    } else {
      handlePaymentDataChange('studentId', null);
      handlePaymentDataChange('groupId', null);
      handlePaymentDataChange('teacherId', null); // Order is important
    }
  };

  const handleGroupOptionsOpen = () => {
    setGroupOptionsOpen(true);
  };

  const handleGroupOptionsClose = () => {
    setGroupOptionsOpen(false);
  };

  const handleGroupChange = (_event: any, option: any) => {
    if (option && option.id) {
      handlePaymentDataChange('groupId', option.id);
      getAllStudentsMinData({ teacherId: paymentData.teacherId, groupId: option.id, branchName });
    } else {
      handlePaymentDataChange('studentId', null);
      handlePaymentDataChange('groupId', null);
    }
  };

  const handleStudentOptionsOpen = () => {
    setStudentOptionsOpen(true);
  };

  const handleStudentOptionsClose = () => {
    setStudentOptionsOpen(false);
  };

  const handleStudentChange = (_event: any, option: any) => {
    if (option && option.id) {
      handlePaymentDataChange('studentId', option.id);
    } else {
      handlePaymentDataChange('studentId', null);
    }
  };

  const onInputChange = ({ target: { name, value } }: any) => {
    handlePaymentDataChange(name, value || null);
  };

  const onSaveChanges = () => {
    const { status, studentId, amount } = paymentData;
    const errors: typeof formErrors = {
      amount: !validationFuncMapping.amount(amount),
      status: !validationFuncMapping.status(status),
      studentId: !validationFuncMapping.studentId(studentId),
    };
    setFormErrors(errors as any);
    const areErrors = Object.values(errors).some((err) => err);
    if (!areErrors) {
      handleSubmit(paymentData);
    }
  };

  return (
    <StyledDialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        New Payment
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
          <StyledAutoComplete
            onOpen={handleTeacherOpen}
            onClose={handleTeacherClose}
            onChange={handleTeacherChange}
            options={(!teachersLoading && teachers) || []}
            loading={teachersLoading}
            getOptionLabel={(option: any) => `${option.name} ${option.lastname}`}
            value={teachers.find((t: any) => t.id === paymentData.teacherId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teacher"
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
          <StyledAutoComplete
            onOpen={handleGroupOptionsOpen}
            onClose={handleGroupOptionsClose}
            onChange={handleGroupChange}
            options={(!groupsLoading && groups) || []}
            loading={groupsLoading}
            getOptionLabel={(option: any) => option.name}
            value={groups.find((g: any) => g.id === paymentData.groupId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Group Name"
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
          <StyledAutoComplete
            onOpen={handleStudentOptionsOpen}
            onClose={handleStudentOptionsClose}
            onChange={handleStudentChange}
            options={(!studentsLoading && students) || []}
            loading={studentsLoading}
            getOptionLabel={(option: any) => `${option.name} ${option.lastname}`}
            value={students.find((t: any) => t.id === paymentData.studentId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Student"
                required
                error={formErrors.studentId}
                helperText={formErrors.studentId ? 'Student must not be empty' : ''}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {studentsLoading && studentOptionsOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            )}
          />
          <StyledTextField
            name="amount"
            label="Payment Amount"
            value={paymentData.amount}
            variant="outlined"
            required
            error={formErrors.amount}
            helperText={formErrors.amount ? 'Amount must be a positive integer number' : ''}
            onChange={onInputChange}
          />
          <StyledFormControl required>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              variant="outlined"
              labelId="status-label"
              name="status"
              label="Status"
              value={paymentData.status}
              onChange={onInputChange}
            >
              <MenuItem value={PaymentStatus.Paid}>{PaymentStatus.Paid}</MenuItem>
              <MenuItem value={PaymentStatus.Waiting}>{PaymentStatus.Waiting}</MenuItem>
              <MenuItem value={PaymentStatus.Unpaid}>{PaymentStatus.Unpaid}</MenuItem>
            </Select>
          </StyledFormControl>
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
