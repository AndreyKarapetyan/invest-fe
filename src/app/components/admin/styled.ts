import { Dialog, TextField, FormControl, Autocomplete, styled } from "@mui/material";

export const formFieldStyles = {
  marginLeft: '10%',
  marginRight: '20%',
  marginBottom: '7%',
  width: '70%',
};

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    width: '50%',
  },
}));
export const StyledTextField = styled(TextField)(() => formFieldStyles);
export const StyledFormControl = styled(FormControl)(() => formFieldStyles);
export const StyledAutoComplete = styled(Autocomplete)(() => formFieldStyles);