import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { request } from '../../helpers/restClient';
import useSnackbar from '../../snackbar/useSnackbar';
import { IEventObj } from '../../ts/interfaces';
import moment from 'moment-mini-ts';
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel
} from '@mui/x-data-grid';
import getErrorMessage from '../../helpers/getErrorMessage';
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { CustomToolbar } from '../common/CustomGridComponents';
import GridCellExpand from '../tables-manager/GridCellExpand';
import EventsObj from '../../helpers/Events';
import { TEventTypes } from '../../ts/types';

interface PageProps {
  tableInfo: IEventObj[];
  setParentSelected: (val: IEventObj[]) => void;
}

const EventsTable = ({ tableInfo, setParentSelected }: PageProps): JSX.Element => {
  const [pageSize, setPageSize] = useState<number>(20);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const [rows, setRows] = useState(tableInfo);

  const theme = useTheme();
  const isDesktopScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const snackbar = useSnackbar();

  function renderCellExpand(params: GridRenderCellParams<string>) {
    return <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />;
  }

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Nazwa',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand
    },
    {
      field: 'customClass',
      headerName: 'Rodzaj',
      flex: 1,
      editable: true,
      valueFormatter: (params) => EventsObj[params?.value as TEventTypes]
    },

    {
      field: 'date',
      headerName: 'Data',
      flex: 1,
      editable: true,
      valueFormatter: (params) => moment(params?.value as string).format('YYYY/MM/DD')
    },
    {
      field: 'time',
      headerName: 'Czas',
      flex: 1,
      editable: true,
      hide: !isDesktopScreen
    },
    {
      field: 'description',
      headerName: 'Opis',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand,
      hide: true
    },
    {
      field: 'price',
      headerName: 'Cena',
      flex: 1,
      renderCell: renderCellExpand,
      editable: true,
      hide: !isDesktopScreen
    },
    {
      field: 'place',
      headerName: 'Miejsce',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand,
      hide: !isDesktopScreen
    },
    {
      field: 'link',
      headerName: 'Link',
      flex: 1,
      renderCell: renderCellExpand,
      editable: true,
      hide: !isDesktopScreen
    },
    {
      field: 'linkTitle',
      headerName: 'Tytuł Dodatk. Linka',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand,
      hide: !isDesktopScreen
    },
    {
      field: 'aditionalLink',
      headerName: 'Dodatkowy Link',
      flex: 1,
      editable: true,
      renderCell: renderCellExpand,
      hide: !isDesktopScreen
    }
  ];

  const handleCellEditCommit = async (params: GridCellEditCommitParams) => {
    if (!params.id || !params.field) return;
    try {
      const { data } = await request('post', '/updateEvent', {
        id: params.id,
        data: {
          [params.field]: params.value
        }
      });
      setRows((prev) =>
        prev.map((row) =>
          row.unique_ID === params.id ? { ...row, [params.field]: params.value } : row
        )
      );
      setSelectionModel([]);
      snackbar.showMessage('Edytowany event o identyfikatorze: ' + params.id, 'success');
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
    const tempArr = rows.filter((x: any) => selectionModel.includes(x.unique_ID));
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
        getRowId={(row) => row['unique_ID']}
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
        components={{
          Toolbar: CustomToolbar
        }}
      />
    </Grid>
  );
};

export default EventsTable;
