import React from "react";
import { Provider } from "react-redux";
import { initAxios } from "./config/axios.config";
import ReactDOM from "react-dom";
import App from "./views/app";
import store from "./reducers/store";
import * as serviceWorker from "./serviceWorker";
import "toasted-notes/src/styles.css";
import "./assets/css/bootstrap4-wrapper.min.css";

import "./assets/css/react-sliding-pane.css";
import "./index.css";

function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
// Initialize Axios Request / Response Interceptors etc
initAxios();
ReactDOM.render(<AppContainer />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
