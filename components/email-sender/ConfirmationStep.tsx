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
            <Grid item xs={6}>
              <Typography fontWeight={600} color={'#020260'}>
                We will send emails to those addresses:
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
            <Grid item xs={6}>
              <Typography mb={2} fontWeight={600} color={'#020260'}>
                This is how will this email look like:
              </Typography>
              <Divider />
              <Typography m={2} fontWeight={600}>
                Title: {title}
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
