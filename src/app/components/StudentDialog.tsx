import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { StudentStatus } from '../types/student';

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

interface DialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

export function StudentDialog(props: any) {
  const { isOpen, handleClose } = props;

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
            <Select labelId="status-label" label="Status" defaultValue={StudentStatus.Pending}>
              <MenuItem value={StudentStatus.Pending}>Pending</MenuItem>
              <MenuItem value={StudentStatus.Registered}>Registered</MenuItem>
            </Select>
          </StyledFormControl>
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
