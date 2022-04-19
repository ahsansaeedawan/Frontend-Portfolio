import { FETCHED_INSIGHTS_EVENTS } from "../constants";

const INITIAL_STATE = {
  events: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHED_INSIGHTS_EVENTS:
      return { ...state, events: action.payload.events };
    default:
      return state;
  }
};
