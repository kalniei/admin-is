import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Autocomplete,
  TextField,
  FormControlLabel,
  FormGroup,
  Checkbox
} from '@mui/material';
import { useState } from 'react';
import Colors from '../../helpers/Colors';

interface PageProps {
  handleClose: () => void;
  open: boolean;
  onConfirm: (val: string | null, checked: boolean) => void;
  isProcessing: boolean;
  workshpsArr: string[];
}
const TransferModal = ({
  handleClose,
  open,
  onConfirm,
  isProcessing,
  workshpsArr
}: PageProps): JSX.Element => {
  const [chosenWorkshop, setChosenWorkshop] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Dialog maxWidth={'sm'} fullWidth={true} open={open}>
      <DialogTitle>
        <Typography variant="h4" component="p">
          Confirmation
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Autocomplete
          value={chosenWorkshop}
          onChange={(e, val) => setChosenWorkshop(val)}
          options={workshpsArr}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Choose table to witch you wan to transfer records?"
            />
          )}
        />
        <FormGroup sx={{ mt: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Transfer AND Delete"
          />
        </FormGroup>

        <Typography mt={4} color={Colors.darkOrange}>
          Are you sure you want to transfer {checked ? 'AND DELETE' : ''} those records? <br /> This
          action can not be reverted.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined" disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={() => onConfirm(chosenWorkshop, checked)}
          disabled={!chosenWorkshop || isProcessing}
          color="success"
        >
          {checked ? 'Transfer AND Delete' : 'Transfer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferModal;
