const RESPONSE_UNIT = {
  monitoring: false,
  response: false,
  gatewayStatus: false,
  timelineStatus: false,
  addOrganization: false,
  editOrganization: false,
  deleteOrganization: false,
  addUser: false,
  editUser: false,
  deleteUser: false,
  insights: false,
  insightsFilter: {
    incident: false,
    verified: false,
    acknowledged: false,
  },
  history: false,
  verifyAlarm: false,
  cancelAlarm: false,
  acknowledgeAlarm: false,
  displayResponseUnits: false,
  assignResponseUnit: false,
  vehicles: false,
  closeAlarm: false,
  lawEnforcement: false
};

const SUPER_ADMIN = {
  monitoring: false,
  response: false,
  gatewayStatus: false,
  timelineStatus: false,
  addOrganization: true,
  editOrganization: true,
  deleteOrganization: true,
  addUser: true,
  editUser: true,
  deleteUser: true,
  insights: false,
  insightsFilter: {
    incident: false,
    verified: false,
    acknowledged: false,
  },
  history: false,
  verifyAlarm: false,
  cancelAlarm: false,
  acknowledgeAlarm: false,
  displayResponseUnits: false,
  assignResponseUnit: false,
  vehicles: false,
  closeAlarm: false,
  lawEnforcement: false
};

const ORGANIZATION_ADMIN = {
  monitoring: false,
  response: false,
  gatewayStatus: false,
  timelineStatus: false,
  addOrganization: false,
  editOrganization: false,
  deleteOrganization: false,
  addUser: true,
  editUser: true,
  deleteUser: true,
  insights: false,
  insightsFilter: {
    incident: false,
    verified: false,
    acknowledged: false,
  },
  history: false,
  verifyAlarm: false,
  cancelAlarm: false,
  acknowledgeAlarm: false,
  displayResponseUnits: false,
  assignResponseUnit: false,
  vehicles: false,
  closeAlarm: false,
  lawEnforcement: false
};

const MONITORING_ADMIN = {
  monitoring: true,
  response: false,
  gatewayStatus: true,
  timelineStatus: true,
  addOrganization: false,
  editOrganization: false,
  deleteOrganization: false,
  addUser: true,
  editUser: true,
  deleteUser: true,
  insights: true,
  insightsFilter: {
    incident: true,
    verified: true,
    acknowledged: false,
  },
  history: true,
  verifyAlarm: true,
  unverifyAlarm: true,
  cancelAlarm: true,
  acknowledgeAlarm: false,
  displayResponseUnits: false,
  assignResponseUnit: false,
  vehicles: false,
  closeAlarm: false,
  lawEnforcement: false
};

const MONITORING_AGENT = {
  monitoring: true,
  response: false,
  gatewayStatus: true,
  timelineStatus: true,
  addOrganization: false,
  editOrganization: false,
  deleteOrganization: false,
  addUser: false,
  editUser: false,
  deleteUser: false,
  insights: false,
  insightsFilter: {
    incident: false,
    verified: false,
    acknowledged: false,
  },
  history: false,
  verifyAlarm: true,
  unverifyAlarm: true,

  cancelAlarm: true,
  acknowledgeAlarm: false,
  displayResponseUnits: false,
  assignResponseUnit: false,
  vehicles: false,
  closeAlarm: false,
  lawEnforcement: false
};

const RESPONSE_ADMIN = {
  monitoring: false,
  response: true,
  gatewayStatus: true,
  timelineStatus: true,
  addOrganization: false,
  editOrganization: false,
  deleteOrganization: false,
  addUser: true,
  editUser: true,
  deleteUser: true,
  insights: true,
  insightsFilter: {
    incident: false,
    verified: true,
    acknowledged: true,
  },
  history: true,
  verifyAlarm: false,
  unverifyAlarm: true,

  cancelAlarm: false,
  acknowledgeAlarm: true,
  displayResponseUnits: true,
  assignResponseUnit: true,
  vehicles: true,
  closeAlarm: true,
  lawEnforcement: true
};

const RESPONSE_AGENT = {
  monitoring: false,
  response: true,
  gatewayStatus: true,
  timelineStatus: true,
  addOrganization: false,
  editOrganization: false,
  deleteOrganization: false,
  addUser: false,
  editUser: false,
  deleteUser: false,
  insights: false,
  insightsFilter: {
    incident: false,
    verified: false,
    acknowledged: false,
  },
  history: false,
  verifyAlarm: false,
  unverifyAlarm: true,

  cancelAlarm: false,
  acknowledgeAlarm: true,
  displayResponseUnits: true,
  assignResponseUnit: true,
  vehicles: true,
  closeAlarm: true,
  lawEnforcement: true
};

const permissions = {
  SUPER_ADMIN,
  ORGANIZATION_ADMIN,
  MONITORING_ADMIN,
  MONITORING_AGENT,
  RESPONSE_ADMIN,
  RESPONSE_AGENT,
  RESPONSE_UNIT,
};

export const getUserPermissions = (roles) => {
  if (!roles.length) return undefined;

  // Map Permissions for Single Role
  if (roles.length === 1) {
    return permissions[roles[0]];
  }

  // Map Permissions for Multiple Roles
  if (roles.length === 2) {
    roles.sort();
    const tempPermA = permissions[roles[0]];
    const tempPermB = permissions[roles[1]];

    const permission = {};

    Object.keys(tempPermA).forEach((key) => {
      // if permissions are in another object
      if (typeof tempPermA[key] === "object") {
        const subLevelPermission = {};

        Object.keys(tempPermA[key]).forEach((k) => {
          subLevelPermission[k] =
            tempPermA[key][k] === true || tempPermB[key][k] === true
              ? true
              : false;
        });

        permission[key] = subLevelPermission;
      } else {
        permission[key] =
          tempPermA[key] === true || tempPermB[key] === true ? true : false;
      }
    });

    return permission;
  }
};
