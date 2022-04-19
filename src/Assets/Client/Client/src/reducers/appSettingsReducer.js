import {
  OPEN_DASHBOARD_MENU,
  TOGGLE_DASHBOARD_MENU_OPEN,
  OPEN_GATEWAY_DETAILS,
  TOGGLE_GATEWAY_DETAILS_VIEW,
  CLOSE_GATEWAY_DETAILS,
  CLOSE_DASHBOARD_MENU,
  SHOW_GATEWAY_MAP,
  SELECT_ALL_GATEWAY_TAB,
  SELECT_GATEWAY_TAB,
} from "../constants";

const INITIAL_STATE = {
  gatewayDetailInitialized: false,
  dashboardMenuOpen: false,
  isGatewayDetailVisible: false,
  allGatewayOnMap: true,
  disableAssignOperation: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_DASHBOARD_MENU:
      return { ...state, dashboardMenuOpen: true };
    case CLOSE_DASHBOARD_MENU:
      return {
        ...state,
        dashboardMenuOpen: false,
        gatewayDetailInitialized: false,
      };
    case TOGGLE_DASHBOARD_MENU_OPEN:
      return {
        ...state,
        gatewayDetailInitialized: false,
        isGatewayDetailVisible: false,
        dashboardMenuOpen: !state.dashboardMenuOpen
      };
    case OPEN_GATEWAY_DETAILS:
      return {
        ...state,
        isGatewayDetailVisible: true,
        gatewayDetailInitialized: true,
      };
    case TOGGLE_GATEWAY_DETAILS_VIEW:
      return {
        ...state,
        isGatewayDetailVisible: !state.isGatewayDetailVisible
      };
    case CLOSE_GATEWAY_DETAILS:
      return { ...state, isGatewayDetailVisible: false };
    case SHOW_GATEWAY_MAP:
      return {
        ...state, allGatewayOnMap: !state.allGatewayOnMap
      };
    case SELECT_ALL_GATEWAY_TAB:
      return {
        ...state, disableAssignOperation: true
      };
    case SELECT_GATEWAY_TAB:
      return {
        ...state, disableAssignOperation: false
      };
    default:
      return state;
  }
};
