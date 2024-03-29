import {
  Autocomplete,
  Dialog,
  FormControl,
  FormControlLabel,
  Grid,
  styled,
  TextField,
} from '@mui/material';

export const formFieldStyles = {
  marginLeft: '10%',
  marginRight: '20%',
  marginBottom: '7%',
  width: '70%',
  minWidth: '250px',
  '& .MuiOutlinedInput-root': {
    minHeight: '60px',
  },
};

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    width: '50%',
  },
}));
export const StyledTextField = styled(TextField)(() => formFieldStyles);
export const StyledFormControl = styled(FormControl)(() => formFieldStyles);
export const StyledAutoComplete = styled(Autocomplete)(() => formFieldStyles);
export const StyledCheckBoxFormControl = styled(FormControlLabel)(() => ({
  marginLeft: '8%',
  marginRight: '20%',
  marginBottom: '1%',
  width: '70%',
  minWidth: '250px',
  '& .MuiOutlinedInput-root': {
    minHeight: '60px',
  },
}));
export const StyledFormGrid = styled(Grid)(() => formFieldStyles)
