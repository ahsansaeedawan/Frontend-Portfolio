import React, { useEffect, useRef, useContext, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Moment from "react-moment";
import { UserContext } from "../../context";
import { gatewayAction, manualTriggerAlarm } from "../../api";
import { success } from "../toast";
import GatewayAgentAssignment from "./gatewayAgentAssignment";
import "./gatewayListItem.css";
import { MiniDangerButton } from "../button/miniDangerButton";
import { formatCNIC } from '../../utils/cnicFormat';
import { appRoles } from "../../assets/roles";
import { Badge } from "../badge";

function GatewayListItem({
  gateway,
  onClick,
  selectedGateway,
  isGatewayDetailVisible,
  assignOperationDisable

}) {
  const gatewayStatusClassMap = {
    verified: "red",
    unverified: "red",
    acknowledged: "blue",
    idle: gateway.online === "1" && gateway.status === "idle" ? "yellow" : "white", //TODO: update according to requirement right now Idle is no state in any case 
    incident: "orange",
    armed: "green",
  };
  // context
  const user = useContext(UserContext);

  // references
  const intervalId = useRef(null);
  const timeElapsed = useRef(0);

  // local state
  const [safeTime, setSafeTime] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [disabledBtn, setdisabledBtn] = useState(false);


  // functions
  const gatewayAgentAssign = (e) => {
    //For now we are not using this through redux 
    e.stopPropagation();
    setDisabled(true);
    gatewayAction({ macAddress: gateway.macAddress, action: "assigned" })
      .then((resp) => {
        setDisabled(false);
        success(`${gateway.macAddress} assigned.`);
      })
      .catch((error) => {
        setDisabled(false);
      });

  };

  const gatewayAgentUnAssign = (e) => {
    //For now we are not using this through redux 
    e.stopPropagation();
    setDisabled(true);
    gatewayAction({ macAddress: gateway.macAddress, action: "unassigned" }).then((resp) => {
      setDisabled(false);
      success(`${gateway.macAddress} unassigned.`);
    })
      .catch((error) => {
        setDisabled(false);
      });
  };


  const gatewayManualTrigger = (e) => {
    setdisabledBtn(true);
    e.stopPropagation();
    manualTriggerAlarm({ macAddress: gateway.macAddress }).then(() => {
      setdisabledBtn(true);
    }).catch(e => {
      console.log(e)
    })
  }


  useEffect(() => {
    // trigger safetime if the status of alarm changes to incident
    if (gateway.status === "incident") {
      // check to see if timer has already passed the safe time

      const now = new Date().getTime();
      const gatewayLastUpdated = parseInt(gateway.updatedAt);
      const organizationSafeTime = user.organization.delayTime;

      const safeTimePassed =
        (now - gatewayLastUpdated) / 1000 > organizationSafeTime;

      // do not create a new interval if already running
      if (!intervalId.current && !safeTimePassed) {
        timeElapsed.current = Math.floor((now - gatewayLastUpdated) / 1000);
        setSafeTime(false);
        intervalId.current = setInterval(() => {
          if (user.organization.delayTime === timeElapsed.current) {
            clearInterval(intervalId.current);
            setSafeTime(true);
          } else {
            timeElapsed.current = timeElapsed.current + 1;
            setElapsedTime(timeElapsed.current);
          }
        }, 1000);
      } else {
        setSafeTime(true);
      }
    } else {
      setSafeTime(true);
      setElapsedTime(user.organization.delayTime);
    }
    return () => {
      clearInterval(intervalId.current);
      timeElapsed.current = 0;
    };
  }, [gateway, user.organization.delayTime]);

  return (
    <div
      className={classNames(
        "gateway-list-item",
        gatewayStatusClassMap[gateway.status],
        {
          "details-open":
            selectedGateway &&
            selectedGateway._id === gateway._id &&
            isGatewayDetailVisible,
        }
      )}
      onClick={() => onClick(gateway._id)}
    >
      <div className="alarm-info">
        <div className="g-alarm-info">
          <span className="g-alarm-type">{gateway.lastEvent.name}</span>
          {gateway.lastEvent.timestamp && (
            <span className="g-alarm-time">
              <Moment format="hh:mm A" unix utc local>
                {gateway.lastEvent.timestamp}
              </Moment>
            </span>
          )}
        </div>
        {gateway.countryFields ? (
          <div className="g-country">
            {gateway.status === "unverified" ? <Badge status={"Unverified"} /> : null}
            <span className="g-country-label">
              {gateway.countryFields.fieldLabel}
            </span>
            <span className="g-country-value">
              {formatCNIC(gateway.countryFields.value)}
            </span>
          </div>
        ) : null}
      </div>
      <div className="alarm-event-info">
        <span className="event-name">{gateway.alarmOrigin}</span>
        {
          user.role[0] === appRoles.ra || user.role[0] === appRoles.radmin ? null :
            gateway.status === "idle" || gateway.status === "armed" || gateway.status === "standBy" ?
              <MiniDangerButton disabled={disabledBtn} title={"Trigger"} onClick={gatewayManualTrigger} />
              : null
        }

      </div>
      {
        !assignOperationDisable === true ?

          <GatewayAgentAssignment
            status={gateway.status}
            mac={gateway.macAddress}
            safeTime={user.organization.delayTime}
            safeTimePassed={safeTime}
            timeElapsed={elapsedTime}
            onAssign={gatewayAgentAssign}
            onUnAssign={gatewayAgentUnAssign}
            assigned={gateway.assignedAgent}
            disabled={disabled}
          /> : null
      }


    </div>
  );
}

GatewayListItem.propTypes = {
  gateway: PropTypes.object,
};

export default GatewayListItem;
