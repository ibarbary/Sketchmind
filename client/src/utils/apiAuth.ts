import axios from "axios";

const apiAuth = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default apiAuth;
