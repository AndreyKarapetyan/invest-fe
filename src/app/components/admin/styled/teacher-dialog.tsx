import {
  Autocomplete,
  Dialog,
  DialogProps,
  FormControl,
  styled,
  TextField,
} from '@mui/material';

export const formFieldStyles = {
  marginLeft: '0.75%',
  marginRight: '0.75%',
  marginTop: '1%',
  marginBottom: '7%',
  width: '20%',
  minWidth: '250px',
};

export const StyledTextField = styled(TextField)(() => formFieldStyles);
export const StyledFormControl = styled(FormControl)(() => formFieldStyles);
export const StyledAutoComplete = styled(Autocomplete)(() => formFieldStyles);
