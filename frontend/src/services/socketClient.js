import { io } from "socket.io-client";

let socket;

export const initIO = () => {
  if (!socket) socket = io("http://localhost:5000");
  return socket;
};

export const getIO = () => {
  if (!socket) initIO();
  return socket;
};
