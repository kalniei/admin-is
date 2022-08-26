import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import moment from 'moment-mini-ts';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel
} from '@mui/x-data-grid';
import GridCellExpand from './GridCellExpand';
import getErrorMessage from '../../helpers/getErrorMessage';
import { AxiosError } from 'axios';

interface PageProps {
  tableInfo: IWorkshopTableObject[];
  setParentSelected: (val: IWorkshopTableObject[]) => void;
  chosenWorkshop: string;
}

const WorkshopsTable = ({
  tableInfo,
  setParentSelected,
  chosenWorkshop
}: PageProps): JSX.Element => {
  const [pageSize, setPageSize] = useState<number>(20);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const [rows, setRows] = useState(tableInfo);

  const snackbar = useSnackbar();

  function renderCellExpand(params: GridRenderCellParams<string>) {
    return <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />;
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Imię',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand
    },
    {
      field: 'surname',
      headerName: 'Nazwisko',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand
    },
    { field: 'mail', headerName: 'Email', flex: 2.5, editable: true, renderCell: renderCellExpand },
    {
      field: 'phone',
      headerName: 'Telefon',
      flex: 1,
      editable: true
    },
    {
      field: 'date',
      headerName: 'Data',
      flex: 1,
      valueFormatter: (params) => moment(params?.value as string).format('DD/MM/YYYY HH:MM')
    },
    { field: 'level', headerName: 'Poziom', flex: 0.2, editable: true },
    {
      field: 'notes',
      headerName: 'Notatki',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand
    },
    { field: 'paid', headerName: 'Zapłacone', flex: 0.2, editable: true }
  ];

  const handleCellEditCommit = async (params: GridCellEditCommitParams) => {
    if (!params.id || !params.field || !params.value) return;
    try {
      const { data } = await request('post', '/updateWorkshopRow', {
        table_name: chosenWorkshop,
        id: params.id,
        data: {
          [params.field]: params.value
        }
      });
      setRows((prev) =>
        prev.map((row) => (row.mail === params.id ? { ...row, [params.field]: params.value } : row))
      );
      setSelectionModel([]);
      snackbar.showMessage('Edytowany użytkownik o identyfikatorze: ' + params.id, 'success');
    } catch (error: any) {
      snackbar.showMessage(
        getErrorMessage(error, 'Coś poszło nie tak podczas edycji wierszy'),
        'error'
      );
      setRows((prev) => [...prev]);
      return;
    }
  };

  useEffect(() => {
    const tempArr = rows.filter((x: any) => selectionModel.includes(x.mail));
    setParentSelected(tempArr);
  }, [selectionModel]);

  useEffect(() => {
    setRows(tableInfo);
  }, [tableInfo]);

  return (
    <Grid>
      <DataGrid
        autoHeight={true}
        rows={rows}
        columns={columns}
        getRowId={(row) => row['mail']}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20, 100, 1000]}
        pagination
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        onCellEditCommit={handleCellEditCommit}
      />
    </Grid>
  );
};

export default WorkshopsTable;
