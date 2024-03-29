import { Grid, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { request } from '../../helpers/restClient';
import { IEmailObject } from '../../ts/interfaces';
import TextEditor from './TextEditor';
import AddTemplateDialog from './AddTemplateDialog';
import useSnackbar from '../../snackbar/useSnackbar';
import getErrorMessage from '../../helpers/getErrorMessage';
import EmailTemplatesAutocomplete from './EmailTemplatesAutocomplete';

const EmailManager = (): JSX.Element => {
  const [content, setContent] = useState<string>('');
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const snackbar = useSnackbar();
  const myRef = useRef();

  const getAllTemplates = () => {
    (myRef as any).current.getAllTemplates();
  };
  const saveTemplate = async () => {
    if (!content) {
      snackbar.showMessage('Proszę podać treść', 'warning');
      return;
    }
    try {
      await request('post', '/updateEmailTemplate', {
        id: (chosenEmail as IEmailObject).unique_id,
        data: { content: JSON.stringify(content) }
      });
      snackbar.showMessage('Nowy szablon został pomyślnie zaktualizowany!', 'success');
      setContent('');
      setChosenEmail(null);
      getAllTemplates();
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(
          error,
          'Coś poszło nie tak podczas aktualizowania szablonu wiadomości e-mail'
        ),
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

  return (
    <Grid container>
      <Grid container item alignItems="flex-end" justifyContent="space-between" p={2} pr={0}>
        <Grid item xs={12} sm={6}>
          <EmailTemplatesAutocomplete
            ref={myRef}
            chosenEmail={chosenEmail}
            setChosenEmail={setChosenEmail}
          />
        </Grid>
        <Grid item xs={12} sm={1} sx={{ pl: { xs: 0, sm: 4 } }}>
          <Button
            variant="outlined"
            onClick={saveTemplate}
            sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 1, sm: 0 } }}
          >
            Zapisz
          </Button>
        </Grid>
        <Grid item xs={12} sm={5} textAlign="right">
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(true)}
            sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 1, sm: 0 } }}
          >
            Dodaj nowy szablon
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ pl: { xs: 2, sm: 2 } }}>
        {content && <TextEditor parentContent={content} changeParentContent={setContent} />}
      </Grid>

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
