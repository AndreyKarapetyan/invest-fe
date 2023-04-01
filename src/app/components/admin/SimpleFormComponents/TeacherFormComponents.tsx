import { Fragment, useState } from 'react';
import { StyledFormControl, StyledTextField } from '../styled/teacher-dialog';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { TeacherLevel } from 'src/app/types/teacher';

export function TeacherFormComponents({ teacherData, onInputChange }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((cur) => !cur);
  };
  return (
    <Fragment>
      <StyledTextField
        name="name"
        label="Name"
        value={teacherData.name}
        variant="outlined"
        required
        onChange={onInputChange}
      />
      <StyledTextField
        name="lastname"
        label="Lastname"
        value={teacherData.lastname}
        variant="outlined"
        required
        onChange={onInputChange}
      />
      <StyledTextField
        name="email"
        label="Email"
        value={teacherData.email}
        variant="outlined"
        onChange={onInputChange}
      />
      <StyledTextField
        name="phoneNumber"
        label="Phone Number"
        value={teacherData.phoneNumber}
        variant="outlined"
        onChange={onInputChange}
      />
      <StyledFormControl>
        <InputLabel id="level-label">Level</InputLabel>
        <Select
          labelId="level-label"
          name="level"
          label="Level"
          value={teacherData.level}
          onChange={onInputChange}
        >
          <MenuItem value={TeacherLevel.B1}>B1</MenuItem>
          <MenuItem value={TeacherLevel.B1Plus}>B1 Plus</MenuItem>
          <MenuItem value={TeacherLevel.B2}>B2</MenuItem>
          <MenuItem value={TeacherLevel.B2Plus}>B2 Plus</MenuItem>
          <MenuItem value={TeacherLevel.C1}>C1</MenuItem>
        </Select>
      </StyledFormControl>
      <StyledTextField
        name="salaryPercent"
        label="Salary Percents"
        value={teacherData.salaryPercent}
        variant="outlined"
        onChange={onInputChange}
      />
      <StyledFormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={teacherData.password}
          onChange={onInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </StyledFormControl>
    </Fragment>
  );
}
