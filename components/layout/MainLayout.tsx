import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import formatPathname from '../../helpers/formatPathname';
import IPage from '../../ts/interfaces';
import NavDrawer from './NavDrawer';

const drawerWidth = 250;

const MainLayout = ({ children }: IPage): JSX.Element => {
  const router = useRouter();

  return (
    <div>
      <AppBar
        color="secondary"
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h5" noWrap component="div">
            {formatPathname(router.pathname)}
          </Typography>
        </Toolbar>
      </AppBar>
      <NavDrawer />
      <Box component="main" sx={{ flexGrow: 1, padding: '1em', paddingLeft: `${drawerWidth}px` }}>
        <Toolbar />

        {children}
      </Box>
    </div>
  );
};

export default MainLayout;
