import { Drawer, Toolbar, Divider, List, ListItem, ListItemText, Hidden } from '@mui/material';
import router from 'next/dist/client/router';
import { getNavArr } from '../../helpers/formatPathname';
import { makeStyles } from '@material-ui/core/styles';

interface PageProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  }
}));

const NavDrawer = ({ open, handleDrawerToggle }: PageProps): JSX.Element => {
  const menuArr = getNavArr();
  const classes = useStyles();

  const listItemClick = (path: string) => {
    handleDrawerToggle();
    router.push(path);
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {menuArr.map((item) => (
          <span key={item.text}>
            <ListItem button key={item.text} onClick={() => listItemClick(item.path)}>
              <ListItemText primary={item.text} />
            </ListItem>
            <Divider sx={{ width: '100%' }} />
          </span>
        ))}
      </List>
    </>
  );

  return (
    <nav className={classes.drawer}>
      <Drawer
        sx={{ display: { xs: 'block', sm: 'none' } }}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
        ModalProps={{
          keepMounted: true
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        sx={{ display: { xs: 'none', sm: 'block' } }}
        classes={{
          paper: classes.drawerPaper
        }}
        variant="permanent"
        open
      >
        {drawer}
      </Drawer>
    </nav>
  );
};

export default NavDrawer;
