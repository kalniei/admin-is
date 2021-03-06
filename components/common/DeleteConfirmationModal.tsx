import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from '@mui/material';

interface PageProps {
  handleClose: () => void;
  open: boolean;
  onConfirm: () => void;
  isDeleting: boolean;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const DeleteConfirmationModal = ({
  handleClose,
  open,
  onConfirm,
  isDeleting
}: PageProps): JSX.Element => {
  const closeDialog = () => {
    handleClose();
  };

  return (
    <Dialog
      maxWidth={'sm'}
      fullWidth={true}
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h4" component="p">
          Potwierdzenie usunięcia
        </Typography>
      </DialogTitle>
      <DialogContent dividers>Czy na pewno chcesz usunąć te rekordy?</DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="error" variant="outlined" disabled={isDeleting}>
          Anuluj
        </Button>
        <Button variant="outlined" onClick={onConfirm} disabled={isDeleting} color="success">
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
