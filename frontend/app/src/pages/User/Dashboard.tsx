import { useEffect, useState } from "react";
import { getSensorData } from "../../requests/UserRequests";
import { Container } from "@mui/material";

const UserDashboard = () => {
  interface SensorData {
    image: string;
    location: string;
    speed: number;
    prediction: string;
  }

  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSensorData();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px" }}>
      <h1>Dashboard</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Image</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Location</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Speed</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {sensorData.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <img src={item.image} alt={item.location} width="100" />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.location}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.speed}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.prediction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default UserDashboard;
