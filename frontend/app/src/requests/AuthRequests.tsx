import axios from "axios";

const API_URL = "http://localhost:8000";

export const signUp = async (email: string, username: string, password: string, role: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    email,
    username,
    password,
    role,
  });
  return response.data;
};

export const signIn = async (email: string, password: string, role: string) => {
  const response = await axios.post(`${API_URL}/auth/signin`, {
    email,
    password,
    role,
  });
  return response.data;
};
