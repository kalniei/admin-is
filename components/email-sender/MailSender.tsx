import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  TextField,
  Autocomplete
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IEmailObject } from '../../ts/interfaces';
import TextEditor from '../email-manager/TextEditor';

const MailSender = (): JSX.Element => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);
  const [content, setContent] = useState<string>('');
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | null>(null);
  const snackbar = useSnackbar();
  const [title, setTitle] = useState<string>('');

  const getAllTemplates = async () => {
    try {
      const { data } = await request('get', '/getEmailTemplates');
      setEmailTemplates(data);
    } catch (error) {
      snackbar.showMessage('Not able to get emails list. Try one more time', 'error');
      return;
    }
  };

  const onSelectChange = (event: any, value: IEmailObject | null) => {
    setChosenEmail(value);
  };

  const sendEmail = async () => {
    if (!content || !title) {
      snackbar.showMessage('Please provide content and subject', 'warning');
      return;
    }
    try {
      await request('post', '/sendEmail', {
        to: ['olga.kalniei@gmail.com'],
        subject: title,
        content: content
      });
      snackbar.showMessage('Emails have been send', 'success');
      setContent('');
      setChosenEmail(null);
    } catch (error) {
      snackbar.showMessage('Something went wrong with sending emails', 'error');
      return;
    }
  };

  useEffect(() => {
    if (!chosenEmail) return;
    setContent(JSON.parse((chosenEmail as IEmailObject).content));
  }, [chosenEmail]);

  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
    <Grid container>
      <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
        <Grid item xs={12}>
          <TextField
            required
            label="Email Subject"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} mt={2}>
          <Autocomplete
            value={chosenEmail}
            onChange={onSelectChange}
            options={emailTemplates}
            getOptionLabel={(option: IEmailObject) => option.title}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Choose email template" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={6} pl={4}>
          <Typography>or create a new one: </Typography>
        </Grid>
      </Grid>

      <TextEditor parentContent={content} changeParentContent={setContent} />
      <Grid item xs={15} pl={4}>
        <Button variant="outlined" onClick={sendEmail}>
          Send Email
        </Button>
      </Grid>
    </Grid>
  );
};

export default MailSender;
