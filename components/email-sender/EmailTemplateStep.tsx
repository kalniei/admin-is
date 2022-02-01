import { Grid, Typography, TextField, Autocomplete, Card } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import getErrorMessage from '../../helpers/getErrorMessage';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IEmailObject } from '../../ts/interfaces';
import TextEditor from '../email-manager/TextEditor';

interface PageProps {
  hidden: boolean;
  content: string;
  setContent: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
}

const EmailTemplateStep = ({
  hidden,
  content,
  setContent,
  title,
  setTitle
}: PageProps): JSX.Element => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | null>(null);

  const snackbar = useSnackbar();

  const getAllTemplates = async () => {
    try {
      const { data } = await request('get', '/getEmailTemplates');
      setEmailTemplates(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Nie można uzyskać listy szablonów e-mail. Spróbuj jeszcze raz'),
        'error'
      );
      return;
    }
  };

  const onSelectChange = (event: any, value: IEmailObject | null) => {
    setChosenEmail(value);
  };

  useEffect(() => {
    setContent(chosenEmail ? JSON.parse((chosenEmail as IEmailObject).content) : '');
  }, [chosenEmail]);

  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
    <>
      {!hidden && (
        <Card>
          <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
            <Grid item xs={12}>
              <TextField
                required
                label="Temat emaila"
                fullWidth
                variant="standard"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6} mt={2}>
              <Autocomplete
                value={chosenEmail}
                onChange={onSelectChange}
                options={emailTemplates}
                getOptionLabel={(option: IEmailObject) => option.title}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Wybierz szablon e-mail"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} pl={4}>
              <Typography>lub utwórz nowy: </Typography>
            </Grid>
          </Grid>

          <TextEditor parentContent={content} changeParentContent={setContent} />
        </Card>
      )}
    </>
  );
};

export default EmailTemplateStep;
