import {
  Autocomplete,
  Grid,
  TextField,
  LinearProgress,
  Card,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import WorkshopsTable from '../tables-manager/WorkshopsTable';
import getErrorMessage from '../../helpers/getErrorMessage';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import GridCellExpand from '../tables-manager/GridCellExpand';
import moment from 'moment-mini-ts';
import { CustomToolbar } from '../common/CustomGridComponents';

interface PageProps {
  hidden: boolean;
  setSelected: (val: string[]) => void;
}

const DEFAULT_EMAIL = 'szymonpaszek2@gmail.com';

const EmailChoiseStep = ({ hidden, setSelected }: PageProps): JSX.Element => {
  const [workshpsArr, setWorkshopsArr] = useState<string[]>([]);
  const [tableInfo, setTableInfo] = useState<IWorkshopTableObject[]>([]);
  const [chosenWorkshop, setChosenWorkshop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [checked, setChecked] = useState(true);

  const snackbar = useSnackbar();

  function renderCellExpand(params: GridRenderCellParams<string>) {
    return <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />;
  }

  const getAllWorkshops = async () => {
    try {
      const { data } = await request('get', '/getAllManagableTables');
      setWorkshopsArr(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Nie mogę dostać tabeli warsztatów. Spróbuj jeszcze raz'),
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

  const manageSelected = (selectionModel: IWorkshopTableObject[]) => {
    let temp = JSON.parse(JSON.stringify(selectionModel)).map((x: IWorkshopTableObject) => x.mail);

    if (checked && !temp.includes(DEFAULT_EMAIL)) {
      temp.push(DEFAULT_EMAIL);
    } else if (!checked && temp.includes(DEFAULT_EMAIL)) {
      temp = temp.filter((item: string) => item !== DEFAULT_EMAIL);
    }

    setSelected(temp);
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
    <>
      {!hidden && (
        <Card>
          <Grid container item alignItems="flex-end" justifyContent="space-between" p={4}>
            {isLoading && <LinearProgress />}

            <Grid item xs={12} sm={6}>
              <Autocomplete
                value={chosenWorkshop}
                onChange={(e, val) => setChosenWorkshop(val)}
                options={workshpsArr}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" label="Wybierz tabele" />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={5} sx={{ mt: { xs: 2, sm: 0 } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={`Wyślij do ${DEFAULT_EMAIL}`}
              />
            </Grid>

            <Grid item xs={12} mt={4}>
              {chosenWorkshop && !isLoading && (
                <WorkshopsTable
                  tableInfo={tableInfo}
                  setParentSelected={manageSelected}
                  chosenWorkshop={chosenWorkshop}
                />
              )}
            </Grid>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default EmailChoiseStep;
