import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ToggleSwitch from "../toggleSwitch/toggleSwitch";
import { LoadingMask } from "../loadingMask";
import { updateResponseUnitStatus } from "../../api/api";
import "./vehicleListItem.css";
import { logAmplitudeEvent } from "../../api";
import { OPERATION_STATUS_OF_RESPONSE_UNIT_CHANGED_TO_ONLINE, OPERATION_STATUS_OF_RESPONSE_UNIT_CHANGED_TO_OFFLINE } from "../../constants/amplitude";
const ResqestNotification = () => {
  return (
    <div className="ru-request">
      <i className="sf-icon i-alarm" />
    </div>
  );
};

function VehicleListItem({ vehicle, onClick, showToogle }) {
  const [loading, setLoading] = useState(false);

  function handleChangeStatus() {
    setLoading(true);
    updateResponseUnitStatus(!vehicle.online, vehicle._id)
      .then(() => {
        logAmplitudeEvent({ event_type: vehicle.online ? OPERATION_STATUS_OF_RESPONSE_UNIT_CHANGED_TO_OFFLINE : OPERATION_STATUS_OF_RESPONSE_UNIT_CHANGED_TO_ONLINE }).catch(() => { })
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  }
  return (
    <>
      {loading && <LoadingMask />}
      <div
        className={classNames("vehicle-menu-list-item", {
          "vehicle-online": vehicle.online
        })}
      >
        {/* <p className="status">Placeholder for any text</p> */}
        {vehicle.request && <ResqestNotification />}
        <h3 className="carname">{`${vehicle.first_name} ${vehicle.last_name}`}</h3>

        {showToogle &&
          <ToggleSwitch
            onChange={handleChangeStatus}
            checked={vehicle.online}
            className="status-toggle"
            label={vehicle.online ? "Online" : "Offline"}
          />}
      </div>
    </>
  );
}

VehicleListItem.propTypes = {
  gateway: PropTypes.object
};

export default VehicleListItem;
