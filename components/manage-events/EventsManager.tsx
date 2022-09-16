import { Button, Grid, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import getErrorMessage from '../../helpers/getErrorMessage';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IEventObj } from '../../ts/interfaces';
import EventsTable from './EventsTable';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import AddNewEventModal from './AddNewEventModal';

const EventsManager = (): JSX.Element => {
  const snackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eventsTable, setEventsTable] = useState<IEventObj[]>([]);
  const [selected, setSelected] = useState<IEventObj[]>([]);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [openAddNewDialog, setOpenAddNewDialog] = useState<boolean>(false);

  const getAllEvents = async () => {
    try {
      const { data } = await request('get', '/getEventTable');
      setEventsTable(data);
      console.log(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Nie udało się pobrać wydarzenia. Spróbuj jeszcze raz'),
        'error'
      );
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChosenRows = async () => {
    setIsDeleting(true);
    try {
      const { data } = await request('post', '/deleteEvents', {
        key_values: selected.map((x) => x.unique_ID)
      });
      snackbar.showMessage('Usunięte wierszy: ' + data?.affectedRows, 'success');
      setOpenAlertDialog(false);
      getAllEvents();
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Coś poszło nie tak podczas usuwania wierszy'),
        'error'
      );
      return;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAllEvents();
  }, []);

  return (
    <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
      {isLoading && <LinearProgress />}

      <Grid item xs={12} sm={6} sx={{ mt: { xs: 2, sm: 0 } }}>
        <Button onClick={() => setOpenAddNewDialog(true)} variant="outlined" color="success">
          <AddIcon sx={{ mr: 1 }} />
          Dodaj nowe wydarzenie
        </Button>
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        sx={{ mt: { xs: 2, sm: 0 }, textAlign: { xs: 'left', sm: 'right' } }}
      >
        <Button
          onClick={() => setOpenAlertDialog(true)}
          variant="outlined"
          disabled={selected.length === 0}
          color="error"
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Usuń
        </Button>
      </Grid>

      <Grid item xs={12} mt={4}>
        {eventsTable && !isLoading && (
          <EventsTable tableInfo={eventsTable} setParentSelected={setSelected} />
        )}
      </Grid>

      {openAddNewDialog && (
        <AddNewEventModal
          open={openAddNewDialog}
          handleClose={() => setOpenAddNewDialog(false)}
          onConfirm={getAllEvents}
        />
      )}

      {openAlertDialog && (
        <DeleteConfirmationModal
          open={openAlertDialog}
          handleClose={() => setOpenAlertDialog(false)}
          onConfirm={deleteChosenRows}
          isDeleting={isDeleting}
        />
      )}
    </Grid>
  );
};

export default EventsManager;
