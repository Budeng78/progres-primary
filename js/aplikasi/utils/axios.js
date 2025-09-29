// utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.102:81",
  withCredentials: true, // penting agar cookie dikirim
});

export default instance;
