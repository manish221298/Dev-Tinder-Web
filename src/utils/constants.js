export const baseUrl =
  location.hostname === "localhost"
    ? "http://localhost:4001"
    : "http://51.20.122.54/api";

// export const baseUrl = "http://51.20.122.54/api"; // production url
// http://51.20.122.54/api/user/signin

export const getToken = () => {
  return localStorage.getItem("token");
};
