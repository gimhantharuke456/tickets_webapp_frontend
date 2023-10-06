import axios from "axios";

import { baseUrl } from "../constants";

export const signInUser = async (username, password) => {
  try {
    const response = await axios.post(`${baseUrl}/api/user/signin`, {
      nic: username,
      password,
    });

    if (response.data) {
      const { id, nic } = response.data;

      localStorage.setItem("userId", id);
      localStorage.setItem("userNic", nic);

      return { id, nic };
    } else {
      null;
    }
  } catch (error) {
    throw error;
  }
};
