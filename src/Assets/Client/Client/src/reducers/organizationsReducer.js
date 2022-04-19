import {
  ALL_ORGANIZATIONS,
  ACTIVE_ORGANIZATIONS,
  INACTIVE_ORGANIZATIONS,
  RESET_ACTIVE_ORGANIZATIONS,
  RESET_ALL_ORGANIZATIONS,
  RESET_INACTIVE_ORGANIZATIONS,
  ORGANIZATIONS_COUNT
} from "../constants";

const INITIAL_STATE = {
  count: { active: 0, inactive: 0, total: 0 },
  all: [],
  active: [],
  inactive: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALL_ORGANIZATIONS:
      return { ...state, all: action.payload.organizations };
    case RESET_ALL_ORGANIZATIONS:
      return { ...state, all: [] };
    case ACTIVE_ORGANIZATIONS:
      return { ...state, active: action.payload.organizations };
    case RESET_ACTIVE_ORGANIZATIONS:
      return { ...state, active: [] };
    case INACTIVE_ORGANIZATIONS:
      return { ...state, inactive: action.payload.organizations };
    case RESET_INACTIVE_ORGANIZATIONS:
      return { ...state, inactive: [] };
    case ORGANIZATIONS_COUNT:
      return { ...state, count: action.payload.count };
    default:
      return state;
  }
};
