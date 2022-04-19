import axios from "axios";
import jwtDecode from "jwt-decode";
import { getAmplitudeuserMeta } from "../config/amplitude.config";

const {
  REACT_APP_AXIOS_RETRY,
  REACT_APP_API_PREFIX,
  REACT_APP_CONTENT_TYPE,
  REACT_APP_APPLICATION_X_WWW_FORM_URLENCODED,
} = process.env;

// Constants
const AXIOS_RETRY = REACT_APP_AXIOS_RETRY;
const API_PREFIX = REACT_APP_API_PREFIX;
const CONTENT_TYPE = REACT_APP_CONTENT_TYPE;
const APPLICATION_X_WWW_FORM_URLENCODED = REACT_APP_APPLICATION_X_WWW_FORM_URLENCODED;
const VOIP_API = "http://accordiacloud.com:8088/api";
const userMeta = getAmplitudeuserMeta();

export const login = ({ email, password }) => {
  return axios.post(
    `${API_PREFIX}/user/login`,
    { email, password },
    {
      [AXIOS_RETRY]: {
        retries: 3,
      },
      errorHandling: {
        global: true,
      },
    },
  );
};
export const logAmplitudeEvent = (event) => {
  return axios.post(
    `${API_PREFIX}/analytics/trackEvent`,
    { ...event, ...userMeta },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 12,
      },
    },
  );
};

export const forgotPassword = ({ email }) => {
  return axios.post(
    `${API_PREFIX}/user/forgot_password`,
    { email },
    {
      [AXIOS_RETRY]: {
        retries: 6,
      },
    },
  );
};

export const createPassword = ({ password, token }) => {
  return axios.patch(
    `${API_PREFIX}/user/create_password`,
    { password, token },
    {
      [AXIOS_RETRY]: {
        retries: 6,
      },
    },
  );
};

export const changePassword = ({ oldPassword, newPassword }) => {
  return axios.patch(
    `${API_PREFIX}/user/change_password`,
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 12,
      },
    },
  );
};

export const addOrganization = (formData) => {
  return axios.post(`${API_PREFIX}/organization/add`, formData, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      [CONTENT_TYPE]: APPLICATION_X_WWW_FORM_URLENCODED,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
    errorHandling: {
      global: true,
    },
  });
};

export const addOrganizationUser = (organizationId, data) => {
  return axios.post(
    `${API_PREFIX}/organization/${organizationId}/user/register`,
    data,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        [CONTENT_TYPE]: APPLICATION_X_WWW_FORM_URLENCODED,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
      errorHandling: {
        global: true,
      },
    },
  );
};

export const editOrganizationUser = (organizationId, userId, data) => {
  return axios.patch(
    `${API_PREFIX}/organization/${organizationId}/user/${userId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        [CONTENT_TYPE]: APPLICATION_X_WWW_FORM_URLENCODED,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
      errorHandling: {
        global: true,
      },
    },
  );
};

export const editOrganization = (id, formData) => {
  return axios.patch(`${API_PREFIX}/organization/edit/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      [CONTENT_TYPE]: APPLICATION_X_WWW_FORM_URLENCODED,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
    errorHandling: {
      global: true,
    },
  });
};

