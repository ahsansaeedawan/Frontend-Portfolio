import {
  FETCHED_RESPONSE_UNTIS,
  RESP_UNIT_LOCATION_UPDATE,
  RESP_UNIT_STATUS_UPDATE,
  RESP_UNIT_STATUS_CHANGE_REQUEST,
  RESP_UNIT_ASSIGNED,
  RESP_UNIT_UNASSIGNED,
  RESP_UNIT_CLOSE_ALARM,
  RESP_UNIT_ARRIVED
} from "../constants";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RESP_UNIT_LOCATION_UPDATE:
      return state.map((unit) => {
        if (unit._id === action.payload.unitId) {
          unit.location.coordinates[0] = action.payload.coordinates.lng;
          unit.location.coordinates[1] = action.payload.coordinates.lat;
        }
        return unit;
      });

    case RESP_UNIT_STATUS_UPDATE:
      return state.map((unit) => {
        if (unit._id === action.payload.unitId) {
          unit.online = action.payload.online;
          unit.request = false;
        }
        return unit;
      });

    case RESP_UNIT_STATUS_CHANGE_REQUEST:
      return state.map((unit) => {
        if (unit._id === action.payload.unitId) {
          unit.request = true;
        }
        return unit;
      });

    case RESP_UNIT_UNASSIGNED:
    case RESP_UNIT_ARRIVED:
      return state.map((unit) => {
        if (unit._id === action.payload) {
          unit.available = true;
          unit.siteDetail = { mac: null, destination: null };
        }

        return unit;

      });
    case RESP_UNIT_ASSIGNED:
      return state.map((unit) => {
        if (unit._id === action.payload.unitId) {
          unit.available = false;
          unit.siteDetail = action.payload.siteDetail;
        }
        return unit;
      });

    case RESP_UNIT_CLOSE_ALARM:
      return state.map((unit) => {
        if (
          unit.siteDetail &&
          unit.siteDetail.mac &&
          unit.siteDetail.mac === action.payload.mac
        ) {
          unit.available = true;
          unit.siteDetail = { mac: null, destination: null };
        }
        return unit;
      });
    case FETCHED_RESPONSE_UNTIS:
      return action.payload.responseUnits;
    default:
      return state;
  }
};
