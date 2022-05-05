import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useContext, useEffect, useState } from 'react';
import { SnackbarContext } from './snackbarState';
import useSnackbar from './useSnackbar';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = (props: any): JSX.Element => {
  const { state: state } = useContext(SnackbarContext);
  const snackbar = useSnackbar();
  const [open, setOpen] = useState<boolean>(state.isOpen);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      snackbar.hideMessage();
    }, 1000);
  };

  useEffect(() => {
    setOpen(state.isOpen);
  }, [state.isOpen]);

  return (
    <>
      {props.children}
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={state.severity} sx={{ width: '100%' }}>
            {state.message}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};

export default CustomSnackbar;
