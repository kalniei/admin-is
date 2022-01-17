import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import EmailTemplateStep from './EmailTemplateStep';
import EmailChoiseStep from './EmailChoiseStep';

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
  const [selected, setSelected] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  const handleNext = () => {
    if (activeStep === steps.length - 1) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
          <EmailTemplateStep hidden={activeStep === 1 ? false : true} />
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
              // disabled={!content || !title}
              onClick={handleNext}
            >
              Go Next
            </Button>
          )}

          {activeStep === 2 && (
            <Button sx={{ ml: 2 }} variant="outlined" disabled={isSending} onClick={handleNext}>
              {isSending && <CircularProgress size={20} />}
              Send Emails
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EmailStepper;
