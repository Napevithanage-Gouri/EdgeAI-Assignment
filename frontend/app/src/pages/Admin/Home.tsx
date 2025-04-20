import { Breadcrumbs, Button, Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getUserDevices } from "../../requests/AdminRequests";

const AdminHome = () => {
  interface UserDevicesData {
    name: string;
    email: string;
    device_count: number;
  }

  const [userDevices, setUserDevices] = useState<UserDevicesData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDevices();
        setUserDevices(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px", marginBottom: "20px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Typography color="text.primary">Home</Typography>
      </Breadcrumbs>
      <h1>Home</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>User</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Devices</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {userDevices.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.device_count}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Button variant="contained" onClick={() => (window.location.href = `/admin/devices/${item.email}`)}>
                  View Devices
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default AdminHome;
