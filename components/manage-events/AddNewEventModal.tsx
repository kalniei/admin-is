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
import { IEventObj } from '../../ts/interfaces';
import { useForm, Controller } from 'react-hook-form';
import EventsObj from '../../helpers/Events';
import { TEventTypes } from '../../ts/types';

interface PageProps {
  handleClose: () => void;
  open: boolean;
  onConfirm: () => void;
}

const defaultValues: IEventObj = {
  title: '',
  customClass: 'ppi',
  date: '',
  time: '',
  description: '',
  place: '',
  price: '',
  link: '',
  linkTitle: '',
  aditionalLink: ''
};

const AddNewEventModal = ({ handleClose, open, onConfirm }: PageProps): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const snackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues
  });

  const addNewUser = async (formData: IEventObj) => {
    setIsProcessing(true);
    try {
      const { data } = await request('post', '/addNewEvent', {
        data_object: formData
      });
      snackbar.showMessage('Wydarzenie zostało utworzone!', 'success');
      onConfirm();
      handleClose();
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Coś poszło nie tak podczas dodawania nowego wydarzenia'),
        'error'
      );
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog maxWidth={'lg'} fullWidth={true} open={open}>
      <DialogTitle>
        <Typography variant="h4" component="p">
          Dodaj nowe wydarzenie
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form autoComplete="off">
          <Grid container spacing={2} justifyContent="space-between" alignItems="flex-end">
            <Grid item xs={12}>
              <Controller
                control={control}
                name="title"
                rules={{
                  required: { value: true, message: 'Wymagany' }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    placeholder="tytuł"
                    label="Wpisz tytuł wydarzenia. Na początku możesz dodać [występ] lub [warsztat]"
                    fullWidth
                    required
                    error={!!errors?.title}
                    helperText={errors?.title?.message}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="date"
                rules={{
                  required: { value: true, message: 'Wymagany' }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    placeholder="data"
                    label="Wpisz date DOKŁADNIE w takim formacie: yyyy/m/d (np. 2108/9/13 albo 2020/12/1)"
                    fullWidth
                    error={!!errors?.date}
                    helperText={errors?.date?.message}
                    name="date"
                    required={true}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="time"
                rules={{
                  required: { value: true, message: 'Wymagany' }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    placeholder="czas"
                    label="Wpisz czas wydarzenia w takim formacie: hh:mm"
                    fullWidth
                    error={!!errors?.time}
                    helperText={errors?.time?.message}
                    name="time"
                    required={true}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="place"
                rules={{
                  required: { value: true, message: 'Wymagany' }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    placeholder="miejsce"
                    label="Wpisz mejsce wydarzenia"
                    fullWidth
                    error={!!errors?.place}
                    helperText={errors?.place?.message}
                    name="place"
                    required={true}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="price"
                rules={{
                  required: { value: true, message: 'Wymagany' }
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Wpisz cenę wydarzenia dokładnie tak, jak chcesz żeby była wyświetlana"
                    placeholder="Cena"
                    fullWidth
                    error={!!errors?.price}
                    helperText={errors?.price?.message}
                    name="price"
                    required={true}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="link"
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Masz linka do sprzedaży biletów, formulaza zapisów lub czegos innego? Wklej go tu. Najlepiej wygeneruj skrócony link. LINK MUSI BYĆ Z http:// lub https:// Pamjętaj o następnym polu!"
                    placeholder="link do sprzedazy"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="linkTitle"
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Napisz jak twój link u góry będzie nazywać sie. To musi być krótkie i zgrabnę, np: Kup bilet albo Zapisz się"
                    placeholder="tytuł do linka do sprzedazy"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="aditionalLink"
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Jeśli masz linka do wydarzenia na FB - wklej go"
                    placeholder="Link FB"
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Wybierz typ wadarzenia</Typography>
              <Controller
                name="customClass"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {Object.keys(EventsObj).map((event) => (
                      <FormControlLabel
                        key={event}
                        value={event}
                        control={<Radio color="primary" />}
                        label={EventsObj[event as TEventTypes]}
                      />
                    ))}
                  </RadioGroup>
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

export default AddNewEventModal;