export const deleteOrganization = (id) => {
  return axios.delete(`${API_PREFIX}/organization/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },

    errorHandling: {
      global: true,
    },
  });
};

export const deleteOrganizationUser = (organizationId, userId) => {
  return axios.delete(`${API_PREFIX}/organization/${organizationId}/user`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    data: {
      ids: [userId],
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },

    errorHandling: {
      global: true,
    },
  });
};

export const assignGateway = (macAddress) => {
  return axios.post(
    `${API_PREFIX}/gateway/handleAgentAssignment/assign`,
    {
      macAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
      errorHandling: {
        global: true,
      },
    },
  );
};

export const unAssignGateway = (macAddress) => {
  return axios.post(
    `${API_PREFIX}/gateway/handleAgentAssignment/unassign`,
    {
      macAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
      errorHandling: {
        global: true,
      },
    },
  );
};

export const assignAlarm = (mac, responseUnit) => {
  if (!mac || !responseUnit) return;
  return axios.patch(
    `${API_PREFIX}/user/alarm/assign`,
    {
      mac,
      responseUnit,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    },
  );
};

export const unassignAlarm = (mac, responseUnit) => {
  if (!mac || !responseUnit) return;
  return axios.patch(
    `${API_PREFIX}/user/alarm/unassign`,
    {
      mac,
      responseUnit,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    },
  );
};

export const updateOrganizationStatus = (id, status) => {
  return axios.patch(
    `${API_PREFIX}/organization/edit/${id}`,
    {
      active: status,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    },
  );
};

export const updateOrganizationUserStatus = (userIds, status) => {
  return axios.patch(
    `${API_PREFIX}/users/changeStatus`,
    {
      ids: userIds,
      active: status,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    },
  );
};

export const fetchGateways = () => {
  const token = window.localStorage.getItem("token");

  if (!token) {
    throw new Error("Invalid Token");
  }
  const decodedToken = jwtDecode(token);
  if (
    !decodedToken ||
    typeof decodedToken.dealerId === "undefined" ||
    typeof decodedToken.subDealerId === "undefined"
  ) {
    throw new Error("Invalid Token Signature");
  }
  return axios.post(
    `${API_PREFIX}/gateway`,
    {
      dealerId: decodedToken.dealerId,
      subDealerId: decodedToken.subDealerId,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 12,
      },
    },
  );
};

export const getNotifications = ({
  limit = 10,
  page = 1,
  mac,
  assignedToMe = false,
}) => {
  const params = {};
  params.limit = limit;
  params.page = page;
  params.assignedToMe = assignedToMe ? true : false;
  if (mac && mac.trim()) params.mac = mac;
  return axios.post(`${API_PREFIX}/events/eventsHistory`, null, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    params,
  });
};

export const getNearbyResponseUnits = ({ coordinates, mac }) => {
  return axios.post(
    `${API_PREFIX}/user/nearbyResponseUnits`,
    { coordinates, mac },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
    },
  );
};

export const fetchResponseUnits = () => {
  return axios.get(`${API_PREFIX}/user/allResponseUnits`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 12,
    },
  });
};

export const updateResponseUnitStatus = (online, userId) => {
  return axios.patch(
    `${API_PREFIX}/user/onlineStatus`,
    { online, userId },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 6,
      },
    },
  );
};

export const fetchAllOrganizations = ({
  page,
  sizePerPage,
  searchBy = null,
  searchValue,
  active = null,
}) => {
  const params = {};
  if (page) params.page = page;
  if (sizePerPage) params.limit = sizePerPage;
  if (searchBy) params.searchBy = searchBy;
  if (searchValue) params.searchValue = searchValue;
  if (active !== null) params.active = active;
  return axios.get(`${API_PREFIX}/organization/view`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    params,
    [AXIOS_RETRY]: {
      retries: 12,
    },
  });
};

export const fetchOrganizationsCount = () => {
  return axios.get(`${API_PREFIX}/organization/count`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
  });
};

export const fetchUserCount = () => {
  return axios.get(`${API_PREFIX}/users/count`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
  });
};

export const fetchUser = () => {
  return axios.get(`${API_PREFIX}/user/detail`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
  });
};

export const fetchAllUsers = ({
  page,
  sizePerPage,
  searchBy = null,
  searchValue,
  active = null,
}) => {
  const params = {};
  if (page) params.page = page;
  if (sizePerPage) params.limit = sizePerPage;
  if (searchBy) params.searchBy = searchBy;
  if (searchValue) params.searchValue = searchValue;
  if (active !== null) params.active = active;
  return axios.get(`${API_PREFIX}/users`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    params,
    [AXIOS_RETRY]: {
      retries: 3,
    },
  });
};

export const fetchUsers = (organizationId) => {
  return axios.get(`${API_PREFIX}/organization/${organizationId}/user/get`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
  });
};

export const getAlarmDetail = (id) => {
  return axios.get(`${API_PREFIX}/gateway/alarm/${id}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
  });
};

export const fetchGatewayTimeline = (mac) => {
  return axios.get(`${API_PREFIX}/gateway/alarm/timeline`, {
    params: {
      mac,
      limit: 20,
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
};

export const gatewayAction = ({ macAddress, action, comments }) => {
  return axios.post(
    `${API_PREFIX}/gateway/action`,
    { macAddress, action, comments },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    },
  );
};

export const acknowledgeIncident = (macAddress) => {
  return axios.post(
    `${API_PREFIX}/gateway/confirmDispatch`,
    { macAddress },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    },
  );
};

export const verifyIncident = (macAddress) => {
  return axios.post(
    `${API_PREFIX}/gateway/dispatch`,
    { macAddress },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    },
  );
};

