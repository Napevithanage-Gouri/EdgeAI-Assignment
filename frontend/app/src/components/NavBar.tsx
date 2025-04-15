import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'black',
        width: '100%',
        margin: 0,
        padding: 0
      }}
    >
      <Toolbar sx={{ margin: 0, padding: '0 16px' }}>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {role}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {role === "Admin" ? (
            <>
              <Button color="inherit" onClick={() => navigate("/admin/home")}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
                Devices
              </Button>
              <Button color="inherit" onClick={() => navigate("/admin/users")}>
                Users
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/user/home")}>
                Home
              </Button>
            </>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
