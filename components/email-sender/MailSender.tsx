import { Grid } from '@mui/material';

import EmailStepper from './EmailStepper';

const MailSender = (): JSX.Element => {
  return (
    <Grid container p={8} justifyContent="center">
      <EmailStepper />
    </Grid>
  );
};

export default MailSender;
