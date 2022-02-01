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
import getErrorMessage from '../../helpers/getErrorMessage';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';

interface PageProps {
  handleClose: () => void;
  open: boolean;
  onConfirm: () => void;
  workshpsArr: string[];
  selected: IWorkshopTableObject[];
  tableFrom: string | null;
}
const TransferModal = ({
  handleClose,
  open,
  onConfirm,
  workshpsArr,
  selected,
  tableFrom
}: PageProps): JSX.Element => {
  const [chosenWorkshop, setChosenWorkshop] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const snackbar = useSnackbar();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const transferChosenRows = async (tableTo: string | null, checked: boolean) => {
    if (!tableFrom || !tableTo || selected.length === 0) return;
    setIsProcessing(true);
    try {
      const { data } = await request(
        'post',
        `${
          checked ? '/transferAndDeleteToGlobalWorkshopsTable' : '/transferToGlobalWorkshopsTable'
        }`,
        {
          table_name_from: tableFrom,
          table_name_to: tableTo,
          row_object: selected
        }
      );
      snackbar.showMessage('Przeniesione wiersze: ' + data?.affectedRows, 'success');
      onConfirm();
      handleClose();
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Coś poszło nie tak podczas przenoszenia wierszy'),
        'error'
      );
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog maxWidth={'sm'} fullWidth={true} open={open}>
      <DialogTitle>
        <Typography variant="h4" component="p">
          Potwierdzenie
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
              label="Wybierz tabelę, do której chcesz przenieść rekordy"
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
            label="Przenieś I Usuń"
          />
        </FormGroup>

        <Typography mt={4} color={Colors.darkOrange}>
          Czy na pewno chcesz przenieść {checked ? 'I USUNĄĆ' : ''} te wiersze? <br /> Tą akcję nie
          można cofnąć.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined" disabled={isProcessing}>
          Anuluj
        </Button>
        <Button
          variant="outlined"
          onClick={() => transferChosenRows(chosenWorkshop, checked)}
          disabled={!chosenWorkshop || isProcessing}
          color="success"
        >
          {checked ? 'Przenieś I Usuń' : 'Przenieś'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferModal;
