import React from "react";
import GatewayDetailTimeline from "./gatewayDetailTimeline";
const GatewayTimeline = ({ status, mac, isVisible }) => {
  return (
    <div className="detail-box">
      <h3 style={{ marginBottom: "20px" }}>Timeline</h3>
      <GatewayDetailTimeline status={status} mac={mac} isVisible={isVisible} />
    </div>
  );
};

export default GatewayTimeline;
