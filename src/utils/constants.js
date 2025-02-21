// export const baseUrl = "http://localhost:4001"; // local url

export const baseUrl = "http://51.20.122.54/api";
// http://51.20.122.54/api/user/signin

export const getToken = () => {
  return localStorage.getItem("token");
};
