import React from "react";
import PropTypes from "prop-types";
import InfoMessage from "../infoMessage/infoMessage";
import { GatewayListItem } from "../gatewayListItem";
import { GATEWAY_ENTRIES_NOT_FOUND } from "../../constants/messages";
import "./gatewayList.css";

GatewayList.propTypes = {
  gateways: PropTypes.array
};

function GatewayList({
  gateways = [],
  onGatewayDetail,
  selectedGateway,
  isGatewayDetailVisible,
  assignOperationDisable

}) {
  return (
    <div className="gateway-list">
      {gateways.length === 0 && (
        <InfoMessage message={GATEWAY_ENTRIES_NOT_FOUND} />
      )}
      {gateways.map(gateway => (
        <GatewayListItem
          onClick={onGatewayDetail}
          key={gateway._id}
          gateway={gateway}
          selectedGateway={selectedGateway}
          isGatewayDetailVisible={isGatewayDetailVisible}
          assignOperationDisable={assignOperationDisable}
        />
      ))}
    </div>
  );
}

export default GatewayList;
