export const baseUrl = "http://localhost:4001";

export const getToken = () => {
  return localStorage.getItem("token");
};
