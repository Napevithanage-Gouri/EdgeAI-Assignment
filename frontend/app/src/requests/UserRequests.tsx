import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000";

export const getUserDevices = async () => {
  const token = Cookies.get("access_token");
  const response = await axios.get(`${API_URL}/user/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserData = async () => {
  const token = Cookies.get("access_token");
  const response = await axios.get(`${API_URL}/user/userdata`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getSensorData = async (device: string | undefined) => {
  const token = Cookies.get("access_token");
  const response = await axios.post(`${API_URL}/user/sensordata`, { device }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getSensorDataAgg = async (device: string | undefined) => {
  const token = Cookies.get("access_token");
  const response = await axios.post(
    `${API_URL}/user/sensordata/aggregate`,
    { device },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const getUserDevicesList = async () => {
  const token = Cookies.get("access_token");
  const response = await axios.get(
    `${API_URL}/user/userdeviceslist`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
