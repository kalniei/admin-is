import { Grid } from '@mui/material';

import EmailStepper from './EmailStepper';

const MailSender = (): JSX.Element => {
  return (
    <Grid container sx={{ padding: { xs: '2em', sm: '8em' } }} justifyContent="center">
      <EmailStepper />
    </Grid>
  );
};

export default MailSender;
