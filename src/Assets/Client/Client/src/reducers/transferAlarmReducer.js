import {
    RESPONSE_UNIT_TRANSFER_REQUEST,
} from "../constants";

export const INITIAL_STATE = {
    transferRequestNotifications: {},
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESPONSE_UNIT_TRANSFER_REQUEST:
            return { ...state, transferRequestNotifications: action.payload };
        default:
            return state;
    }
};
