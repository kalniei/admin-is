import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import formatPathname from '../../helpers/formatPathname';
import IPage from '../../ts/interfaces';
import NavDrawer from './NavDrawer';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  main: {
    flexGrow: 1,
    padding: '1em',
    paddingLeft: 0,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: drawerWidth
    }
  }
}));

const MainLayout = ({ children }: IPage): JSX.Element => {
  const router = useRouter();
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      <AppBar color="secondary" position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            {formatPathname(router.pathname)}
          </Typography>
        </Toolbar>
      </AppBar>
      <NavDrawer open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box component="main" className={classes.main}>
        <Toolbar />

        {children}
      </Box>
    </div>
  );
};

export default MainLayout;
