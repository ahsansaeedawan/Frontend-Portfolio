import {
  FETCHED_GATEWAYS,
  ALARM_STATUS_UPDATE,
  GATEWAY_ASSIGN_STATUS,
  GATEWAY_ASSIGNMENT_COMPLETE,
  GATEWAY_STATUS_UPDATE,
  ADD_NEW_GATEWAY,
  GATEWAY_ADDON_UPDATE,
  GATEWAY_SUBSCRIPTION_UPDATE,
  GATEWAY_DATA_UPDATE
} from "../constants";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case GATEWAY_DATA_UPDATE:
      return state.map((gateway) => {
        if (gateway.macAddress === action.payload.mac) {
          for (let key in action.payload) {
            gateway[key] = action.payload[key];
          }
        }
        return gateway;
      });

    case GATEWAY_SUBSCRIPTION_UPDATE:
      return state.map((gateway) => {
        if (gateway.macAddress === action.payload.mac) {
          gateway.billingStatus.action = action.payload.status;
        }
        return gateway;
      });

    case GATEWAY_ADDON_UPDATE:
      return state.map((gateway) => {
        if (gateway.macAddress === action.payload.mac) {
          gateway.addons = action.payload.addons;
        }
        return gateway;
      });

    case GATEWAY_STATUS_UPDATE:
      return state.map((gateway) => {
        if (gateway.macAddress === action.payload.mac) {
          gateway.online = parseInt(action.payload.online);
          gateway.updatedAt = `${action.payload.timestamp}`;
        }
        return gateway;
      });
    case ALARM_STATUS_UPDATE:
      return state.map((gateway) => {
        const assignedAgent =
          action.payload.status === "idle" || action.payload.status === "armed"
            ? null
            : gateway.assignedAgent;
        if (gateway.macAddress === action.payload.mac) {
          gateway.alarmOrigin = action.payload.alarmOrigin;
          gateway.status = action.payload.status;
          gateway.lastEvent = action.payload.lastEvent;
          gateway.updatedAt = action.payload.updatedAt;
          gateway.assignedAgent = assignedAgent;
          gateway.assignmentComplete = false;
        }
        return gateway;
      });
    case GATEWAY_ASSIGN_STATUS:
      return state.map((gateway) => {
        if (gateway.macAddress === action.payload.mac) {
          gateway.assignedAgent = action.payload.assignedAgent;
        }
        return gateway;
      });
    case GATEWAY_ASSIGNMENT_COMPLETE:
      return state.map((gateway) => {
        if (gateway.macAddress === action.payload.mac) {
          gateway.assignmentComplete = true;
        }
        return gateway;
      });
    case FETCHED_GATEWAYS:
      return action.payload.gateways;
    case ADD_NEW_GATEWAY:
      return [...state, action.payload.gateway];
    default:
      return state;
  }
};
