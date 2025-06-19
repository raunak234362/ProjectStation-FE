// src/socket.js
import { io } from "socket.io-client";
const baseURL= import.meta.env.VITE_BASE_URL;
const socket = io(baseURL, {
  transports: ["websocket"],
  autoConnect:false,
  // reconnectionAttempts: 5,
});

export function connectSocket(userId) {
  if (!userId) return;
  socket.auth = { userId };
  socket.connect();
}

export default socket;
