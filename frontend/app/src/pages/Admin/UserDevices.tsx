import { useEffect, useState } from "react";
import { Box, Breadcrumbs, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Link, MenuItem, Select, Typography } from "@mui/material";
import { addConnection, getDevicesData, getUserDevicesList } from "../../requests/AdminRequests";
import { useParams } from "react-router-dom";

const UserDevices = () => {
  interface DeviceData {
    device: string;
    status: string;
  }

  const [userDevicesData, setUserDevicesData] = useState<DeviceData[]>([]);
  const [devicesData, setDevicesData] = useState<DeviceData[]>([]);
  const [open, setOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const { email } = useParams();

  const handleAddThing = async () => {
    if (newDeviceName.trim() === "") return;
    try {
      await addConnection({ email, device: newDeviceName });
      const newItem = { device: newDeviceName, status: "Pending" };
      setUserDevicesData((prev) => [...prev, newItem]);
      setNewDeviceName("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!email) {
          console.error("Email is undefined");
          return;
        }
        const data = await getUserDevicesList(email);
        setUserDevicesData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDevicesData();
        setDevicesData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px", marginBottom: "20px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/admin/home">
          Home
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>
      <Box display={"flex"} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <h1>User Devices</h1>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Device
        </Button>
      </Box>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Device</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {userDevicesData.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.device}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <Select fullWidth value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} displayEmpty>
            <MenuItem value="" disabled>
              Select a device
            </MenuItem>
            {devicesData.map((device, index) => (
              <MenuItem key={index} value={device.device}>
                {device.device}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddThing}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDevices;
