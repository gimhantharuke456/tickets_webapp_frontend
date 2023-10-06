import axios from "axios";
import { baseUrl } from "../constants";
import { getReservationsByTrainId } from "./reservation_service";

const apiEndpoint = `${baseUrl}/api/train`;

export const getTrains = async () => {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.error("Error getting trains:", error);
    throw error;
  }
};

export const getTrainById = async (id) => {
  try {
    const response = await axios.get(`${apiEndpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting train with ID ${id}:`, error);
    throw error;
  }
};

export const createTrain = async (train) => {
  try {
    const response = await axios.post(apiEndpoint, train);
    return response.data;
  } catch (error) {
    console.error("Error creating train:", error);
    throw error;
  }
};

export const updateTrain = async (id, newTrain) => {
  try {
    // Check if there are reservations for the train
    const reservations = await getReservationsByTrainId(id);
    if (reservations.length > 0) {
      throw new Error("Cannot update train with existing reservations.");
    }

    const response = await axios.put(`${apiEndpoint}/${id}`, newTrain);
    return response.data;
  } catch (error) {
    console.error(`Error updating train with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTrain = async (id) => {
  try {
    const reservations = await getReservationsByTrainId(id);
    console.log(reservations);
    if (reservations.length > 0) {
      throw new Error("Cannot delete train with existing reservations.");
    }

    const response = await axios.delete(`${apiEndpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting train with ID ${id}:`, error);
    throw error;
  }
};
