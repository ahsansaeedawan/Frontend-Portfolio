import React, { Component } from "react";
import { Marker } from "@react-google-maps/api";
import PropTypes from "prop-types";
import { mapMarkerIcon } from "../../assets/assetsMap";
import MapMarkerInfoWindow from "../mapMarkerInfoWindow/mapMarkerInfoWindow";
import { appRoles } from "../../assets/roles";


class MapMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayViewVisible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.status !== "incident" && nextProps.status === "incident") {

      this.props.onAlarmAlert();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // We will only update the marker if its status is changed to avoid unneccessary renders, we can add more conditions as needed.
    if (
      nextProps.status !== this.props.status ||
      nextProps.online !== this.props.online ||
      nextState.overlayViewVisible !== this.state.overlayViewVisible
    ) {
      return true;
    }
    return false;
  }

  handleMouseOver = () => {
    this.setState({
      overlayViewVisible: true,
    });
  };

  handleMouseOut = () => {
    this.setState({
      overlayViewVisible: false,
    });
  };

  handleOnClick = () => {
    this.props.onMarkerClick(this.props.gateway._id);
  };

  render() {
    let { position, status, clusterer, gateway, online, alarmType, user } = this.props;
    status = status in mapMarkerIcon ? status : "idle";
    if (user.role[0] === appRoles.radmin || user.role[0] === appRoles.ra) {
      status = status === "incident" ? "idle" : status;
    }
    return (

      <Marker
        ref={this.props.innerRef}
        position={position}
        icon={online == "1" ? status === "verified" && alarmType === "Duress Alert" ? mapMarkerIcon["duressAlarm"] : mapMarkerIcon[status] : mapMarkerIcon[online]}
        animation={online == "1" && status === "incident" || status === "verified" || status === "unverified" ? 1 : 2}
        clusterer={clusterer}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onClick={this.handleOnClick}
      >
        {this.state.overlayViewVisible && (
          <MapMarkerInfoWindow position={position} gateway={gateway} />
        )}
      </Marker>
    );
  }
}

MapMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  status: PropTypes.oneOf([
    "idle",
    "armed",
    "incident",
    "verified",
    "acknowledged",
    "unverified"
  ]),

  clusterer: PropTypes.any,
};

export default React.forwardRef((props, ref) => <MapMarker innerRef={ref} {...props} />);

