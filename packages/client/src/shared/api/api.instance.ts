import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

instance.interceptors.response.use((response) => {
  if (response.status === 401) {
    instance.get("/auth/refresh").catch(() => {
      window.location.href = "/login";
    });
  }
  return response;
});
