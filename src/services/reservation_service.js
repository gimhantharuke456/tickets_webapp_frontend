import axios from "axios";
import { baseUrl } from "../constants";

const apiEndpoint = `${baseUrl}/api/reservation`;

export const getReservations = async () => {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.error("Error getting reservations:", error);
    throw error;
  }
};

export const getReservationById = async (id) => {
  try {
    const response = await axios.get(`${apiEndpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting reservation with ID ${id}:`, error);
    throw error;
  }
};
export const getReservationsByTrainId = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/train/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting reservation with ID ${id}:`, error);
    throw error;
  }
};

export const createReservation = async (reservation) => {
  try {
    const currentDate = new Date();
    const reservationDate = new Date(reservation.reservationDate);
    const daysDifference = Math.floor(
      (reservationDate - currentDate) / (24 * 60 * 60 * 1000)
    );

    if (daysDifference >= 0 && daysDifference <= 30) {
      const response = await axios.post(apiEndpoint, reservation);
      return response.data;
    } else {
      throw new Error("Invalid reservation date or exceeds 30 days limit.");
    }
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

export const updateReservation = async (id, newReservation) => {
  try {
    // Additional logic for updating reservations
    const currentDate = new Date();
    const reservationDate = new Date(newReservation.reservationDate);
    const daysDifference = Math.floor(
      (reservationDate - currentDate) / (24 * 60 * 60 * 1000)
    );

    // Check if the update is at least 5 days before the reservation date
    if (daysDifference >= 5) {
      const response = await axios.put(`${apiEndpoint}/${id}`, newReservation);
      return response.data;
    } else {
      throw new Error(
        "Cannot update reservation within 5 days of the reservation date."
      );
    }
  } catch (error) {
    console.error(`Error updating reservation with ID ${id}:`, error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    // Additional logic for canceling reservations
    const reservation = await getReservationById(id);
    const currentDate = new Date();
    const reservationDate = new Date(reservation.reservationDate);
    const daysDifference = Math.floor(
      (reservationDate - currentDate) / (24 * 60 * 60 * 1000)
    );

    // Check if the cancellation is at least 5 days before the reservation date
    if (daysDifference >= 5) {
      const response = await axios.delete(`${apiEndpoint}/${id}`);
      return response.data;
    } else {
      throw new Error(
        "Cannot cancel reservation within 5 days of the reservation date."
      );
    }
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    throw error;
  }
};
