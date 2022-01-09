import { Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { request } from '../helpers/restClient';
import { IEmailObject } from '../ts/interfaces';
import TextEditor from './TextEditor';

const EmailManager = (): JSX.Element => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);
  const [content, setContent] = useState<string>('');
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | string>('');
  const [readyToEdit, setReadyToEdit] = useState<boolean>(false);

  const getAllTemplates = async () => {
    const { data } = await request('get', '/getEmailTemplates');
    setEmailTemplates(data);
  };

  const onSelectChange = (event: any) => {
    setChosenEmail(event?.target?.value);
  };

  const saveTemplate = () => {
    return;
  };

  const addNewTemplate = () => {
    return;
  };

  const htmlDecode = (str: string): string => {
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  useEffect(() => {
    if (!chosenEmail) return;
    setContent(htmlDecode((chosenEmail as IEmailObject).content));
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
        <Grid item xs={5} textAlign="right" onClick={addNewTemplate}>
          <Button variant="outlined">Add New Template</Button>
        </Grid>
      </Grid>

      <Grid container item alignItems="flex-start" p={4}>
        <Grid item xs={6}>
          {readyToEdit && <TextEditor parentContent={content} changeParentContent={setContent} />}
        </Grid>
        <Grid item xs={6} pl={4}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EmailManager;
