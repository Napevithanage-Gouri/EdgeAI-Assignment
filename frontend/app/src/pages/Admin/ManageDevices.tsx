import { useEffect, useState } from "react";
import { getDevicesData, addDevice } from "../../requests/AdminRequests";
import { Box, Breadcrumbs, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

const UserDashboard = () => {
  interface DeviceData {
    device: string;
    status: string;
  }

  const [devicesData, setDevicesData] = useState<DeviceData[]>([]);
  const [open, setOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");

  const handleAddThing = async () => {
    if (newDeviceName.trim() === "") return;
    try {
      await addDevice({ device: newDeviceName });
      const newItem = { device: newDeviceName, status: "Pending" };
      setDevicesData((prev) => [...prev, newItem]);
      setNewDeviceName("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

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
        <Typography color="text.primary">Devices</Typography>
      </Breadcrumbs>
      <Box display={"flex"} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <h1>Devices</h1>
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
          {devicesData.map((item, index) => (
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
          <TextField autoFocus margin="dense" label="Device Name" fullWidth value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} />
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

export default UserDashboard;
