import { useContext } from 'react';
import { SnackbarContext } from './snackbarState';

const useSnackbar = () => {
  const { dispatch } = useContext(SnackbarContext);
  const snackbar = {
    showMessage: function (message, severity) {
      const data = { message: message, severity: severity, isOpen: true };
      dispatch({
        type: 'SET_SNACKBAR',
        payload: data
      });
    },
    hideMessage: function () {
      dispatch({
        type: 'SET_INIT_STATE'
      });
    }
  };
  return snackbar;
};

export default useSnackbar;
