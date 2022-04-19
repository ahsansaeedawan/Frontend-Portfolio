export const incidentTabs = [
  {
    id: "Incidenttab01",
    label: "Triggered",
    status: "incident"
  },
  {
    id: "Incidenttab02",
    label: "Verified",
    status: "verified"
  },
  {
    id: "Incidenttab03",
    label: "Acknowledged",
    status: "acknowledged"
  },
  {
    id: "Incidenttab04",
    label: "Idle",
    status: "idle"
  },
  {
    id: "Incidenttab05",
    label: "All",
    status: "all"
  },

];

export const getIncidentTabs = (monitoring, response) => {
  // we need to show all tabs if role is monitoring and response
  if (monitoring && response) return incidentTabs;

  // if only role is response we need to filter out the incident column
  if (!monitoring && response)
    return incidentTabs.filter(tab => tab.status !== "incident");

  // return tabs if none of the above matches
  return incidentTabs;
};

export const vehicleTabs = [
  {
    id: "Vehicletab01",
    label: "Online",
    status: "online"
  },
  {
    id: "Vehicletab02",
    label: "Offline",
    status: "offline"
  },
  {
    id: "Vehicletab03",
    label: "Request",
    status: "request"
  }
];
