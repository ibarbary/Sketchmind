import axios from "axios";

const apiAuth = axios.create({
  baseURL: "https://sketchmind-server.vercel.app/",
  withCredentials: true,
});

export default apiAuth;
