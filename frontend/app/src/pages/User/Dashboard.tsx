import { useEffect, useState } from "react";
import { getSensorData } from "../../requests/UserRequests";
import { Breadcrumbs, Card, CardContent, Container, Link, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useNavigate, useParams } from "react-router-dom";

const UserDashboard = () => {
  interface SensorData {
    image: string;
    location: string;
    speed: number;
    prediction: string;
  }
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const { device } = useParams();

  const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 200 },
    { name: "May", value: 600 },
  ];

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
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px", marginBottom: "20px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/user/home")}>
          Home
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>
      <h1>Overview</h1>
      <Card sx={{ maxWidth: 640, mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Data Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
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
