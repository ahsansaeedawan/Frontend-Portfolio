import React from "react";
import PropTypes from "prop-types";
import { VehicleListItem } from "../vehicleListItem";
import { NO_VEHICLE_IN_SELECTED_STATE } from "../../constants/messages";
import "./vehicleList.css";
import InfoMessage from "../infoMessage/infoMessage";

VehicleList.propTypes = {
  gateways: PropTypes.array
};

function VehicleList({ vehicles = [], showToogle, onVehicleDetail = () => { } }) {
  return (
    <div className="vehicle-menu-list">
      {vehicles.length === 0 && (
        <InfoMessage message={NO_VEHICLE_IN_SELECTED_STATE} />
      )}

      {vehicles.map(vehicle => (
        <VehicleListItem
          onClick={onVehicleDetail}
          key={vehicle._id}
          vehicle={vehicle}
          showToogle={showToogle}
        />
      ))}
    </div>
  );
}

export default VehicleList;
