import { Grid, Button, Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import { IEmailObject } from '../../ts/interfaces';
import TextEditor from './TextEditor';
import AddTemplateDialog from './AddTemplateDialog';
import useSnackbar from '../../snackbar/useSnackbar';
import getErrorMessage from '../../helpers/getErrorMessage';

const EmailManager = (): JSX.Element => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);
  const [content, setContent] = useState<string>('');
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const snackbar = useSnackbar();

  const getAllTemplates = async () => {
    try {
      const { data } = await request('get', '/getEmailTemplates');
      setEmailTemplates(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Not able to get emails list. Try one more time'),
        'error'
      );
      return;
    }
  };

  const onSelectChange = (event: any, value: IEmailObject | null) => {
    setChosenEmail(value);
  };

  const saveTemplate = async () => {
    if (!content) {
      snackbar.showMessage('Please provide  content', 'warning');
      return;
    }
    try {
      const data = await request('post', '/updateEmailTemplate', {
        id: (chosenEmail as IEmailObject).unique_id,
        data: { content: JSON.stringify(content) }
      });
      snackbar.showMessage('New template is successfully updated!', 'success');
      setContent('');
      setChosenEmail(null);
      getAllTemplates();
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Something went wrong with updating email template'),
        'error'
      );
      return;
    }
  };

  useEffect(() => {
    if (!chosenEmail) {
      setContent('');
      return;
    }
    setContent(JSON.parse((chosenEmail as IEmailObject).content));
  }, [chosenEmail]);

  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
    <Grid container>
      <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
        <Grid item xs={6}>
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
        <Grid item xs={1} pl={4}>
          <Button variant="outlined" onClick={saveTemplate}>
            Save
          </Button>
        </Grid>
        <Grid item xs={5} textAlign="right">
          <Button variant="outlined" onClick={() => setOpenDialog(true)}>
            Add New Template
          </Button>
        </Grid>
      </Grid>
      {content && <TextEditor parentContent={content} changeParentContent={setContent} />}

      {openDialog && (
        <AddTemplateDialog
          openDialog={openDialog}
          closeDialog={() => setOpenDialog(false)}
          onTemplateAdded={getAllTemplates}
        />
      )}
    </Grid>
  );
};

export default EmailManager;
