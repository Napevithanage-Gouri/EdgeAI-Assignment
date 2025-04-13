import { useEffect, useState } from "react";
import { getDevicesData } from "../../requests/AdminRequests";
import { Container } from "@mui/material";

const UserDashboard = () => {
  interface DeviceData {
    device: string;
    status: string;
  }

  const [devicesData, setDevicesData] = useState<DeviceData[]>([]);

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
    <Container sx={{padding: "0px", margin: "0px", marginTop: "20px"}}>
      <h1>Dashboard</h1>
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
    </Container>
  );
};

export default UserDashboard;
