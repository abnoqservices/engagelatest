import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

//  Attach token to every request
axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); //  MUST be "token"

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

//  Auto logout on 401 (important)
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/signin";
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosClient;
