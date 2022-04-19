// this service should load after login any user
// var socketServerUrl = 'https://sadmin.goabode.com';
import {SOCKET_AUTHENTICATED,SOCKET_AUTHENTICATION,SOCKET_CONNECT,SOCKET_ALARMS} from "./constants/socket";
const socketServerUrl = '';
const reconnectionDelay = 10000;
const reconnectionDelayMax = 10000;
const socket = io.connect(socketServerUrl, {
  'forceNew': true,
  'reconnection': true,
  'reconnectionAttempts': Infinity,
  'reconnectionDelay': reconnectionDelay,
  'reconnectionDelayMax': reconnectionDelayMax
});

socket.once(SOCKET_CONNECT, function () {
  socket.emit(SOCKET_AUTHENTICATION, {username: 'userName', password: "password"});
  socket.on(SOCKET_AUTHENTICATED, function () {
    socket.on(SOCKET_ALARMS, (data) => {
      console.log("listen event from room [alarms] from du server-->", data);
    });
    console.log('User is authenticated');
  });
});

export default socket;
