import { CURRENT_USER_ROLES, RESET_USER, CURRENT_USER } from "../constants";

const INITIAL_STATE = {
  role: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_USER_ROLES:
      return { ...state, role: action.payload };
    case CURRENT_USER:
      return { ...state, ...action.payload.user };
    case RESET_USER:
      return { ...state, role: [] };
    default:
      return state;
  }
};
