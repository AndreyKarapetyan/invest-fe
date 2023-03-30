import { Search } from '@mui/icons-material';
import {
  TextField,
  styled,
  TextFieldProps,
  InputAdornment,
} from '@mui/material';

export const SearchField = styled((props: TextFieldProps) => (
  <TextField
    {...props}
    placeholder="Search..."
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      ),
    }}
  />
))({
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
