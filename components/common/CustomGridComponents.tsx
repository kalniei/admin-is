import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport
} from '@mui/x-data-grid';

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

export { CustomToolbar };
