import {
  Autocomplete,
  Grid,
  Button,
  TextField,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import WorkshopsTable from './WorkshopsTable';
import DeleteIcon from '@mui/icons-material/Delete';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const TablesManager = (): JSX.Element => {
  const [workshpsArr, setWorkshopsArr] = useState<string[]>([]);
  const [tableInfo, setTableInfo] = useState<IWorkshopTableObject[]>([]);
  const [chosenWorkshop, setChosenWorkshop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const snackbar = useSnackbar();
  const [selected, setSelected] = useState<IWorkshopTableObject[]>([]);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);

  const getAllWorkshops = async () => {
    try {
      const { data } = await request('get', '/getAllManagableTables');
      setWorkshopsArr(data);
    } catch (error) {
      snackbar.showMessage('Not able to get workshops. Try one more time', 'error');
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
    } catch (error) {
      snackbar.showMessage('Not able to get chosen workshop. Try one more time', 'error');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChosenRows = async () => {
    setIsProcessing(true);
    try {
      const { data } = await request('post', '/deleteRowsFromTable', {
        table_name: chosenWorkshop,
        key_values: selected.map((x) => x.mail)
      });
      snackbar.showMessage('Removed records: ' + data?.affectedRows, 'success');
      setOpenAlertDialog(false);
      getChosenWorkshop(chosenWorkshop as string);
    } catch (error) {
      snackbar.showMessage('Something went wrong deleting rows', 'error');
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  const transferChosenRows = async () => {
    setIsProcessing(true);
    try {
      const { data } = await request('post', '/transferToGlobalWorkshopsTable', {
        table_name_from: chosenWorkshop,
        table_name_to: 'ALL_Users_warsztaty',
        row_object: selected[0]
      });
      snackbar.showMessage('transpered records: ' + data?.affectedRows, 'success');
      getChosenWorkshop(chosenWorkshop as string);
    } catch (error) {
      snackbar.showMessage('Something went wrong deleting rows', 'error');
      return;
    } finally {
      setIsProcessing(false);
    }
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
            <TextField {...params} variant="standard" label="Choose table" />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          sx={{ ml: 2 }}
          onClick={transferChosenRows}
          variant="outlined"
          disabled={!chosenWorkshop || selected.length === 0}
          color="success"
        >
          {!isProcessing ? (
            <TransferWithinAStationIcon sx={{ mr: 1 }} />
          ) : (
            <CircularProgress size={16} sx={{ mr: 2 }} />
          )}
          Transfer
        </Button>
        <Button
          sx={{ ml: 2 }}
          onClick={() => setOpenAlertDialog(true)}
          variant="outlined"
          disabled={!chosenWorkshop || selected.length === 0}
          color="error"
        >
          <DeleteIcon />
          Remove
        </Button>
      </Grid>
      <Grid item xs={12} mt={4}>
        {tableInfo.length > 0 && (
          <WorkshopsTable tableInfo={tableInfo} setParentSelected={setSelected} />
        )}
      </Grid>
      <DeleteConfirmationModal
        open={openAlertDialog}
        handleClose={() => setOpenAlertDialog(false)}
        onConfirm={deleteChosenRows}
        isDeleting={isProcessing}
      />
    </Grid>
  );
};

export default TablesManager;
