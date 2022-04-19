import {
  OPEN_DASHBOARD_MENU,
  TOGGLE_DASHBOARD_MENU_OPEN,
  OPEN_GATEWAY_DETAILS,
  TOGGLE_GATEWAY_DETAILS_VIEW,
  CLOSE_GATEWAY_DETAILS,
  FETCHED_GATEWAYS,
  ALARM_STATUS_UPDATE,
  CLOSE_DASHBOARD_MENU,
  FETCHED_RESPONSE_UNTIS,
  RESP_UNIT_LOCATION_UPDATE,
  RESP_UNIT_STATUS_UPDATE,
  RESP_UNIT_STATUS_CHANGE_REQUEST,
  RESP_UNIT_ASSIGNED,
  RESP_UNIT_UNASSIGNED,
  RESP_UNIT_CLOSE_ALARM,
  GATEWAY_ASSIGN_STATUS,
  GATEWAY_STATUS_UPDATE,
  ADD_NEW_GATEWAY,
  GATEWAY_ADDON_UPDATE,
  GATEWAY_SUBSCRIPTION_UPDATE,
  RESP_UNIT_ARRIVED,
  GATEWAY_DATA_UPDATE,
  SHOW_GATEWAY_MAP,
  SELECT_ALL_GATEWAY_TAB,
  SELECT_GATEWAY_TAB,
  INCIDENT_NOTIFICATION,
  RESPONSE_UNIT_TRANSFER_REQUEST,
  GATEWAY_CALLINPROGRESS
} from "../constants";
import {
  SOCKET_REFRESH_DASHBOARD,
  SOCKET_ALARM_STATUS_UPDATE,
  SOCKET_UPDATE_LOCATION,
  SOCKET_UNIT_ONLINE_STATUS,
  SOCKET_UNIT_STATUS_CHANGE_REQUEST,
  SOCKET_ALARM_ASSIGNED,
  SOCKET_ALARM_UNASSIGNED,
  SOCKET_GATEWAY_ASSIGNED,
  SOCKET_GATEWAY_UNASSIGNED,
  SOCKET_ALARM_CLOSE,
  SOCKET_GATEWAY_ONLINE_STATUS,
  SOCKET_ADDON_UPDATE,
  SOCKET_SUBSCRIPTION_UPDATE,
  SOCKET_RESP_UNIT_ARRIVED,
  SOCKET_GATEWAY_DATA_UPDATE,
  SOCKET_NEW_RESPONSEUNIT_LOGIN,
  SOCKET_SLA_VIOLATION,
  SOCKET_TRANSFER_ALARM,
  SOCKET_RESP_UNIT_LOGOUT,
  SOCKET_CALL_IN_PROGRESS,
  PAYLOAD_ARE,

} from "../constants/socket";
import {
  fetchGateways,
  acknowledgeIncident,
  verifyIncident as verifyIncidentApi,
  gatewayAction,
  fetchResponseUnits,
} from "../api";
import { info, error, success } from "../components/toast";
import {
  NEAREAST_RESPONSEUNIT_ASSIGNED,
  ALARM_ASSIGN_FAILED,
} from "../constants/status";
import DuressAlert from "../assets/sounds/sosDuressAlarmAlert.mp3";
import { alarmAlert } from "../utils/commonUtil";

// Helper
const fetchAndUpdateGateways = async (dispatch) => {
  try {
    const { data } = await fetchGateways();
    const gateways = data.data.gateways.filter((gateway) => {
      if (!gateway) {
        return false;
      } else {
        return true;
      }
    });
    dispatch({
      type: FETCHED_GATEWAYS,
      payload: { gateways },
    });
  } catch (e) {
    console.log(e);
  }
};

export const openDashboardMenu = () => {
  return {
    type: OPEN_DASHBOARD_MENU,
  };
};

export const closeDashboardMenu = () => {
  return {
    type: CLOSE_DASHBOARD_MENU,
  };
};

export const toggleDashboardMenuOpen = () => {
  return {
    type: TOGGLE_DASHBOARD_MENU_OPEN,
  };
};

export const openGatewayDetails = () => {
  return {
    type: OPEN_GATEWAY_DETAILS,
  };
};

export const toggleGatewayDetailsView = () => {
  return {
    type: TOGGLE_GATEWAY_DETAILS_VIEW,
  };
};

