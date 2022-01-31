import { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, Step, StepLabel, Stepper } from '@mui/material';
import EmailTemplateStep from './EmailTemplateStep';
import EmailChoiseStep from './EmailChoiseStep';
import ConfirmationStep from './ConfirmationStep';
import useSnackbar from '../../snackbar/useSnackbar';
import { request } from '../../helpers/restClient';
import getErrorMessage from '../../helpers/getErrorMessage';
import router from 'next/dist/client/router';

const steps = [
  {
    id: 0,
    name: "Choose user's emails"
  },
  {
    id: 1,
    name: 'Manage Email Template'
  },
  {
    id: 2,
    name: 'Confirm and Send'
  }
];

const EmailStepper = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [allDone, setAllDone] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [progressEmails, setProgressEmails] = useState<{ [key: string]: boolean }>({});

  const snackbar = useSnackbar();

  const handleNext = () => {
    if (activeStep === steps.length - 1) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const senEmailsPromise = () => {
    var promise = Promise.resolve();
    let progress = {};
    selected.forEach((email, i) => {
      ((i) => {
        promise = promise
          .then(() => {
            return request('post', '/sendEmail', {
              to: email,
              subject: title,
              content: content
            })
              .then(() => {
                progress = {
                  ...progress,
                  [email]: true
                };
                setProgressEmails(progress);
              })
              .catch(() => {
                progress = {
                  ...progress,
                  [email]: false
                };
                setProgressEmails(progress);
              });
          })
          .catch((error) => {
            setIsSending(false);
            snackbar.showMessage(
              getErrorMessage(error, 'Something went wrong with sending emails'),
              'error'
            );
          });
      })(i);
    });

    promise.then(() => {
      setIsSending(false);
      setAllDone(true);
      snackbar.showMessage('Action is finished. You can see autcome in emails', 'success');
    });
  };

  const sendEmail = async () => {
    if (!content || !title || selected.length === 0) {
      snackbar.showMessage(
        `Please provide: ${!content ? 'content ' : !title ? 'title' : 'selected email'}`,
        'warning'
      );
      return;
    }
    setIsSending(true);
    senEmailsPromise();
  };

  const finishStepper = () => {
    router.push('/');
  };

  return (
    <Grid item xs={12}>
      <Grid container justifyContent="center">
        <Stepper activeStep={activeStep} sx={{ width: '100%' }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.name}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid container mt={4} spacing={1}>
        <Grid item xs={12}>
          <EmailChoiseStep hidden={activeStep === 0 ? false : true} setSelected={setSelected} />
          <EmailTemplateStep
            hidden={activeStep === 1 ? false : true}
            content={content}
            setContent={setContent}
            title={title}
            setTitle={setTitle}
          />
          <ConfirmationStep
            hidden={activeStep === 2 ? false : true}
            title={title}
            content={content}
            emailsList={selected}
            progressEmails={progressEmails}
          />
        </Grid>
        <Grid item xs={12} textAlign="right" mt={4}>
          <Button
            disabled={activeStep === 0}
            color="inherit"
            variant="outlined"
            onClick={handleBack}
          >
            Back
          </Button>

          {activeStep === 0 && (
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              disabled={selected.length === 0}
              onClick={handleNext}
            >
              Go Next
            </Button>
          )}

          {activeStep === 1 && (
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              disabled={!content || !title}
              onClick={handleNext}
            >
              Go Next
            </Button>
          )}

          {activeStep === 2 && !allDone && (
            <Button sx={{ ml: 2 }} variant="outlined" disabled={isSending} onClick={sendEmail}>
              {isSending && <CircularProgress size={20} />}
              Send Emails
            </Button>
          )}
          {activeStep === 2 && allDone && (
            <Button sx={{ ml: 2 }} variant="outlined" onClick={finishStepper}>
              Finish
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EmailStepper;
