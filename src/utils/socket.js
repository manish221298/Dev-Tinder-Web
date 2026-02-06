import { io } from "socket.io-client";
import { baseUrl } from "./constants";

export const createSocketConnection = () => {
  return io(baseUrl);
};
