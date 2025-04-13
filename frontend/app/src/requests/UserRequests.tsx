import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000";

export const getSensorData = async () => {
  const token = Cookies.get("access_token");
  const response = await axios.get(`${API_URL}/user/sensordata`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
