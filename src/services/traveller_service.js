import axios from "axios";
import { baseUrl } from "../constants";

const apiEndpoint = `${baseUrl}/api/Traveler`;

export const getTravellers = async () => {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.error("Error getting travellers:", error);
    throw error;
  }
};

export const getTravellerById = async (id) => {
  try {
    const response = await axios.get(`${apiEndpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting traveller with ID ${id}:`, error);
    throw error;
  }
};

export const createTraveller = async (traveller) => {
  try {
    const response = await axios.post(apiEndpoint, traveller);
    return response.data;
  } catch (error) {
    console.error("Error creating traveller:", error);
    throw error;
  }
};

export const updateTraveller = async (id, newTraveller) => {
  try {
    const response = await axios.put(`${apiEndpoint}/${id}`, newTraveller);
    return response.data;
  } catch (error) {
    console.error(`Error updating traveller with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTraveller = async (id) => {
  try {
    const response = await axios.delete(`${apiEndpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting traveller with ID ${id}:`, error);
    throw error;
  }
};
