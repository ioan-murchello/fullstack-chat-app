import axios from "axios";

const axiosInstance = axios.create({

  baseURL:
    // @ts-ignore
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, //* send cookies with every request
});

export default axiosInstance;
