import { Card, CardContent, Grid, Button, Typography, Divider } from '@mui/material';

const Home = (): JSX.Element => {
  return (
    <Grid container justifyContent="center" m={4}>
      <Grid item xs={12}>
        <Typography variant="h1">Wellcome to Amazing Admin Panel</Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