export const closeGatewayDetails = () => {
  return {
    type: CLOSE_GATEWAY_DETAILS,
  };
};

export const showAllGatewayOnMap = () => {
  return {
    type: SHOW_GATEWAY_MAP,
  }
}

export const disableGatewayAssignOperation = () => {
  return {
    type: SELECT_ALL_GATEWAY_TAB
  }
}

export const selectGatewayTab = () => {
  return {
    type: SELECT_GATEWAY_TAB
  }
}



export const fetchAllGateways = () => (dispatch) =>
  fetchAndUpdateGateways(dispatch);


export const listenCallInProgress = (socket) => (dispatch) => {
  socket.on(SOCKET_CALL_IN_PROGRESS, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: GATEWAY_CALLINPROGRESS,
      payload
    })
  });
}


export const listenResponseUnitLogout = (socket) => (dispatch) => {
  socket.on(SOCKET_RESP_UNIT_LOGOUT, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    fetchResponseUnits().then(({ data }) => {
      dispatch({
        type: FETCHED_RESPONSE_UNTIS,
        payload: { responseUnits: data.data.units },
      });
    })
  })
}



export const listenNewResponseUnitOnline = (socket) => (dispatch) => {
  socket.on(SOCKET_NEW_RESPONSEUNIT_LOGIN, (payload) => {
    console.log(PAYLOAD_ARE, payload)
    fetchResponseUnits().then(({ data }) => {
      dispatch({
        type: FETCHED_RESPONSE_UNTIS,
        payload: { responseUnits: data.data.units },
      });
    });
  })
};


export const listenRefreshDashboard = (socket) => (dispatch) => {
  socket.on(SOCKET_REFRESH_DASHBOARD, (payload) => {
    fetchAndUpdateGateways(dispatch);
  });
};

export const listenGatewayOnlineStatus = (socket) => (dispatch) => {
  socket.on(SOCKET_GATEWAY_ONLINE_STATUS, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    // if this gateway is getting initialized in the system for the first time
    if (payload.addGateway) {
      dispatch({
        type: ADD_NEW_GATEWAY,
        payload,
      });
    }

    //if the gateway already exists in the system but online/offline status is updated
    else {
      if (payload.online) success(`${payload.mac} gateway is ${payload.online === "1" ? "Online" : "Offline"}`)
      dispatch({
        type: GATEWAY_STATUS_UPDATE,
        payload,
      });
    }
  });
};

export const listenGatewayDataUpdate = (socket) => (dispatch) => {
  socket.on(SOCKET_GATEWAY_DATA_UPDATE, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: GATEWAY_DATA_UPDATE,
      payload
    });
  });
};

export const listenGatewaySubscriptionUpdate = (socket) => (dispatch) => {
  socket.on(SOCKET_SUBSCRIPTION_UPDATE, (payload) => {
    console.log(PAYLOAD_ARE, payload);

    dispatch({
      type: GATEWAY_SUBSCRIPTION_UPDATE,
      payload
    });
  });
};

export const listenGatewayAddonUpdate = (socket) => (dispatch) => {
  socket.on(SOCKET_ADDON_UPDATE, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: GATEWAY_ADDON_UPDATE,
      payload,
    });
  });
};

export const fetchAllResponseUnits = () => (dispatch) =>
  fetchResponseUnits().then(({ data }) => {
    dispatch({
      type: FETCHED_RESPONSE_UNTIS,
      payload: { responseUnits: data.data.units },
    });
  });

export const listenGatewayAssigned = (socket) => (dispatch) => {
  socket.on(SOCKET_GATEWAY_ASSIGNED, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: GATEWAY_ASSIGN_STATUS,
      payload,
    });

  });
};

export const listenGatewayUnassigned = (socket) => (dispatch) => {
  socket.on(SOCKET_GATEWAY_UNASSIGNED, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: GATEWAY_ASSIGN_STATUS,
      payload,
    });

  });
};

export const listenSlaBreach = (socket) => (dispatch) => {
  socket.on(SOCKET_SLA_VIOLATION, (payload) => {
    console.log(PAYLOAD_ARE, payload)
    info(`SLA breach of ${payload.mac} on ${payload.prevAction} action`)
    dispatch({
      type: INCIDENT_NOTIFICATION,
      payload
    })
  });
}

