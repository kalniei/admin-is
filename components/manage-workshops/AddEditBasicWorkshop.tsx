import {
  Grid,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  FormHelperText,
  IconButton,
  FormControl,
  Checkbox
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IBasicWorkshopObj, IEmailObject } from '../../ts/interfaces';
import EmailTemplatesAutocomplete from '../email-manager/EmailTemplatesAutocomplete';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment-mini-ts';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import MultiDatePicker, { DateObject } from 'react-multi-date-picker';

interface PageProps {
  checkForm: boolean;
  resetForm: boolean;
  onError: () => void;
  onSuccess: (data: IBasicWorkshopObj) => void;
  chosenWorkshop?: IBasicWorkshopObj;
}

const defaultValues: IBasicWorkshopObj = {
  path: '',
  name: '',
  db_table_name: '',
  email_template_id: 0,
  start_date: '',
  workshop_dates: [],
  price_sale: 0,
  price_normal: 0,
  price_date: '',
  level: 1,
  is_active: true
};

const levelArr = [
  {
    value: 1,
    title: 'zerówka'
  },
  {
    value: 2,
    title: 'podstawowy'
  },
  {
    value: 3,
    title: 'zaawansowany'
  },
  {
    value: 4,
    title: 'mistrz'
  }
];

const AddEditBasicWorkshop = ({
  checkForm,
  onError,
  onSuccess,
  resetForm,
  chosenWorkshop
}: PageProps): JSX.Element => {
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: defaultValues
  });

  useEffect(() => {
    setValue('email_template_id', !chosenEmail ? 0 : chosenEmail.unique_id);
  }, [chosenEmail]);

  useEffect(() => {
    if (!checkForm) return;
    handleSubmit(onSuccess, onError)();
  }, [checkForm]);

  useEffect(() => {
    if (!resetForm) return;
    reset();
    setChosenEmail(null);
  }, [resetForm]);

  useEffect(() => {
    if (!chosenWorkshop) return;
    reset({
      ...chosenWorkshop,
      workshop_dates: JSON.parse(chosenWorkshop.workshop_dates as any)
    });
  }, [chosenWorkshop]);

  return (
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
                disabled={chosenWorkshop ? true : false}
                variant="standard"
                {...field}
                label="Ścieżka do warsztatów ( unikatowy identyfikator )"
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
                disabled={chosenWorkshop ? true : false}
                {...field}
                label="Nazwa tabeli do której będą wpadać warsztatowicze"
                placeholder="Wpisz nazwe tabeli, używaj podkreśleń"
                fullWidth
                error={!!errors?.db_table_name}
                helperText={errors?.db_table_name?.message}
                name="db_table_name"
                required={true}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!chosenWorkshop && '_warsztaty'}
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
          <FormHelperText>
            dotrzymaj się ustalonej konwencji: poziom_DDI/WIP/SEJF/TWIERDZA/KROLESTWO_numer
          </FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <EmailTemplatesAutocomplete
            chosenEmail={chosenEmail}
            setChosenEmail={setChosenEmail}
            emailIdToSet={chosenWorkshop?.email_template_id}
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="start_date"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Data rozpoczęcia warsztatów"
                  minDate={new Date()}
                  inputFormat="dd/MM/yyyy"
                  value={moment(value, 'DD/MM/YYYY').toDate()}
                  onChange={(newValue: any) => {
                    onChange(moment(newValue).format('DD/MM/YYYY'));
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
        <Grid item xs={12}>
          <Controller
            control={control}
            name="workshop_dates"
            rules={{ required: false }}
            render={({ field: { onChange, name, value }, formState: { errors } }) => (
              <MultiDatePicker
                value={value || []}
                onChange={(date: DateObject[]) => {
                  onChange(date?.map((x) => x.format('DD/MM/YYYY')));
                }}
                minDate={moment().format('DD/MM/YYYY')}
                multiple
                format="DD/MM/YYYY"
                sort
                className="custom-calendar"
                plugins={[<DatePanel />]}
                render={(value: string[], openCalendar: any) => {
                  return (
                    <TextField
                      error={!!errors?.workshop_dates}
                      label="Wybierz terminy warsztatów"
                      onClick={openCalendar}
                      variant="standard"
                      fullWidth
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={value}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={openCalendar}
                              onMouseDown={openCalendar}
                              edge="end"
                            >
                              <DateRangeIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  );
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="price_sale"
            rules={{
              required: { value: true, message: 'Wymagany' }
            }}
            render={({ field }) => (
              <TextField
                variant="standard"
                {...field}
                label="Cena przedsprzedazy"
                type="number"
                placeholder="0"
                fullWidth
                required
                error={!!errors?.price_sale}
                helperText={errors?.price_sale?.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">zł</InputAdornment>
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="price_normal"
            rules={{
              required: { value: true, message: 'Wymagany' }
            }}
            render={({ field }) => (
              <TextField
                variant="standard"
                {...field}
                label="Cena normalna"
                type="number"
                placeholder="0"
                fullWidth
                required
                error={!!errors?.price_normal}
                helperText={errors?.price_normal?.message}
                InputProps={{
                  endAdornment: <InputAdornment position="end">zł</InputAdornment>
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="price_date"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Data końca przedsprzedazy"
                  minDate={new Date()}
                  inputFormat="dd/MM/yyyy"
                  value={moment(value, 'DD/MM/YYYY').toDate()}
                  onChange={(newValue: any) => {
                    onChange(moment(newValue).format('DD/MM/YYYY'));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="standard"
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
        <Grid item xs={12}>
          <FormControl>
            <Typography>Wybierz poziom warsztatów</Typography>
            <Controller
              rules={{
                required: {
                  value: true,
                  message: 'Wybierz poziom'
                }
              }}
              name="level"
              control={control}
              render={({ field }) => (
                <RadioGroup row aria-label="color" {...field}>
                  {levelArr.map((x) => (
                    <FormControlLabel
                      key={x.value}
                      value={x.value}
                      control={<Radio />}
                      label={x.title}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <FormControlLabel
                sx={{ width: '100%' }}
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    name="is_active"
                    onClick={() => setValue('is_active', !field.value)}
                  />
                }
                label="Czy warsztaty są aktywne"
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default AddEditBasicWorkshop;
