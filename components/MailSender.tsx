import { Card, CardContent, Grid, Button, Typography, Divider } from '@mui/material';

const MailSender = (): JSX.Element => {
  return (
    <Grid container justifyContent="center" m={4}>
      <Grid item xs={12}>
        <Typography variant="h1">Wellcome to MailSender</Typography>
      </Grid>
    </Grid>
  );
};

export default MailSender;
