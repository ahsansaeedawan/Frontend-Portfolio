import { FETCHED_ORGANIZATION_USERS } from "../constants";

const INITIAL_STATE = {
  count: { active: 0, inactive: 0, total: 0 },
  users: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHED_ORGANIZATION_USERS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
