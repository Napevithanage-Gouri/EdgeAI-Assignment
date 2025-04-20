import { Box, Breadcrumbs, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserData, getUserDevicesList } from "../../requests/UserRequests";

const UserHome = () => {
  interface UserData {
    email: string;
    name: string;
  }

  interface UserDevices {
    device: string;
    status: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDevices, setUserDevices] = useState<UserDevices[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDevicesList();
        setUserDevices(data);
      } catch (error) {
        console.error("Error fetching user devices:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px", marginBottom: "20px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Typography color="text.primary">Home</Typography>
      </Breadcrumbs>
      <h1>User Details</h1>
      <Box sx={{ marginTop:"20px", marginBottom:"20px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
      {userData && (
        <>
          <p>User name: {userData.name}</p>
          <p>User email: {userData.email}</p>
        </>
      )}
      </Box>
      <h1>Devices</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", marginBottom: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Device</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {userDevices.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.device}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.status}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    margin: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    borderRadius: "5px",
                  }}
                  onClick={() => (window.location.href = `/user/dashboard/${item.device}`)}>
                  Dashboard
                </button>
                <button
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    margin: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    borderRadius: "5px",
                  }}
                  onClick={() => (window.location.href = `/user/stream/${item.device}`)}>
                  Stream
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default UserHome;
