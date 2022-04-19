import {
  FETCHED_ORGANIZATION_USERS,
  FETCHED_INSIGHTS_EVENTS,
  FETCHED_RESPONSE_UNIT_HISTORY
} from "../constants";
import {
  fetchUsers,
  fetchEventsHistory,
  fetchAllUsers as fetchAllUsersApi,
  fetchResponseUnitHistory as fetchResponseUnitHistoryApi
} from "../api";

export const fetchAllUsers = () => dispatch =>
  fetchAllUsersApi().then(({ data }) => {
    dispatch({
      type: FETCHED_ORGANIZATION_USERS,
      payload: {
        count: data.data.count
          ? data.data.count
          : { total: 0, active: 0, inactive: 0 },
        users: data.data.users
      }
    });
  });

export const fetchOrganizationUsers = organizationId => dispatch =>
  fetchUsers(organizationId).then(resp => {
    const { data } = resp;
    if (!data) return;
    dispatch({
      type: FETCHED_ORGANIZATION_USERS,
      payload: {
        count: data.data.count
          ? data.data.count
          : { total: 0, active: 0, inactive: 0 },
        users: data.data.users
      }
    });
  });

export const fetchEvents = ({ date, step, events }) => dispatch => {
  return fetchEventsHistory({ date, step, events }).then(({ data }) => {
    dispatch({
      type: FETCHED_INSIGHTS_EVENTS,
      payload: { events: data.data.gateways }
    });
  });
};

export const fetchResponseUnitHistory = ({ page, sizePerPage, startdate, enddate, search, searchBy }) => dispatch => {
  return fetchResponseUnitHistoryApi({ page, sizePerPage, startdate, enddate, search, searchBy }).then(({ data }) => {
    dispatch({
      type: FETCHED_RESPONSE_UNIT_HISTORY,
      payload: {
        responseUnits: data.data.responseUnitRecords,
        metadata: data.data.metadata
      }
    })
  })
}

