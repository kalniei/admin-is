import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Grid,
  RadioGroup,
  Radio
} from '@mui/material';
import { useState } from 'react';
import getErrorMessage from '../../helpers/getErrorMessage';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import { useForm, Controller } from 'react-hook-form';

interface PageProps {
  handleClose: () => void;
  open: boolean;
  onConfirm: () => void;
  tableFrom: string | null;
}

const defaultValues: IWorkshopTableObject = {
  name: '',
  surname: '',
  mail: '',
  phone: '',
  level: '0',
  notes: '',
  paid: '',
  date: new Date()
};

const AddNewModal = ({ handleClose, open, onConfirm, tableFrom }: PageProps): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const snackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues
  });

  const addNewUser = async (formData: IWorkshopTableObject) => {
    if (!tableFrom) return;
    setIsProcessing(true);
    try {
      const { data } = await request('post', '/addNewUserToTable', {
        table_name: tableFrom,
        data_object: formData
      });
      snackbar.showMessage('Użytkownik został utworzony!', 'success');
      onConfirm();
      handleClose();
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Coś poszło nie tak podczas dodawania nowego użytkownika'),
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
          Dodaj nowego użytkownika
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form autoComplete="off">
          <Grid container spacing={2} justifyContent="space-between" alignItems="flex-end">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: { value: true, message: 'Wymagany' }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Imię"
                    placeholder="Wpisz Imię"
                    fullWidth
                    required
                    error={!!errors?.name}
                    helperText={errors?.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="surname"
                rules={{
                  required: { value: true, message: 'Wymagany' }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Nazwisko"
                    placeholder="Wpisz Nazwisko"
                    fullWidth
                    error={!!errors?.surname}
                    helperText={errors?.surname?.message}
                    name="surname"
                    required={true}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="mail"
                rules={{
                  required: {
                    value: true,
                    message: 'Email jest wymagany'
                  },
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Niepoprawny e-mail.'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Adres e-mail użytkownika"
                    placeholder="Wpisz e-mail"
                    fullWidth
                    error={!!errors?.mail}
                    helperText={errors?.mail?.message}
                    name="email"
                    required={true}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Telefon użytkownika"
                    placeholder="Wpisz telefon"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Wybierz poziom</Typography>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="0" control={<Radio color="primary" />} label="0" />
                    <FormControlLabel value="1" control={<Radio color="primary" />} label="1" />
                    <FormControlLabel value="2" control={<Radio color="primary" />} label="2" />
                    <FormControlLabel value="3" control={<Radio color="primary" />} label="3" />
                    <FormControlLabel value="4" control={<Radio color="primary" />} label="4" />
                  </RadioGroup>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Notatka"
                    placeholder="wpisz noptatke"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="paid"
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Czy zapłacił?"
                    placeholder="we can think of the format or just leave any"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined" disabled={isProcessing}>
          Anuluj
        </Button>
        <Button
          variant="outlined"
          onClick={handleSubmit(addNewUser)}
          disabled={isProcessing}
          color="success"
        >
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewModal;
