import { proxy } from "valtio";

const state = proxy({
  users: [],
  error: "",
  isLoading: false,
  travellers: [],
  userId: null,
  userNic: null,
  role: null,
});

export default state;
