import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { request } from '../../helpers/restClient';
import { IEmailObject } from '../../ts/interfaces';
import useSnackbar from '../../snackbar/useSnackbar';

interface PageProps {
  chosenEmail: IEmailObject;
  setChosenEmail: (val: IEmailObject) => void;
  setContent: (val: string) => void;
}

const GetAllTemplates = ({ chosenEmail, setChosenEmail, setContent }: PageProps): JSX.Element => {
  const [emailTemplates, setEmailTemplates] = useState<IEmailObject[]>([]);

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

  useEffect(() => {
    if (!chosenEmail) return;
    setContent(JSON.parse((chosenEmail as IEmailObject).content));
  }, [chosenEmail]);

  useEffect(() => {
    getAllTemplates();
  }, []);

  return (
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
  );
};

export default GetAllTemplates;
