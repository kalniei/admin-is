import { Grid, Typography, TextField, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { IEmailObject } from '../../ts/interfaces';
import EmailTemplatesAutocomplete from '../email-manager/EmailTemplatesAutocomplete';
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
  const [chosenEmail, setChosenEmail] = useState<IEmailObject | null>(null);

  useEffect(() => {
    setContent(chosenEmail ? JSON.parse((chosenEmail as IEmailObject).content) : '');
  }, [chosenEmail]);

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
            <Grid item xs={12} sm={6} mt={2}>
              <EmailTemplatesAutocomplete
                chosenEmail={chosenEmail}
                setChosenEmail={setChosenEmail}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pl: { xs: 0, sm: 4 }, mt: { xs: 2, sm: 0 } }}>
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
