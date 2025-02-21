// export const baseUrl = "http://localhost:4001"; // local url

export const baseUrl = "/api";

export const getToken = () => {
  return localStorage.getItem("token");
};
