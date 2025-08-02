import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
});
console.log("BASE URL:", import.meta.env.VITE_SERVER_URI);

export default API;
