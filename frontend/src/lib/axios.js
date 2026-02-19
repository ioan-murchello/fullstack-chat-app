import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    // @ts-ignore
    // @ts-expect-error
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, //* send cookies with every request
});

export default axiosInstance;
