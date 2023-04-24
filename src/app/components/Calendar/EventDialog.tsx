import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import {
  StyledAutoComplete,
  StyledCheckBoxFormControl,
  StyledDialog,
  StyledFormControl,
} from './styled';
import DeleteIcon from '@mui/icons-material/Delete';
import { TimePicker } from './TimePicker';

const optionOnce = { value: 'once', name: "Don't repeat" };
const weekDays = [
  { value: '1', name: 'Sunday' },
  { value: '2', name: 'Monday' },
  { value: '3', name: 'Tuesday' },
  { value: '4', name: 'Wednesday' },
  { value: '5', name: 'Thursday' },
  { value: '6', name: 'Friday' },
  { value: '7', name: 'Saturday' },
];

export function EventDialog({
  isOpen,
  handleClose,
  event,
  getTeacherGroups,
  teachers,
  teachersLoading,
  groups,
  groupsLoading,
  shouldUpdateSubmissionData,
  updateSubmissionData,
  handleSubmitStart,
  checkSubmissionStatus,
  handleDeleteOpen,
  times,
  startTime,
  endTime,
  handleStartChange,
  handleEndChange,
}: any) {
  const [eventData, setEventData] = useState(
    event || {
      groupId: null,
      teacherId: null,
      pattern: null,
    }
  );
  const [teacherOptionsOpen, setTeacherOptionsOpen] = useState(false); // For circular progress
  const [groupOptionsOpen, setGroupOptionsOpen] = useState(false);
  const [groupFieldOpen, setGroupFieldOpen] = useState(
    Boolean(eventData.teacherId)
  );

  const handleEventDataChange = (key: string, value: any) => {
    setEventData((curEventData: any) => ({
      ...curEventData,
      [key]: value,
    }));
  };
  const handleTeacherOpen = () => {
    setTeacherOptionsOpen(true);
  };

  const handleTeacherClose = () => {
    setTeacherOptionsOpen(false);
  };

  const handleGroupOptionsOpen = () => {
    setGroupOptionsOpen(true);
  };

  const handleGroupOptionsClose = () => {
    setGroupOptionsOpen(false);
  };

  const handleTeacherChange = (_event: any, option: any) => {
    if (option && option.id) {
      handleEventDataChange('teacherId', option.id);
      getTeacherGroups(option.id);
      setGroupFieldOpen(true);
    } else {
      handleEventDataChange('teacherId', null);
      handleEventDataChange('groupId', null);
      setGroupFieldOpen(false);
    }
  };

  const handleGroupChange = (_event: any, option: any) => {
    if (option && option.id) {
      handleEventDataChange('groupId', option.id);
    } else {
      handleEventDataChange('groupId', null);
    }
  };

  const handlePatternChange = (event: any) => {
    const {
      target: { value: eventValue, checked },
    } = event;
    let value;
    if (typeof checked === 'boolean') {
      value = checked ? [optionOnce.value] : [];
    } else if (eventValue) {
      value = eventValue;
    }
    handleEventDataChange('pattern', value.join(','));
  };

  useEffect(() => {
    if (shouldUpdateSubmissionData.ids) {
      updateSubmissionData(eventData);
      checkSubmissionStatus('ids', false);
    }
  }, [shouldUpdateSubmissionData]);

  const isOncePattern = Boolean(
    eventData.pattern && eventData.pattern.includes(optionOnce.value)
  );

  return (
    <StyledDialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        New Lesson
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
          <TimePicker
            times={times}
            startTime={startTime}
            endTime={endTime}
            handleStartChange={handleStartChange}
            handleEndChange={handleEndChange}
          />
          <StyledAutoComplete
            onOpen={handleTeacherOpen}
            onClose={handleTeacherClose}
            onChange={handleTeacherChange}
            options={(!teachersLoading && teachers) || []}
            loading={teachersLoading}
            getOptionLabel={(option: any) =>
              `${option.name} ${option.lastname}`
            }
            value={
              teachers.find((t: any) => t.id === eventData.teacherId) || null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Teacher"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {teachersLoading && teacherOptionsOpen ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
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
            options={(!groupsLoading && groupFieldOpen && groups) || []}
            loading={groupsLoading}
            getOptionLabel={(option: any) => option.name}
            value={groups.find((g: any) => g.id === eventData.groupId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Group"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {groupsLoading && groupOptionsOpen ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            )}
          />
          <StyledCheckBoxFormControl
            control={
              <Checkbox
                checked={isOncePattern}
                onChange={handlePatternChange}
              />
            }
            label={optionOnce.name}
          />
          <StyledFormControl>
            <InputLabel id="multiple-select-weekday">Repeat</InputLabel>
            <Select
              label="Repeat"
              labelId="multiple-select-weekday"
              id="select-multiple"
              multiple
              disabled={isOncePattern}
              value={
                (!isOncePattern &&
                  eventData.pattern &&
                  eventData.pattern.split(',')) ||
                []
              }
              onChange={handlePatternChange}
              input={<OutlinedInput id="select-multiple" label="Repeat" />}
              renderValue={(selected: string[]) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value: any) => (
                    <Chip
                      key={value}
                      label={
                        weekDays.find((weekDay) => weekDay.value === value)
                          ?.name
                      }
                    />
                  ))}
                </Box>
              )}
            >
              {weekDays.map(({ name, value }) => (
                <MenuItem key={name} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {event.id ? (
          <Button
            onClick={() => handleDeleteOpen(event)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        ) : (
          <Box />
        )}
        <Button autoFocus onClick={handleSubmitStart}>
          Save Changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
