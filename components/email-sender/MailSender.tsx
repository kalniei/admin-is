import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  TextField,
  Autocomplete
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import getErrorMessage from '../../helpers/getErrorMessage';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IEmailObject } from '../../ts/interfaces';
import TextEditor from '../email-manager/TextEditor';

import EmailStepper from './EmailStepper';

const MailSender = (): JSX.Element => {
  return (
    <Grid container p={8} justifyContent="center">
      <EmailStepper />
    </Grid>
  );
};

export default MailSender;