export const fetchEventsHistory = ({ date, step, events }) => {
  return axios.post(
    `${API_PREFIX}/gateway/eventsHistory`,
    {
      date,
      step,
      events,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    },
  );
};

export const exportEventsHistory = ({ date, step, events }) => {
  return axios.post(
    `${API_PREFIX}/gateway/eventsHistory/csv`,
    {
      date,
      step,
      events,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
      responseType: "blob",
    },
  );
};

export const updatePhoneCallStatus = ({
  agentName,
  mac,
  callerNo,
  crmUniqueId,
  apiResponse,
}) => {
  return axios.post(
    `${API_PREFIX}/integration/zoiper`,
    {
      agentName,
      mac,
      callerNo,
      crmUniqueId,
      apiResponse,
    },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    },
  );
};

export const makePhoneCall = ({ callerno, agentname, crmuniqueid }) => {
  return axios.post(`${VOIP_API}/clicktodial`, {
    callerno,
    agentname,
    crmuniqueid,
  });
};

export const exportEventsInsight = ({ startdate, enddate }) => {
  return axios.get(`${API_PREFIX}/timeline/history/exportCSV`, {
    params: {
      startdate,
      enddate,
    },
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
    responseType: "blob",
  });
};

export const exportEventHistoryPdf = (id) => {
  return axios.get(`${API_PREFIX}/gateway/exportEventPDF/${id}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
    responseType: "blob",
  });
};

export const exportResponseUnitEventHistoryPdf = (id) => {
  return axios.get(`${API_PREFIX}/timeline/history/exportPdf/${id}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
    responseType: "blob",
  });
};
export const fetchResponseUnitHistory = ({
  page,
  sizePerPage,
  startdate,
  enddate,
  searchBy = null,
  search,
}) => {
  const params = {};
  params.page = page;
  params.limit = sizePerPage;
  params.startDate = startdate;
  params.endDate = enddate;
  if (searchBy && search.trim()) params.searchBy = searchBy;
  if (search.trim()) params.search = search;

  return axios.get(`${API_PREFIX}/timeline/responseUnitHistory`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    params
  });
};

export const fetchEventsHistoryTimeline = ({
  page,
  sizePerPage,
  startdate,
  enddate,
  searchBy = null,
  search,
}) => {
  const params = {};
  params.limit = sizePerPage;
  params.page = page;
  params.startDate = startdate;
  params.endDate = enddate;
  if (searchBy && search.trim()) params.searchBy = searchBy;
  if (search.trim()) params.search = search;
  return axios.get(`${API_PREFIX}/timeline/history`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    params
  });
};

export const getDealerIdWithSubDealer = (orgId) => {
  const params = {};
  params.org_id = orgId;
  return axios.post(`${API_PREFIX}/organization/getDealers`,
    params,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    });
}

export const getOrganization = () => {
  return axios.get(`${API_PREFIX}/organization/getOrgs`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    [AXIOS_RETRY]: {
      retries: 3,
    },
  });
}

export const manualTriggerAlarm = ({ macAddress }) => {
  return axios.post(
    `${API_PREFIX}/gateway/manualTriggerAlarm`,
    { macAddress },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    });
}

export const fetchS3BucketUrls = (media) => {
  return axios.get(
    `${API_PREFIX}/file/${media}`,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
    },
  );
};

export const cancelResponseUnitTransferAlarmRequest = (data) => {
  return axios.post(
    `${API_PREFIX}/user/cancelAlarmTransferRequest`,
    data,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
    },
  );
};

export const transferAlarmRequest = () => {
  return axios.get(`${API_PREFIX}/alarm/transferRequests`,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
    },
  );
};

export const voilatedSLARequest = (page) => {
  return axios.get(`${API_PREFIX}/sla/violations?limit=10&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
    },
  );
};



export const getIntelliconUsers = (orgId) => {
  return axios.post(
    `${API_PREFIX}/organization/intelliconAgents`,
    orgId,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 3,
      },
    },
  );
};

export const logoutUser = () => {
  return axios.get(`${API_PREFIX}/user/logout`,
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
      [AXIOS_RETRY]: {
        retries: 0,
      },
    },
  );
};

