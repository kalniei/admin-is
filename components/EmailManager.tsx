import { Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { request } from '../helpers/restClient';
import { IEmailObject } from '../ts/interfaces';
import TextEditor from './TextEditor';
import AddTemplateDialog from './email-manager/AddTemplateDialog';
import useSnackbar from '../snackbar/useSnackbar';

const EmailManager = (): JSX.Element => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);
  const [content, setContent] = useState<string>('');
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | string>('');
  const [readyToEdit, setReadyToEdit] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const snackbar = useSnackbar();

  const getAllTemplates = async () => {
    try {
      const { data } = await request('get', '/getEmailTemplates');
      setEmailTemplates(data);
    } catch (error) {
      snackbar.showMessage('Not able to get emails list. Try one more time', 'error');
      return;
    }
  };

  const onSelectChange = (event: any) => {
    setChosenEmail(event?.target?.value);
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
      setReadyToEdit(false);
      setContent('');
      setChosenEmail('');
      getAllTemplates();
    } catch (error) {
      console.log(error);

      snackbar.showMessage('Something went wrong with updating email template', 'error');
      return;
    }
  };

  useEffect(() => {
    if (!chosenEmail) return;
    setContent(JSON.parse((chosenEmail as IEmailObject).content));
    setReadyToEdit(true);
  }, [chosenEmail]);

  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
    <Grid container>
      <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
        <Grid item xs={6}>
          <FormControl fullWidth variant="standard">
            <InputLabel>Choose email template</InputLabel>
            <Select value={chosenEmail} label="email" onChange={onSelectChange}>
              {emailTemplates.map((template) => (
                //@ts-ignore - necessary to load object into value
                <MenuItem key={template.unique_id} value={template}>
                  {template.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
      {readyToEdit && <TextEditor parentContent={content} changeParentContent={setContent} />}

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
