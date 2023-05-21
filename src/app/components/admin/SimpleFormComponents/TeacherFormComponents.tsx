import { Fragment, memo, useState } from 'react';
import { StyledFormControl, StyledTextField } from '../styled/teacher-dialog';
import { VisibilityOff, Visibility, Error } from '@mui/icons-material';
import { InputLabel, Select, MenuItem, OutlinedInput, InputAdornment, IconButton, FormHelperText } from '@mui/material';
import { TeacherLevel } from 'src/app/types/teacher';

export const TeacherFormComponents = memo(function TeacherFormComponents({
  teacherData,
  onInputChange,
  formErrors,
}: any) {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((cur) => !cur);
  };

  return (
    <Fragment>
      <StyledTextField
        name="name"
        label="Name"
        autoComplete="off"
        value={teacherData.name}
        variant="outlined"
        required
        error={formErrors.name}
        helperText={formErrors.name ? 'Name must not be empty' : ''}
        onChange={onInputChange}
      />
      <StyledTextField
        name="lastname"
        label="Lastname"
        autoComplete="off"
        value={teacherData.lastname}
        variant="outlined"
        required
        error={formErrors.lastname}
        helperText={formErrors.lastname ? 'Lastname must not be empty' : ''}
        onChange={onInputChange}
      />
      <StyledTextField
        name="email"
        label="Email"
        autoComplete="off"
        value={teacherData.email}
        variant="outlined"
        required
        error={formErrors.email}
        helperText={formErrors.email ? 'Invalid email' : ''}
        onChange={onInputChange}
      />
      <StyledTextField
        name="phoneNumber"
        label="Phone Number"
        autoComplete="off"
        value={teacherData.phoneNumber}
        variant="outlined"
        required
        error={formErrors.phoneNumber}
        helperText={formErrors.phoneNumber ? 'Phone number must not be empty' : ''}
        onChange={onInputChange}
      />
      <StyledFormControl>
        <InputLabel id="level-label" required>
          Level
        </InputLabel>
        <Select
          labelId="level-label"
          name="level"
          label="Level"
          value={teacherData.level}
          required
          error={formErrors.level}
          onChange={onInputChange}
        >
          <MenuItem value={TeacherLevel.B1}>B1</MenuItem>
          <MenuItem value={TeacherLevel.B1Plus}>B1 Plus</MenuItem>
          <MenuItem value={TeacherLevel.B2}>B2</MenuItem>
          <MenuItem value={TeacherLevel.B2Plus}>B2 Plus</MenuItem>
          <MenuItem value={TeacherLevel.C1}>C1</MenuItem>
        </Select>
        {formErrors.level && <FormHelperText error>Level must not be empty</FormHelperText>}
      </StyledFormControl>
      <StyledTextField
        name="salaryPercent"
        label="Salary Percents"
        autoComplete="off"
        value={teacherData.salaryPercent}
        variant="outlined"
        required
        error={formErrors.salaryPercent}
        helperText={formErrors.salaryPercent ? 'Salary percent must be a positive number' : ''}
        onChange={onInputChange}
      />
      <StyledFormControl variant="outlined">
        <InputLabel error={formErrors.password} htmlFor="outlined-adornment-password">
          New Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          label="New Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={teacherData.password}
          error={formErrors.password}
          onChange={onInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleShowPassword} edge="end">
                {showPassword ? (
                  <VisibilityOff color={formErrors.password ? 'error' : 'primary'} />
                ) : (
                  <Visibility color={formErrors.password ? 'error' : 'primary'} />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        {formErrors.password && (
          <FormHelperText error>
            Password must be at least 8 characters long, must contain numbers, uppercase and lowercase letters and
            symbols
          </FormHelperText>
        )}
      </StyledFormControl>
    </Fragment>
  );
});
