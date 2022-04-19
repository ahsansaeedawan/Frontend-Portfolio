import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { USER_LOGOUT } from "../constants/messages";
// Reducers
import GatewaysReducer from "./gatewaysReducer";
import AppSettingsReducer from "./appSettingsReducer";
import UserReducer from "./userReducer";
import OrganizationsReducer from "./organizationsReducer";
import OrganizationUsersReducer from "./organizationUsersReducer";
import AppLoadingReducer from "./appLoadingReducer";
import InsightsReducer from "./insightsReducer";
import ResponseUnitsReducer from "./responseUnitsReducer";
import HistoryReducer from "./historyReducer";
import callWidgetReducer from "./voipCallReducer";
import notificationReducer from "./notificationReducer";
import transferAlarmReducer from "./transferAlarmReducer";

const appReducer = combineReducers({
  gateways: GatewaysReducer,
  appSetting: AppSettingsReducer,
  user: UserReducer,
  organizations: OrganizationsReducer,
  orgUsers: OrganizationUsersReducer,
  appLoading: AppLoadingReducer,
  insights: InsightsReducer,
  responseUnits: ResponseUnitsReducer,
  history: HistoryReducer,
  callWidgetReducer,
  transferAlarmReducer,
  notification: notificationReducer
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
