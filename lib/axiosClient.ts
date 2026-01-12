import axios from "axios";

// Get API URL from environment variable (set at build time for Next.js)

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.pexifly.com/api";

// Debug log to verify the API URL (remove in production if needed)
if (typeof window !== "undefined") {
  console.log("API Base URL:", apiUrl);
}

const axiosClient = axios.create({
  baseURL: apiUrl,
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
export default axiosClient;
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


