import { Grid, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IWorkshopTableObject } from '../../ts/interfaces';
import moment from 'moment-mini-ts';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';

interface PageProps {
  tableInfo: IWorkshopTableObject[];
  setParentSelected: (val: IWorkshopTableObject[]) => void;
}

const WorkshopsTable = ({ tableInfo, setParentSelected }: PageProps): JSX.Element => {
  const [chosenEmail, setChosenEmail] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', flex: 0.2 },
    { field: 'name', headerName: 'First Name', flex: 1 },
    { field: 'surname', headerName: 'Last Name', flex: 1 },
    { field: 'mail', headerName: 'Email', flex: 2 },
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
    { field: 'notes', headerName: 'Notes', flex: 1 },
    { field: 'paid', headerName: 'Paid', flex: 0.2 },
    {
      field: 'edit',
      flex: 0.5,
      headerName: 'Edit',
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => {
            setChosenEmail(String(params.id));
          }}
        >
          <EditIcon />
        </Button>
      )
    }
  ];

  useEffect(() => {
    const tempArr = tableInfo.filter((x: any) => selectionModel.includes(x['id']));
    setParentSelected(tempArr);
  }, [selectionModel]);

  return (
    <Grid>
      <DataGrid
        autoHeight={true}
        rows={tableInfo}
        columns={columns}
        getRowId={(row) => row['id']}
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
      />
    </Grid>
  );
};

export default WorkshopsTable;
