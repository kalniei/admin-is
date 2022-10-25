import {
  Grid,
  Button,
  Typography,
  Autocomplete,
  TextField,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import { useEffect, useState } from 'react';
import getErrorMessage from '../../helpers/getErrorMessage';
import useSnackbar from '../../snackbar/useSnackbar';
import { IBasicWorkshopObj } from '../../ts/interfaces';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddEditBasicWorkshop from './AddEditBasicWorkshop';
import { request } from '../../helpers/restClient';

const BasicManager = (): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [checkForm, setCheckForm] = useState<boolean>(false);
  const [resetForm, setResetForm] = useState<boolean>(false);

  const [workshpsArr, setWorkshopsArr] = useState<IBasicWorkshopObj[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chosenWorkshop, setChosenWorkshop] = useState<IBasicWorkshopObj | null>(null);

  const snackbar = useSnackbar();

  const getAllBasicWorkshops = async () => {
    try {
      const { data } = await request('get', '/getBasicWorkshops');
      setWorkshopsArr(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Nie mogę dostać tabele warsztatów. Spróbuj jeszcze raz'),
        'error'
      );
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const manageTriggers = (value: boolean) => {
    setIsProcessing(value);
    setCheckForm(value);
  };

  const addNewWorkshop = async (formData: IBasicWorkshopObj) => {
    if (!formData?.email_template_id) {
      snackbar.showMessage('Proszę wybrać email', 'error');
      return;
    }
    setIsProcessing(true);

    const tempData = {
      ...formData,
      workshop_dates: JSON.stringify(formData.workshop_dates),
      additional_info: JSON.stringify(formData.additional_info)
    };

    try {
      await request('post', '/updateBasicWorkshop', {
        path: tempData.path,
        data: tempData
      });
      snackbar.showMessage('Edycja powiodła się!', 'success');
      setChosenWorkshop(null);
      getAllBasicWorkshops();
    } catch (error: any) {
      snackbar.showMessage(getErrorMessage(error, 'Coś poszło nie tak podczas edycji'), 'error');
      return;
    } finally {
      manageTriggers(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAllBasicWorkshops();
  }, []);

  return (
    <Grid container p={8}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Edytuj dostępne warsztaty podstawowy - drwi, sejf, twierdza, królestwo lub piguła
        </Typography>
      </Grid>

      {isLoading && <LinearProgress />}

      {workshpsArr.length && (
        <Grid item xs={12} sm={6}>
          <Autocomplete
            value={chosenWorkshop}
            onChange={(e, val) => {
              setChosenWorkshop(val);
            }}
            options={workshpsArr}
            getOptionLabel={(option: IBasicWorkshopObj) => option.name}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Wybierz warsztaty do edycji" />
            )}
          />
        </Grid>
      )}

      {chosenWorkshop && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Grid item lg={8} xs={12} mt={4}>
              <AddEditBasicWorkshop
                chosenWorkshop={chosenWorkshop}
                checkForm={checkForm}
                onError={() => manageTriggers(false)}
                onSuccess={addNewWorkshop}
                resetForm={resetForm}
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <Button
                variant="outlined"
                onClick={() => setChosenWorkshop(null)}
                disabled={isProcessing}
                color="error"
                sx={{ mr: 2 }}
              >
                <CloseIcon sx={{ mr: 1 }} />
                Cofnij
              </Button>
              <Button
                variant="outlined"
                onClick={() => manageTriggers(true)}
                disabled={isProcessing}
                color="success"
              >
                <CheckIcon sx={{ mr: 1 }} />
                Zapisz
              </Button>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Grid>
  );
};

export default BasicManager;
