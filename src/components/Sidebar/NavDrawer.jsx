import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";
import NavContent from "./NavContent.jsx";

import './sidebar.scss'

const drawerWidth = 280;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    borderRight: 0,
  },
}));

function NavDrawer({ mobileOpen, handleDrawerToggle }) {
  const classes = useStyles();

  return (
    <>
      {/* <Drawer
        variant="temporary"
        anchor={"left"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        onClick={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >

      </Drawer> */}
      <NavContent mobileOpen={mobileOpen} />
    </>

  );
}

export default NavDrawer;
