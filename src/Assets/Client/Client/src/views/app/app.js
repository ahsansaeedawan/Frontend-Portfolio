import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import { LoadScript } from "@react-google-maps/api";
import { AppRouter } from "../../routes/app.router";
import {
  GOOGLE_MAPS_API_KEY,
  SOCKET_ENDPOINT,
  SOCKET_PATH,
} from "../../config/keys.config";
import { fetchAllGateways } from "../../actions/dashboardActions";
import { SocketContext, UserContext } from "../../context";
import { loadUserFromToken } from "../../actions/appActions";
import { LoadingMask } from "../../components/loadingMask";
import {
  SOCKET_CONNECT,
  SOCKET_AUTHENTICATION,
  SOCKET_AUTHENTICATED,
  SOCKET_UNAUTHORIZED,
  SOCKET_RECONNECT,
} from "../../constants/socket";

const libs = ["visualization", "places"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
    };
    this.socketConnectionInterval = null;
  }

  secureSocketConnectInterval = () => {
    this.socketConnectionInterval = setInterval(this.secureSocketConnect, 1000);
  };

  secureSocketConnect = () => {
    if (this.props.user.role.length === 0) return;
    const token = window.localStorage.getItem("token");
    if (token) {
      clearInterval(this.socketConnectionInterval);
      const socket = socketIOClient(SOCKET_ENDPOINT, {
        path: SOCKET_PATH,
      });

      socket.once(SOCKET_CONNECT, () => {
          socket.emit(SOCKET_AUTHENTICATION, {
            token,
          });

        socket.on(SOCKET_AUTHENTICATED, () => {
          this.setState({ socket });
        });

        socket.on(SOCKET_UNAUTHORIZED, () => {
          window.localStorage.removeItem("token");
          socket.disconnect();
          this.setState({ socket: null }, this.secureSocketConnectInterval);
        });
      });

      socket.on(SOCKET_RECONNECT, () => {
        socket.emit(SOCKET_AUTHENTICATION, {
          token,
        });
        this.setState({ socket });
        this.props.fetchAllGateways();
      });
    }
  };

  componentDidMount() {
    this.secureSocketConnectInterval();
    console.log("__",process.env.REACT_APP_TYPE);
  }

  componentWillMount() {
    this.props.loadUserFromToken();
  }

  componentWillUnmount() {
    if (this.state.socket) {
      this.state.socket.disconnect();
    }
    clearInterval(this.socketConnectionInterval);
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingMask style={{ backgroundColor: "#000000" }} />;
    } else {
      return (
        <SocketContext.Provider value={this.state.socket}>
          <UserContext.Provider value={this.props.user}>
            <LoadScript
              id="google-map-script-loader"
              googleMapsApiKey={GOOGLE_MAPS_API_KEY}
              libraries={libs}
            >
              <AppRouter />
            </LoadScript>
          </UserContext.Provider>
        </SocketContext.Provider>
      );
    }
  }
}

const mapStateToProps = ({ user, appLoading }) => ({
  user,
  isLoading: appLoading.isLoading,
});

export default connect(mapStateToProps, {
  fetchAllGateways,
  loadUserFromToken,
})(App);
