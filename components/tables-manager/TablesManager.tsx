import { Autocomplete, Grid, Button, TextField, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import WorkshopsTable from './WorkshopsTable';
import DeleteIcon from '@mui/icons-material/Delete';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import AddIcon from '@mui/icons-material/Add';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import TransferModal from './TransferModal';
import getErrorMessage from '../../helpers/getErrorMessage';
import AddNewModal from './AddNewModal';

const TablesManager = (): JSX.Element => {
  const [workshpsArr, setWorkshopsArr] = useState<string[]>([]);
  const [tableInfo, setTableInfo] = useState<IWorkshopTableObject[]>([]);
  const [chosenWorkshop, setChosenWorkshop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selected, setSelected] = useState<IWorkshopTableObject[]>([]);

  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openTransferDialog, setOpenTransferDialog] = useState<boolean>(false);
  const [openAddNewDialog, setOpenAddNewDialog] = useState<boolean>(false);

  const snackbar = useSnackbar();

  const getAllWorkshops = async () => {
    try {
      const { data } = await request('get', '/getAllManagableTables');
      setWorkshopsArr(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Nie mogę dostać tabele warsztatów. Spróbuj jeszcze raz'),
        'error'
      );
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const getChosenWorkshop = async (name: string) => {
    if (!name) return;
    try {
      const { data } = await request('post', '/getSingleTable', {
        table_name: name
      });
      setTableInfo(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Nie udało się dostać wybranego warsztatu. Spróbuj jeszcze raz'),
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
      const { data } = await request('post', '/deleteRowsFromTable', {
        table_name: chosenWorkshop,
        key_values: selected.map((x) => x.mail)
      });
      snackbar.showMessage('Usunięte wierszy: ' + data?.affectedRows, 'success');
      setOpenAlertDialog(false);
      getChosenWorkshop(chosenWorkshop as string);
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

  const reloadWorkshops = () => {
    getChosenWorkshop(chosenWorkshop as string);
  };

  useEffect(() => {
    if (!chosenWorkshop) {
      setTableInfo([]);
      return;
    }
    setIsLoading(true);
    getChosenWorkshop(chosenWorkshop);
  }, [chosenWorkshop]);

  useEffect(() => {
    setIsLoading(true);
    getAllWorkshops();
  }, []);

  return (
    <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
      {isLoading && <LinearProgress />}

      <Grid item xs={6}>
        <Autocomplete
          value={chosenWorkshop}
          onChange={(e, val) => setChosenWorkshop(val)}
          options={workshpsArr}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Wybierz tabele" />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          sx={{ ml: 2 }}
          onClick={() => setOpenAddNewDialog(true)}
          variant="outlined"
          disabled={!chosenWorkshop}
          color="success"
        >
          <AddIcon sx={{ mr: 1 }} />
          Dodaj nowego użytkownika
        </Button>
        <Button
          sx={{ ml: 2 }}
          onClick={() => setOpenTransferDialog(true)}
          variant="outlined"
          disabled={!chosenWorkshop || selected.length === 0}
          color="primary"
        >
          <TransferWithinAStationIcon sx={{ mr: 1 }} />
          przenieś
        </Button>
        <Button
          sx={{ ml: 2 }}
          onClick={() => setOpenAlertDialog(true)}
          variant="outlined"
          disabled={!chosenWorkshop || selected.length === 0}
          color="error"
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Usuń
        </Button>
      </Grid>
      <Grid item xs={12} mt={4}>
        {chosenWorkshop && !isLoading && (
          <WorkshopsTable
            tableInfo={tableInfo}
            setParentSelected={setSelected}
            chosenWorkshop={chosenWorkshop}
          />
        )}
      </Grid>
      {openTransferDialog && (
        <TransferModal
          open={openTransferDialog}
          handleClose={() => setOpenTransferDialog(false)}
          onConfirm={reloadWorkshops}
          workshpsArr={workshpsArr}
          tableFrom={chosenWorkshop}
          selected={selected}
        />
      )}

      {openAddNewDialog && (
        <AddNewModal
          open={openAddNewDialog}
          handleClose={() => setOpenAddNewDialog(false)}
          onConfirm={reloadWorkshops}
          tableFrom={chosenWorkshop}
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

export default TablesManager;
