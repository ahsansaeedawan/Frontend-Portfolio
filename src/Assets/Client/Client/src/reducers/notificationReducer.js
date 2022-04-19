import {
    INCIDENT_NOTIFICATION,
    SET_NOTIFICATIONS,
    SET_METADATA,
    SET_ERROR,
    CLEAR_ERROR
} from "../constants";

export const INITIAL_STATE = {
    slaNotification: [],
    notifications: [],
    metaData: { total: null, page: "1" },
    error: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INCIDENT_NOTIFICATION:
            return { ...state, slaNotification: action.payload }
        case SET_NOTIFICATIONS:
            return { ...state, notifications: action.payload.notifications };
        case SET_METADATA:
            return { ...state, metaData: action.payload.metaData };
        case SET_ERROR:
            return { ...state, error: true };
        case CLEAR_ERROR:
            return { ...state, error: false };
        default:
            return state;
    }
};
