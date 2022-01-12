import {
  Autocomplete,
  CardContent,
  Grid,
  Button,
  Typography,
  Divider,
  TextField,
  LinearProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import WorkshopsTable from './WorkshopsTable';

const TablesManager = (): JSX.Element => {
  const [workshpsArr, setWorkshopsArr] = useState<string[]>([]);
  const [tableInfo, setTableInfo] = useState<IWorkshopTableObject[]>([]);
  const [chosenWorkshop, setChosenWorkshop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const snackbar = useSnackbar();

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
    try {
      const { data } = await request('post', '/getSingleTable', {
        table_name: name
      });
      setTableInfo(data);
    } catch (error) {
      snackbar.showMessage('Not able to get chosen workshop. Try one more time', 'error');
      return;
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
    getAllWorkshops();
  }, []);

  return (
    <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
      {isLoading && <LinearProgress />}
      <Grid item xs={12}>
        <Autocomplete
          value={chosenWorkshop}
          onChange={(e, val) => setChosenWorkshop(val)}
          options={workshpsArr}
          sx={{ width: 600 }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Choose table" />
          )}
        />
      </Grid>
      <Grid item xs={12} mt={4}>
        {tableInfo.length > 0 && <WorkshopsTable tableInfo={tableInfo} />}
      </Grid>
    </Grid>
  );
};

export default TablesManager;
