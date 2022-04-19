import { SET_VOIP_CALL ,GATEWAY_CALLINPROGRESS} from "../constants";

const INITIAL_STATE = {
  showCallWidget: false,
  callInProgressMac: {},

};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case SET_VOIP_CALL:
      return { ...state, showCallWidget: action.payload.isCalling };


    case GATEWAY_CALLINPROGRESS:
      return { ...state, callInProgressMac: action.payload }


    default:
      return state;
  }
};
