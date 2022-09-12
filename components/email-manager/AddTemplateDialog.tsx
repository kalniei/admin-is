import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import { useState } from 'react';
import { request } from '../../helpers/restClient';
import TextEditor from './TextEditor';
import useSnackbar from '../../snackbar/useSnackbar';
import getErrorMessage from '../../helpers/getErrorMessage';

interface PageProps {
  openDialog: boolean;
  closeDialog: () => void;
  onTemplateAdded: () => void;
}
const AddTemplateDialog = ({
  openDialog,
  closeDialog,
  onTemplateAdded
}: PageProps): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const snackbar = useSnackbar();

  const addNewTemplate = async () => {
    if (!title || !content) {
      snackbar.showMessage('Podaj tytuł i treść', 'warning');
      return;
    }
    try {
      const data = await request('post', '/addNewEmailTemplate', {
        title: title,
        content: JSON.stringify(content)
      });
      snackbar.showMessage('Nowy szablon został pomyślnie dodany!', 'success');

      onTemplateAdded();
      handleClose();
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(
          error,
          'Coś poszło nie tak podczas dodawania nowego szablonu wiadomości e-mail'
        ),
        'error'
      );
      return;
    }
  };

  const handleClose = () => {
    closeDialog();
  };

  return (
    <Dialog open={openDialog} fullWidth={true} maxWidth={'lg'}>
      <DialogTitle>Dodaj nowy szablon wiadomości e-mail</DialogTitle>
      <DialogContent>
        <TextField
          required
          label="Nazwa robocza emailu"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextEditor parentContent={content} changeParentContent={setContent} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="error">
          Anuluj
        </Button>
        <Button onClick={addNewTemplate} variant="outlined" color="success">
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTemplateDialog;
