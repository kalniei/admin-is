import { Autocomplete, TextField } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { request } from '../../helpers/restClient';
import { IEmailObject } from '../../ts/interfaces';
import useSnackbar from '../../snackbar/useSnackbar';
import getErrorMessage from '../../helpers/getErrorMessage';

interface PageProps {
  chosenEmail: IEmailObject | null;
  setChosenEmail: (val: IEmailObject | null) => void;
}
const EmailTemplatesAutocomplete = React.forwardRef(
  ({ chosenEmail, setChosenEmail }: PageProps, ref?) => {
    const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);
    const snackbar = useSnackbar();

    useImperativeHandle(ref, () => ({
      getAllTemplates() {
        getAllTemplates();
      }
    }));

    const getAllTemplates = async () => {
      try {
        const { data } = await request('get', '/getEmailTemplates');
        setEmailTemplates(data);
      } catch (error: any) {
        snackbar.showMessage(
          getErrorMessage(error, 'Nie można uzyskać listy adresów e-mail. Spróbuj jeszcze raz'),
          'error'
        );
        return;
      }
    };

    const onSelectChange = (event: any, value: IEmailObject | null) => {
      setChosenEmail(value);
    };

    useEffect(() => {
      getAllTemplates();
    }, []);

    return (
      <Autocomplete
        value={chosenEmail}
        onChange={onSelectChange}
        options={emailTemplates}
        getOptionLabel={(option: IEmailObject) => option.title}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Wybierz szablon e-mail" fullWidth />
        )}
      />
    );
  }
);

export default EmailTemplatesAutocomplete;
