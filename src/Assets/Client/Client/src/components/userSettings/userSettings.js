import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "@reach/router";
import { SocketContext, UserContext } from "../../context";

import { appRoles } from "../../assets/roles";
import "./userSettings.css";
import { logAmplitudeEvent, logoutUser } from "../../api";
import {
  DASHBOARD_USER_SETTINGS_CREATE_PASSWORD,
  LOGOUT_FROM_DASHBOARD
} from "../../constants/amplitude";
import { Tooltip } from "../tooltip";

const UserSettings = props => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      dispatch({
        type: "USER_LOGOUT"
      });
      await logoutUser();
      await logAmplitudeEvent({ event_type: LOGOUT_FROM_DASHBOARD });
      if (socket) {
        socket.disconnect();
      }
      window.localStorage.removeItem("token");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const handleOnClick = () => {
    logAmplitudeEvent({
      event_type: DASHBOARD_USER_SETTINGS_CREATE_PASSWORD
    }).catch(() => { });
    navigate("/admin/setting");
  };

  const renderSettingsButton = () => {
    const button = [];
    if (!user) return button;
    const role = user.role.includes(appRoles.sa)
      ? appRoles.sa
      : user.role.includes(appRoles.oa)
        ? appRoles.oa
        : "NORMAL_USER";
    const name =
      role === appRoles.sa
        ? "Super Admin"
        : role === appRoles.oa
          ? "Org Admin"
          : `${user.first_name} ${user.last_name}`;
    const organization =
      role === appRoles.sa ? "Iylus" : user.organization.name;

    button.push(
      <button
        key={`menu-act-btn-menu`}
        onClick={handleOnClick}
        className="menu-act-btn abs-sf-icon"
      >
        {user.avatar && (
          <img
            className="menu-user-avatar"
            src={user.avatar}
            alt=""
          />
        )}

        {role === appRoles.oa && user.organization.logo && (
          <img
            className="menu-user-avatar"
            src={user.organization.logo}
            alt=""
          />
        )}

        {((role === appRoles.oa && !user.organization.logo) ||
          (role !== appRoles.oa && !user.avatar)) && (
            <span className="user-name-thumbanil">{name[0].toUpperCase()}</span>
          )}

        <div className="user-settings-label-cnt">
          <span className="highlight">{name}</span>
          <span className="dim">{organization}</span>
        </div>
      </button>
    );
    return button;
  };
  return (
    <>
      {renderSettingsButton()}
      <Tooltip id="logoutBtnToolTip" content="Logout">
        <button
          className="checkout-button abs-sf-icon checkout-icon"
          onClick={logout}
        >
          <i className="sf-icon i-power-mgmnt" />
        </button>
      </Tooltip>
    </>
  );
};

UserSettings.propTypes = {};

export default UserSettings;
