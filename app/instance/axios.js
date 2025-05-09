const { BASE_URL } = require("@/environment");
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});



axiosInstance.interceptors.request.use(
  function (config) {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


export default axiosInstance;