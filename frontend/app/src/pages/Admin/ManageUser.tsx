import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { getUsers, setUserAuthorization } from "../../requests/AdminRequests";
import { Breadcrumbs, Container, Typography } from "@mui/material";

const ManageUser = () => {
  interface User {
    name: string;
    email: string;
    authorization: string;
    admin_privilege: string;
  }
  
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAuthorizationChange = async (index: number) => {
    const updatedUserData = [...userData];
    updatedUserData[index].authorization = updatedUserData[index].authorization === "Yes" ? "No" : "Yes";
    setUserData(updatedUserData);

    try {
      await setUserAuthorization(updatedUserData[index]);
    } catch (error) {
      console.error("Error updating user authorization:", error);
    }
  };

  const handleAdminPrivilegeChange = async (index: number) => {
    const updatedUserData = [...userData];
    updatedUserData[index].admin_privilege = updatedUserData[index].admin_privilege === "Yes" ? "No" : "Yes";
    setUserData(updatedUserData);

    try {
      await setUserAuthorization(updatedUserData[index]);
      console.log(updatedUserData[index]);
    } catch (error) {
      console.error("Error updating admin privilege:", error);
    }
  };

  return (
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px", marginBottom: "20px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Typography color="text.primary">Users</Typography>
      </Breadcrumbs>
      <h1>Users</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>User</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Authorization</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Admin privilege</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Authorization</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Admin Privilege</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.authorization}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.admin_privilege}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Switch checked={item.authorization === "Yes"} onChange={() => handleAuthorizationChange(index)} name="authorization" color="primary" />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Switch checked={item.admin_privilege === "Yes"} onChange={() => handleAdminPrivilegeChange(index)} name="admin_privilege" color="primary" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default ManageUser;
