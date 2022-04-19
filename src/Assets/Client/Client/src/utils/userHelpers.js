const MONITORING_ADMIN_RESPONSE_ADMIN = "MONITORING_ADMIN_RESPONSE_ADMIN";
const MONITORING_AGENT_RESPONSE_AGENT = "MONITORING_AGENT_RESPONSE_AGENT";
const RESPONSE_ADMIN = "RESPONSE_ADMIN";
const RESPONSE_AGENT = "RESPONSE_AGENT";
const MONITORING_ADMIN = "MONITORING_ADMIN";
const MONITORING_AGENT = "MONITORING_AGENT";
const RESPONSE_UNIT = "RESPONSE_UNIT";

const roles = {
  MONITORING_AGENT: {
    value: "MONITORING_AGENT",
    label: "Monitoring Agent"
  },
  MONITORING_ADMIN: {
    value: "MONITORING_ADMIN",
    label: "Monitoring Admin"
  },
  RESPONSE_AGENT: {
    value: "RESPONSE_AGENT",
    label: "Response Agent"
  },
  RESPONSE_ADMIN: {
    value: "RESPONSE_ADMIN",
    label: "Response Admin"
  },
  RESPONSE_UNIT: {
    value: "RESPONSE_UNIT",
    label: "Rapid Responder"
  }
};

const allRoles = [
  roles.MONITORING_AGENT,
  roles.MONITORING_ADMIN,
  roles.RESPONSE_AGENT,
  roles.RESPONSE_ADMIN,
  roles.RESPONSE_UNIT
];

const allAllowedRoles = [
  MONITORING_ADMIN_RESPONSE_ADMIN,
  MONITORING_AGENT_RESPONSE_AGENT,
  RESPONSE_ADMIN,
  RESPONSE_AGENT,
  MONITORING_ADMIN,
  MONITORING_AGENT,
  RESPONSE_UNIT
];

export const parentMultiSelectOptions = {
  SUPER_ADMIN: [
    roles.MONITORING_AGENT,
    roles.MONITORING_ADMIN,
    roles.RESPONSE_ADMIN,
    roles.RESPONSE_AGENT
  ],
  ORGANIZATION_ADMIN: [
    roles.RESPONSE_AGENT,
    roles.RESPONSE_ADMIN,
  ],
  MONITORING_ADMIN_RESPONSE_ADMIN: [
    roles.MONITORING_AGENT,
    roles.RESPONSE_AGENT,
  ],
  RESPONSE_ADMIN: [roles.RESPONSE_AGENT, roles.RESPONSE_UNIT],
  MONITORING_ADMIN: [roles.MONITORING_AGENT]
};



export const multiSelectOptions = {
  SUPER_ADMIN: [
    roles.MONITORING_AGENT,
    roles.MONITORING_ADMIN,
    roles.RESPONSE_ADMIN,
    roles.RESPONSE_AGENT
  ],
  ORGANIZATION_ADMIN: [
    roles.RESPONSE_AGENT,
    roles.RESPONSE_ADMIN,
    roles.RESPONSE_UNIT
  ],
  PARENT_ORGANIZATION_ADMIN: [
    roles.RESPONSE_AGENT,
    roles.RESPONSE_ADMIN,

  ],

  MONITORING_ADMIN_RESPONSE_ADMIN: [
    roles.MONITORING_AGENT,
    roles.RESPONSE_AGENT,
    roles.RESPONSE_UNIT
  ],
  RESPONSE_ADMIN: [roles.RESPONSE_AGENT, roles.RESPONSE_UNIT],
  MONITORING_ADMIN: [roles.MONITORING_AGENT]
};

export const orgMultiSelectOptions = {
  parent: [
    roles.MONITORING_AGENT,
    roles.MONITORING_ADMIN,
    roles.RESPONSE_ADMIN,
    roles.RESPONSE_AGENT
  ],
  child: [
    roles.RESPONSE_AGENT,
    roles.RESPONSE_ADMIN,
    roles.RESPONSE_UNIT
  ],
  isRapidResponder: [
    roles.RESPONSE_AGENT,
    roles.RESPONSE_ADMIN,
  ]
  
};




const allowedRoles = {
  SUPER_ADMIN: allAllowedRoles,
  ORGANIZATION_ADMIN: allAllowedRoles,
  MONITORING_ADMIN_RESPONSE_ADMIN: [
    MONITORING_AGENT_RESPONSE_AGENT,
    RESPONSE_UNIT,
    RESPONSE_AGENT,
    MONITORING_AGENT
  ],
  RESPONSE_ADMIN: [RESPONSE_AGENT, RESPONSE_UNIT],
  MONITORING_ADMIN: [MONITORING_AGENT]
};

function isValidRole(role, nextRole) {
  return allowedRoles[role].find(role => role === nextRole);
}

export function validateRole(userRoles, rolesToValidate) {
  if (rolesToValidate.length === 0) return true;
  const nextRole = rolesToValidate
    .map(role => role.value)
    .sort()
    .join("_");
  if (userRoles.length === 1) {
    const role = userRoles[0];
    return isValidRole(role, nextRole) ? true : false;
  } else if (userRoles.length === 2) {
    const role = userRoles.sort().join("_");
    if (allowedRoles[role]) {
      return isValidRole(role, nextRole) ? true : false;
    }
  }
}
