import axios from "axios";
import { baseUrl } from "../constants";

export const signInUser = async (username, password) => {
  try {
    const response = await axios.post(`${baseUrl}/api/user/signin`, {
      nic: username,
      password,
    });

    if (response.data) {
      const { id, nic, role } = response.data;

      localStorage.setItem("userId", id);
      localStorage.setItem("userNic", nic);
      localStorage.setItem("role", role);
      return { id, nic };
    } else {
      null;
    }
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/User`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    const response = await axios.post(`${baseUrl}/api/User`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, updatedUser) => {
  try {
    const response = await axios.put(`${baseUrl}/api/User/${id}`, updatedUser);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/User/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
