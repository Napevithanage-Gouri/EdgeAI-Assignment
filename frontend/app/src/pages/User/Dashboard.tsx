import { useEffect, useState } from "react";
import { getSensorData, getSensorDataAgg } from "../../requests/UserRequests";
import { Box, Breadcrumbs, Card, CardContent, Container, Link, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useNavigate, useParams } from "react-router-dom";

const UserDashboard = () => {
  interface SensorData {
    event_id: string;
    device_name: string;
    timestamp: string;
    lat: number;
    lon: number;
    speed: number;
    status: string;
    event_type: string | null;
    confidence: number;
  }
  interface AggregatedData {
    overall: {
      Drowsy: number;
      Alert: number;
    };
    time_series: {
      time: string;
      Drowsy: number;
      Alert: number;
    }[];
  }

  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData | null>(null);
  const { device } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSensorData(device);
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
  }, [device]);

  useEffect(() => {
    const fetchAggData = async () => {
      try {
        const aggData = await getSensorDataAgg(device);
        setAggregatedData(aggData);
      } catch (error) {
        console.error("Error fetching aggregated sensor data:", error);
      }
    };
    fetchAggData();
  }, [device]);

  const eventTypeChartData = aggregatedData
    ? [
        { name: "Drowsy", count: aggregatedData.overall.Drowsy },
        { name: "Alert", count: aggregatedData.overall.Alert },
      ]
    : [];

  const timeSeriesData = aggregatedData ? aggregatedData.time_series : [];

  return (
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px", marginBottom: "20px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/user/home")}>
          Home
        </Link>
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>
      <h1>Overview</h1>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 4, width: "100%" }}>
        <Card sx={{ boxShadow: 3, mt: 2, mb: 2 }}>
          <CardContent>
        <Typography variant="h6" gutterBottom>
          Drowsiness vs Alert Events
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventTypeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 3, mt: 2, mb: 2 }}>
          <CardContent>
        <Typography variant="h6" gutterBottom>
          Time Series: Drowsiness vs Alert
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="time" tickFormatter={(time) => time.slice(11, 16)} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Drowsy" stackId="a" fill="#ef4444" />
            <Bar dataKey="Alert" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      <h1>Dashboard</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", marginBottom: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Event ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Device Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Timestamp</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Latitude</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Longitude</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Speed</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Vehicle Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Confidence</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {sensorData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.event_id.slice(0, 8)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.device_name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.timestamp}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.lat}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.lon}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.speed}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.status}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{(item.confidence * 100).toFixed(2)}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.event_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ marginRight: "10px", padding: "8px 16px", cursor: "pointer" }}>
          Previous
        </button>
        <span style={{ padding: "8px 16px" }}>
          Page {currentPage} of {Math.ceil(sensorData.length / rowsPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sensorData.length / rowsPerPage)))}
          disabled={currentPage === Math.ceil(sensorData.length / rowsPerPage)}
          style={{ marginLeft: "10px", padding: "8px 16px", cursor: "pointer" }}>
          Next
        </button>
      </div>
    </Container>
  );
};

export default UserDashboard;
