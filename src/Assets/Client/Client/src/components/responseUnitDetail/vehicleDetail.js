import React from "react";
import "./vehicleDetail.css";

const VehicleDetail = ({ status, carName }) => {
  return (
    <div className="vehicle-detail-container">
      <div className="detail-header">
        <h3>Vehicle Details</h3>
        <div className="status-container">
          <span>Status</span>
          <span className={`status ${status}`}>{status}</span>
        </div>
      </div>
      <div className="vehicle-info">
        <h2>Model and Color</h2>
        <div className="vehicle-name">
          <i className="sf-icon i-car vehicle-icon" />
          <span className="carname">{carName}</span>
        </div>
      </div>
    </div>
  );
};
export default VehicleDetail;
