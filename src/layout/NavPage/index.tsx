import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Report,
  AnalyticsRounded,
  LocationCityRounded,
  AssignmentTurnedInRounded,
  LogoutRounded,
} from "@mui/icons-material";
import { useAuthContext } from "../../contexts/AuthContext";
import { useRouter } from "next/router";

type NavPageProps = {
  children: React.ReactNode;
};

const NavPage: React.FC<NavPageProps> = ({ children }) => {
  const { singOut } = useAuthContext();

  const router = useRouter();
  const match = router.pathname;

  return (
    <Box display="flex">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box
            component="img"
            src="4qualy-logo.png"
            width="6.5rem"
            height="4rem"
            marginLeft="2.5rem"
          />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent">
        <Toolbar />
        <Box
          width="15rem"
          display="flex"
          height="100vh"
          flexDirection="column"
          justifyContent="space-between"
        >
          <List sx={{ flex: 1 }}>
            <ListItemButton
              selected={match === "/dashboard"}
              onClick={() => router.push("/dashboard")}
            >
              <ListItemIcon>
                <AnalyticsRounded sx={{ color: "#111" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              selected={match === "/occurrence"}
              onClick={() => router.push("/occurrence")}
            >
              <ListItemIcon>
                <Report sx={{ color: "#111" }} />
              </ListItemIcon>
              <ListItemText primary="Occurrence" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <LocationCityRounded sx={{ color: "#111" }} />
              </ListItemIcon>
              <ListItemText primary="Providers" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <AssignmentTurnedInRounded sx={{ color: "#111" }} />
              </ListItemIcon>
              <ListItemText primary="Audit" />
            </ListItemButton>
          </List>
          <List>
            <ListItemButton onClick={singOut}>
              <ListItemIcon>
                <LogoutRounded sx={{ color: "#111" }} />
              </ListItemIcon>
              <ListItemText primary="Logout " />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box width="100%" marginLeft="15.5rem" p={5}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default NavPage;
