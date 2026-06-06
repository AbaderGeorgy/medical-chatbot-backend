import axiosClient, { withRetry } from "./axiosClient";

export const authApi = {
  login: async (email, password) => {
    const response = await withRetry(() =>
      axiosClient.post("/api/Auth/login", { email, password })
    );
    return response.data;
  },

  register: async (userData) => {
    const response = await withRetry(() =>
      axiosClient.post("/api/Auth/register", userData)
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authApi;