export const listentransferAlertSocket = (socket) => (dispatch) => {
  socket.on(SOCKET_TRANSFER_ALARM, (payload) => {
    console.log("SOCKET_TRANSFER_ALARM", payload)
    // info(`Transfer Alarm request on ${payload.macAddress} by ${payload.responseUnitName}`)
    dispatch({
      type: RESPONSE_UNIT_TRANSFER_REQUEST,
      payload
    })
  });
}

export const listenGatewayStatusUpdates = (socket) => (dispatch) => {
  socket.on(SOCKET_ALARM_STATUS_UPDATE, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    if (payload.alarmType === "Duress Alert") {
      info("Duress Alert is triggred");
      alarmAlert(DuressAlert);
    }
    if (payload.status) {
      gatewayStatusUpdateAlert(payload.status);
      dispatch({
        type: ALARM_STATUS_UPDATE,
        payload,
      });
    }
  });
};

export const listenAlarmClose = (socket) => (dispatch) => {
  socket.on(SOCKET_ALARM_CLOSE, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    gatewayStatusUpdateAlert("close");
    dispatch({
      type: RESP_UNIT_CLOSE_ALARM,
      payload: { mac: payload.mac },
    });
    dispatch({
      type: ALARM_STATUS_UPDATE,
      payload,
    });
  });
};

export const listenRespUnitLocationUpdate = (socket) => (dispatch) => {
  socket.on(SOCKET_UPDATE_LOCATION, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: RESP_UNIT_LOCATION_UPDATE,
      payload,
    });
  });
};

export const listenRespUnitStatusUpdate = (socket) => (dispatch) => {
  socket.on(SOCKET_UNIT_ONLINE_STATUS, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: RESP_UNIT_STATUS_UPDATE,
      payload,
    });
  });
};

export const listenRespUnitStatusChangeRequest = (socket) => (dispatch) => {
  socket.on(SOCKET_UNIT_STATUS_CHANGE_REQUEST, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    info("Response Unit request for offline");
    dispatch({
      type: RESP_UNIT_STATUS_CHANGE_REQUEST,
      payload,
    });
  });
};

export const listenAlarmAssigned = (socket) => (dispatch) => {
  socket.on(SOCKET_ALARM_ASSIGNED, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: RESP_UNIT_ASSIGNED,
      payload,
    });

  });
};

export const listenResponseUnitArrived = (socket) => (dispatch) => {
  socket.on(SOCKET_RESP_UNIT_ARRIVED, (payload) => {
    dispatch({
      type: RESP_UNIT_ARRIVED,
      payload: payload.unitId,
    });
  });
};


export const listenAlarmUnassigned = (socket) => (dispatch) => {
  socket.on(SOCKET_ALARM_UNASSIGNED, (payload) => {
    console.log(PAYLOAD_ARE, payload);
    dispatch({
      type: RESP_UNIT_UNASSIGNED,
      payload: payload.unitId,
    });

  });
};

export const actionIncident = ({ macAddress, action, comments }) => async (
  dispatch
) => {
  try {
    const { data } = await gatewayAction({ macAddress, action, comments });
    if (data.action && data.action === "acknowledged") {
      if (data.assignRespUnit) {
        success(NEAREAST_RESPONSEUNIT_ASSIGNED);
      } else {
        error(ALARM_ASSIGN_FAILED);
      }
    }
    if (action === "comment") {
      success("Comment has been added.");
    }
  } catch (e) {
    let apiError = e.message;

    if (
      e.response &&
      e.response.data &&
      e.response.data.errors &&
      e.response.data.errors.length > 0
    ) {
      apiError = e.response.data.errors[0].message;
    }
    error(apiError);
  }
};

export const incidentAcknowledged = (gatewayMac) => async (dispatch) => {
  try {
    await acknowledgeIncident(gatewayMac);
  } catch (e) {
    console.log(e);
  }
};

export const verifyIncident = (gatewayMac) => async (dispatch) => {
  try {
    await verifyIncidentApi(gatewayMac);
  } catch (e) {
    console.log(e);
  }
};

function gatewayStatusUpdateAlert(status) {
  if (status === "incident") {
    info("Alarm has been Triggred");
  } else if (status === "verified") {
    info("Alarm has been Verified");
  } else if (status === "acknowledged") {
    info("Alarm has been Acknowledged ");
  }
  if (status === "close") {
    info("Alarm has been closed.");
  }
}
