import socketIOClient from "socket.io-client";
import { SOCKET_ENDPOINT, SOCKET_PATH } from "../config/keys.config";
import {
  SOCKET_CONNECT,
  SOCKET_AUTHENTICATION,
  SOCKET_AUTHENTICATED,
  SOCKET_UNAUTHORIZED,
} from "../constants/socket";

export const SecureSocketLogin = (token) =>
  new Promise((resolve, reject) => {
    const socket = socketIOClient(SOCKET_ENDPOINT, {
      path: SOCKET_PATH,
    });
    socket.once(SOCKET_CONNECT, function () {
      socket.emit(SOCKET_AUTHENTICATION, {
        token,
      });

      socket.on(SOCKET_AUTHENTICATED, function () {
        resolve(socket);
      });

      socket.on(SOCKET_UNAUTHORIZED, (reason) => {
        reject({ connected: false, reason });
        socket.disconnect();
      });
    });
  });

export const VerifyUserAndConnectToWs = async () => {
  if (window.localStorage.getItem("token")) {
    try {
      const socket = await SecureSocketLogin(
        window.localStorage.getItem("token")
      );
      window.socket = socket;
      console.log("connection to socket established");
    } catch (e) {
      // remove the token and redirect the user to login
      window.localStorage.removeItem("token");
      window.location.replace("/");
    }
  }
};
