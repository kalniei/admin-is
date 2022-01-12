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
      snackbar.showMessage('Please provide title and content', 'warning');
      return;
    }
    try {
      const data = await request('post', '/addNewEmailTemplate', {
        title: title,
        content: JSON.stringify(content)
      });
      snackbar.showMessage('New template is successfully added!', 'success');

      onTemplateAdded();
      handleClose();
    } catch (error) {
      snackbar.showMessage('Something went wrong with adding new email template', 'error');
      return;
    }
  };

  const handleClose = () => {
    closeDialog();
  };

  return (
    <Dialog open={openDialog} fullWidth={true} maxWidth={'lg'}>
      <DialogTitle>Add New Email Template</DialogTitle>
      <DialogContent>
        <TextField
          required
          label="Email Name"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextEditor parentContent={content} changeParentContent={setContent} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={addNewTemplate} variant="outlined" color="success">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTemplateDialog;
