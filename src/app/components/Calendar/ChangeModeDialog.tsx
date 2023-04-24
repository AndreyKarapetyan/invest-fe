import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ChangeMode } from 'src/app/types/changeMode';

export function ChangeModeDialog({
  open,
  message,
  onCancel,
  onConfirm,
  value,
  handleChange,
}: any) {
  return (
    <Dialog open={open}>
      <DialogTitle>{message}</DialogTitle>
      <DialogContent>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={({ target: { value: newValue } }) => handleChange(newValue)}
        >
          <FormControlLabel
            value={ChangeMode.ONCE}
            control={<Radio />}
            label="Only this lesson"
          />
          <FormControlLabel
            value={ChangeMode.UPCOMING}
            control={<Radio />}
            label="This and following lessons"
          />
          <FormControlLabel
            value={ChangeMode.ALL}
            control={<Radio />}
            label="All lessons"
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
