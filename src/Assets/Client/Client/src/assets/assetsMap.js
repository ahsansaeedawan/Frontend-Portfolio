import redMarker from "./images/icons/map_icons/redMarker.svg";
import orangeMarker from "./images/icons/map_icons/orangeMarker.svg";
import greenMarker from "./images/icons/map_icons/greenMarker.svg";
import blueMarker from "./images/icons/map_icons/blueMarker.svg";
import navyBlueMarker from "./images/icons/map_icons/navyblue-marker.svg";
import whiteMarker from "./images/icons/map_icons/whiteMarker.svg";
import eventAcknowledged from "./images/icons/map_icons/event-acknowledged.png";
import eventIncident from "./images/icons/map_icons/event-incident.png";
import eventVerify from "./images/icons/map_icons/event-verify.png";
import responseUnitAssigned from "./images/icons/map_icons/response-unit-assigned.png";
import responseUnitAvailable from "./images/icons/map_icons/response-unit-available.png";
import duressAlarm from "./images/icons/map_icons/red-marker.svg";



//0 - this is icon for offline
//1 - this is icon for online
export const mapMarkerIcon = {
  duressAlarm: duressAlarm,
  "0": whiteMarker,
  "1": greenMarker,
  verified: blueMarker,
  unverified: blueMarker,
  acknowledged: navyBlueMarker,
  idle: orangeMarker,
  incident: redMarker,
  armed: greenMarker,
  "event-verified": eventVerify,
  "event-incident": eventIncident,
  "event-acknowledged": eventAcknowledged,
  respUnitAssigned: responseUnitAssigned,
  respUnitAvailable: responseUnitAvailable,
};
