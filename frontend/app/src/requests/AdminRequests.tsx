import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000";

export const getDevicesData = async () => {
  const token = Cookies.get("access_token");
  const response = await axios.get(`${API_URL}/admin/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUsers = async () => {
  const token = Cookies.get("access_token");
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const setUserAuthorization = async (user: any) => {
  const token = Cookies.get("access_token");
  const response = await axios.post(`${API_URL}/admin/setauthorization`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addDevice = async (deviceData: { device: string }) => {
  const token = Cookies.get("access_token");
  const response = await axios.post(`${API_URL}/admin/addevice`, deviceData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const addConnection = async (data : {email: any, device: any}) => {
  const token = Cookies.get("access_token");
  const response = await axios.post(`${API_URL}/admin/addconnection`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const getUserDevices = async () => {
  const token = Cookies.get("access_token");
  const response = await axios.get(`${API_URL}/admin/userdevices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserDevicesList = async (email: string) => {
  const token = Cookies.get("access_token");
  const response = await axios.post(`${API_URL}/admin/userdeviceslist`, { email }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
