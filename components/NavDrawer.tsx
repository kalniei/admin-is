import { Drawer, Toolbar, Divider, List, ListItem, ListItemText } from '@mui/material';
import router from 'next/dist/client/router';

const drawerWidth = 250;

const NavDrawer = (): JSX.Element => {
  const menuArr = [
    {
      text: 'Home',
      path: '/'
    },
    {
      text: 'Send Emails',
      path: '/mail-sender'
    },
    {
      text: 'Workshops Creator',
      path: '/mail-sender'
    },
    {
      text: 'Manager Workshops',
      path: '/mail-sender'
    },
    {
      text: 'Email Templates Manager',
      path: '/email-manager'
    }
  ];

  const listItemClick = (path: string) => {
    router.push(path);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant="permanent"
      anchor="left"
    >
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
    </Drawer>
  );
};

export default NavDrawer;
