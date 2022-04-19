import React, { useState } from "react";
import classNames from "classnames";
import "./gatewayInfoPanel.css";

function GatewayInfo({ containerClass, iconClass, count, label }) {
  return (
    <div className={classNames("gateway-info", containerClass)}>
      <div className="gateway-count">
        <i className={classNames("sf-icon", "i-trigrd", iconClass)} />
        <span className="count">{count}</span>
      </div>
      <div className="gateway-status">
        <span className="info-type">{label}</span>
      </div>
    </div>
  );
}

function GatewayInfoPanel({ gateways }) {
  const [menuOpen, setMenuOpen] = useState(true);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  const gatewayStatistics = gateways.reduce(
    (info, gateway) => {
      info["installed"]++;
      switch (gateway.status) {
        case "armed":
          info["armed"]++;
          break;
        case "incident":
          info["incident"]++;
          break;
        case "verified":
          info["verified"]++;
          break;
        case "acknowledged":
          info["acknowledged"]++;
          break;
        default:
          break;
      }
      return info;
    },
    { installed: 0, armed: 0, incident: 0, verified: 0, acknowledged: 0 },
  );

  return (
    <div
      className={classNames(
        "gateway-info-panel",
        { open: menuOpen },
      )}
    >
      <GatewayInfo
        iconClass="i-home"
        label="Iylus Gateway Installed"
        count={gatewayStatistics.installed}
      />

      <GatewayInfo
        containerClass="armed"
        iconClass="i-shield"
        label="Iylus Gateway Armed"
        count={gatewayStatistics.armed}
      />

      <GatewayInfo
        containerClass="triggered"
        iconClass="i-alarm"
        label="Iylus Gateway Triggered"
        count={gatewayStatistics.incident}
      />

      <GatewayInfo
        containerClass="verified"
        iconClass="i-alert"
        label="Iylus Gateway Verified"
        count={gatewayStatistics.verified}
      />

      <GatewayInfo
        containerClass="acknowledged"
        iconClass="i-police"
        label="Iylus Gateway Acknowledged"
        count={gatewayStatistics.acknowledged}
      />
      <button onClick={toggleMenu} className="menu-open-btn">
        <img src="/assets/icons/chevron-down-white-panel.png" alt="v" />
      </button>
    </div>
  );
}

export default GatewayInfoPanel;
