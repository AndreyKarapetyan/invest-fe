import { TextField, Snackbar, styled } from '@mui/material';

export const SearchField = styled(TextField)({
  width: '60vh',
  borderRadius: 25,
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'gray',
    },
  },
});
