import { Grid, Button, Typography } from '@mui/material';
import { useState } from 'react';
import getErrorMessage from '../../helpers/getErrorMessage';
import useSnackbar from '../../snackbar/useSnackbar';
import { IBasicWorkshopObj } from '../../ts/interfaces';
import CheckIcon from '@mui/icons-material/Check';
import AddEditBasicWorkshop from './AddEditBasicWorkshop';
import { request } from '../../helpers/restClient';

const BasicCreator = (): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [checkForm, setCheckForm] = useState<boolean>(false);
  const [resetForm, setResetForm] = useState<boolean>(false);

  const snackbar = useSnackbar();

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
      additional_info: JSON.stringify(formData.additional_info),
      db_table_name: formData.db_table_name.includes('_warsztaty')
        ? formData.db_table_name
        : formData.db_table_name + '_warsztaty'
    };

    try {
      await request('post', '/addBasicWorkshop', tempData);
      snackbar.showMessage('Nowy warsztat został utworzony!', 'success');
      setResetForm(true);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Coś poszło nie tak podczas tworzenia nowego warsztatu'),
        'error'
      );
      return;
    } finally {
      manageTriggers(false);
    }
  };

  return (
    <Grid container p={8}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Stwórz nowy warsztat podstawowy - drwi, sejf, twierdza, królestwo lub piguła
        </Typography>
        <Typography fontSize={11}>
          Podczas tworzenia nowych warsztatów jest wymagany wybór szablonu email
        </Typography>
      </Grid>
      <Grid item lg={8} xs={12} mt={4}>
        <AddEditBasicWorkshop
          checkForm={checkForm}
          onError={() => manageTriggers(false)}
          onSuccess={addNewWorkshop}
          resetForm={resetForm}
        />
      </Grid>
      <Grid item xs={12} mt={4}>
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
    </Grid>
  );
};

export default BasicCreator;
