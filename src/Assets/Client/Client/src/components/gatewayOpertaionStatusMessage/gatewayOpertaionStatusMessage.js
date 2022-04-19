import React from "react";
import "./gatewayOpertaionStatusMessage.css";
import Greentick from "../../assets/images/green-tick.svg";

const GatewayOpertaionStatusMessage = ({ heading, message }) => {
  return (
    <div className="display-info">
      <img src={Greentick} alt="v" />
      <h1>{heading}</h1>
      <p>{message}</p>
    </div>
  );
};

export default GatewayOpertaionStatusMessage;
