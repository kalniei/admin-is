import { Autocomplete, Grid, TextField, LinearProgress, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import WorkshopsTable from '../tables-manager/WorkshopsTable';
import getErrorMessage from '../../helpers/getErrorMessage';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import GridCellExpand from '../tables-manager/GridCellExpand';
import moment from 'moment-mini-ts';

interface PageProps {
  hidden: boolean;
  setSelected: (val: string[]) => void;
}

const EmailChoiseStep = ({ hidden, setSelected }: PageProps): JSX.Element => {
  const [workshpsArr, setWorkshopsArr] = useState<string[]>([]);
  const [tableInfo, setTableInfo] = useState<IWorkshopTableObject[]>([]);
  const [chosenWorkshop, setChosenWorkshop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const snackbar = useSnackbar();

  function renderCellExpand(params: GridRenderCellParams<string>) {
    return <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />;
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'First Name',
      flex: 1,
      renderCell: renderCellExpand
    },
    {
      field: 'surname',
      headerName: 'Last Name',
      flex: 1,
      renderCell: renderCellExpand
    },
    { field: 'mail', headerName: 'Email', flex: 2.5, renderCell: renderCellExpand },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      valueFormatter: (params) => moment(params?.value as string).format('DD/MM/YYYY HH:MM')
    },
    { field: 'level', headerName: 'Level', flex: 0.2 },
    { field: 'notes', headerName: 'Notes', flex: 1, renderCell: renderCellExpand },
    { field: 'paid', headerName: 'Paid', flex: 0.2 }
  ];

  const getAllWorkshops = async () => {
    try {
      const { data } = await request('get', '/getAllManagableTables');
      setWorkshopsArr(data);
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Not able to get workshops. Try one more time'),
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
        getErrorMessage(error, 'Not able to get chosen workshop. Try one more time'),
        'error'
      );
      return;
    } finally {
      setIsLoading(false);
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
    setSelected(selectionModel as string[]);
  }, [selectionModel]);

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

            <Grid item xs={12} mt={4}>
              {chosenWorkshop && !isLoading && (
                <Grid>
                  <DataGrid
                    autoHeight={true}
                    rows={tableInfo}
                    columns={columns}
                    getRowId={(row) => row['mail']}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20, 100, 1000]}
                    pagination
                    checkboxSelection
                    onSelectionModelChange={(newSelectionModel) => {
                      setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default EmailChoiseStep;
