import { Grid, Typography, Card, Divider } from '@mui/material';

interface PageProps {
  hidden: boolean;
  title: string;
  content: string;
  emailsList: string[];
  progressEmails: { [key: string]: boolean };
}

const ConfirmationStep = ({
  hidden,
  title,
  content,
  emailsList,
  progressEmails
}: PageProps): JSX.Element => {
  return (
    <>
      {!hidden && (
        <Card>
          <Grid container item alignItems="flex-start" justifyContent="space-between" p={4}>
            <Grid item xs={12} sm={6}>
              <Typography fontWeight={600} color={'#020260'}>
                Na te adresy wyślemy e-maile:
              </Typography>
              {emailsList.map((email, index) => (
                <Typography
                  key={index}
                  mt={2}
                  color={
                    progressEmails[email]
                      ? 'green'
                      : progressEmails.hasOwnProperty(email)
                      ? 'red'
                      : 'black'
                  }
                >
                  {email}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: { xs: 2, sm: 0 } }}>
              <Typography mb={2} fontWeight={600} color={'#020260'}>
                Tak będzie wyglądał ten e-mail:
              </Typography>
              <Divider />
              <Typography m={2} fontWeight={600}>
                Temat: {title}
              </Typography>
              <Divider />
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Grid>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default ConfirmationStep;
