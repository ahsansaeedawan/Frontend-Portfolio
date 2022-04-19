export const ORGANIZATION_FORM_INITIAL_VALUES = {
  name: "",
  contact: "",
  logo: null,
  person: "",
  email: "",
  address: "",
  country: "",
  city: "",
  dealerId: "",//After 02 15 2021 realese dealer subdealer conecpt are 
  subDealerId: "",//remove from our project so remove or comment these lines
  zoom: "",
  lat: "",
  lng: "",
  delayTime: 60,
  serviceUpTime: 98,
  verificationTime: 120,
  acknowledgmentTime: 60,
  responseUnitAssignmentTime: 60,
  responseUnitAcknowledgmentTime: 0,
  responseUnitArrivalTime: 15,
  customerSatisfaction: 95,
  responseUnitAutoAssignment: true,
  videoFeed: false,
  isParent: true,
  parent: "",
  localAuthoritiesEngagementTime: 60,
  intimatingLocalAuthoritiesEngagementTime: 0,
};

export const USER_FORM_INITIAL_VALUES = {
  first_name: "",
  last_name: "",
  // voip_username: "", For now voip field is removed from User /Organization FORM
  role: [],
  email: "",
  contact: "",
  avatar: null,
  emailPassword: false,
  password: "",
  organization: "",
  intelliconAgents: ""
};

export const CHANGE_PASSWORD_FORM_INITIAL_VALUES = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};


export const LOGIN_FORM_INITIAL_VALUES = {
  email: "",
  password: ""
}