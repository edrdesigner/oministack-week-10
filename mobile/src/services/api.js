import axios from "axios";

// change to your ip at baseURL
const api = axios.create({
  baseURL: "http://192.168.0.7:3333"
});

export default api;
