import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../requests/AuthRequests";
import { useAuth } from "../contexts/AuthContext";
import { TextField, Button, Typography, Container, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const Authentication = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const data = await signUp(email, username, password, role);
        login(data.access_token, role);
      } else {
        const data = await signIn(email, password, role);
        login(data.access_token, role);
      }
      navigate(role === "Admin" ? "/admin/home" : "/user/home");
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ mt: 4, textAlign: "center", backgroundColor: "#DEDEDE", padding: 4, borderRadius: 2, minWidth:"400px" }}>
        <Typography variant="h4" gutterBottom>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>
        {isSignUp ? (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField fullWidth label="Email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField fullWidth label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField fullWidth label="Password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Sign Up
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField fullWidth label="Email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField fullWidth label="Password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Sign In
            </Button>
          </form>
        )}
        <Button onClick={() => setIsSignUp(!isSignUp)} variant="text" color="secondary" sx={{ mt: 2 }}>
          {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};

export default Authentication;
