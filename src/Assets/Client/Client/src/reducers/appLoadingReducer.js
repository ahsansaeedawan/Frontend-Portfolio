import { SET_APP_LOADING } from "../constants";

const INITIAL_STATE = {
  isLoading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_APP_LOADING:
      return { ...state, isLoading: action.payload.isLoading };
    default:
      return state;
  }
};
