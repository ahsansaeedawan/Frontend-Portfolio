import { FETCHED_RESPONSE_UNIT_HISTORY } from "../constants";

const INITIAL_STATE = {
    responseUnits: [],
    metadata: []
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case FETCHED_RESPONSE_UNIT_HISTORY:
            return { ...state, responseUnits: action.payload.responseUnits, metadata: action.payload.metadata };
        default:
            return state;
    }

};