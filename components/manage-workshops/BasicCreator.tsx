import {
  Grid,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import getErrorMessage from '../../helpers/getErrorMessage';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IBasicWorkshopObj, IEmailObject } from '../../ts/interfaces';
import CheckIcon from '@mui/icons-material/Check';
import EmailTemplatesAutocomplete from '../email-manager/EmailTemplatesAutocomplete';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment-mini-ts';

const defaultValues: IBasicWorkshopObj = {
  path: '',
  name: '',
  db_table_name: '',
  email_template_id: 0,
  start_date: ''
};

const BasicCreator = (): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | null>(null);

  const snackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: defaultValues
  });

  const addNewUser = async (formData: IBasicWorkshopObj) => {
    if (!formData?.email_template_id) {
      snackbar.showMessage('Proszę wybrać email', 'error');
      return;
    }
    setIsProcessing(true);
    const tempData = {
      ...formData,
      db_table_name: formData.db_table_name.includes('_warsztaty')
        ? formData.db_table_name
        : formData.db_table_name + '_warsztaty'
    };
    try {
      await request('post', '/addBasicWorkshop', tempData);
      snackbar.showMessage('Nowy warsztat został utworzony!', 'success');
      reset();
      setChosenEmail(null);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Coś poszło nie tak podczas tworzenia nowego warsztatu'),
        'error'
      );
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!chosenEmail) {
      setValue('email_template_id', 0);
      return;
    }
    setValue('email_template_id', chosenEmail.unique_id);
  }, [chosenEmail]);

  return (
    <Grid container p={8}>
      <Grid item xs={12}>
        <Typography variant="h4">Stwórz nowy warsztat</Typography>
        <Typography fontSize={11}>
          Podczas tworzenia nowych warsztatów jest wymagany wybór szablonu email
        </Typography>
      </Grid>
      <Grid item lg={8} xs={12} mt={4}>
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
                    label="Nazwa Warsztatów"
                    placeholder="Wpisz Nazwę"
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
                name="path"
                rules={{
                  required: { value: true, message: 'Wymagany' },
                  validate: (value) =>
                    (value?.indexOf(' ') < 0 && value?.indexOf('/') < 0) ||
                    'Nie może być any spacji any slash'
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Ścieżka do warsztatów"
                    placeholder="Wpisz ścieżkę"
                    fullWidth
                    error={!!errors?.path}
                    helperText={errors?.path?.message}
                    name="path"
                    required={true}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">https://improsilesia.pl/</InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="db_table_name"
                rules={{
                  required: {
                    value: true,
                    message: 'Nazwa tabeli jest wymagana'
                  },
                  validate: (value) => value?.indexOf(' ') < 0 || 'Nie może być spacji'
                }}
                render={({ field }) => (
                  <TextField
                    variant="standard"
                    {...field}
                    label="Nazwa tabeli do której będą wpadać warsztatowicze"
                    placeholder="Wpisz nazwe tabeli, używaj podkreśleń"
                    fullWidth
                    error={!!errors?.db_table_name}
                    helperText={errors?.db_table_name?.message}
                    name="db_table_name"
                    required={true}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">_warsztaty</InputAdornment>
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <EmailTemplatesAutocomplete
                chosenEmail={chosenEmail}
                setChosenEmail={setChosenEmail}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="Data rozpoczęcia warsztatów"
                      minDate={new Date()}
                      inputFormat="dd/MM/yyyy"
                      value={value}
                      onChange={(newValue) => {
                        onChange(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          fullWidth
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item xs={12} mt={4}>
        <Button
          variant="outlined"
          onClick={handleSubmit(addNewUser)}
          disabled={isProcessing}
          color="success"
        >
          <CheckIcon sx={{ mr: 1 }} />
          Zapisz
        </Button>
      </Grid>
    </Grid>
  );
};

export default BasicCreator;
