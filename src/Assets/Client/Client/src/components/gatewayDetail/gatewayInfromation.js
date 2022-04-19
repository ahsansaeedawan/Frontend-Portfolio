import React from "react";
import "./gatewayInformation.css";
import { Tooltip } from "../tooltip";
import { formatCNIC } from '../../utils/cnicFormat';

const GatewayInformation = ({ information, mac, countryFields }) => {
  return (
    <>
      {information.address && (
        <div className="detail-box">
          <h3>Address Details</h3>
          <div className="abs-sf-icon g-address">{information.address}</div>
        </div>
      )}
      {mac && (
        <div className="detail-box">
          <h3>MAC Address</h3>
          <div className="abs-sf-icon g-address mac-address">{mac}</div>
        </div>
      )}

      <div className="detail-box">
        <h3>Information</h3>
        {/* {information.duressCode && (
          <div className="g-info-li">
            <span className="g-info-name abs-sf-icon">Duress Code</span>
            <span className="g-info-number">{information.duressCode}</span>
          </div>
        )} */}
        {information.pinCode && (
          <div className="g-info-li">
            <span className="g-info-name abs-sf-icon">Pin Code</span>
            <span className="g-info-number">{information.pinCode}</span>
          </div>
        )}

        {countryFields ? (
          <div className="g-info-li">
            <p className="g-info-name abs-sf-icon">
              {countryFields.fieldLabel}
            </p>
            <span className="g-info-number">{formatCNIC(countryFields.value)}</span>
          </div>
        ) : null}
        <div className="g-info-stats">
          <Tooltip id="adult" content="Adult">
            <span className="g-info-stat-item">
              <i className="sf-icon i-person-outline" />
              <span className="count">x {information.adults}</span>
            </span>
          </Tooltip>
          <Tooltip id="Elder" content="Elder">
            <span className="g-info-stat-item">
              <i className="sf-icon i-person-outline" />
              <span className="count">x {information.elder}</span>
            </span>
          </Tooltip>
          <Tooltip id="childrens" content="Childrens">
            <span className="g-info-stat-item">
              <i className="sf-icon i-baby-outline" />
              <span className="count">x {information.childrens}</span>
            </span>
          </Tooltip>

          <Tooltip id="handicapped" content="Handicapped">
            <span className="g-info-stat-item">
              <i className="sf-icon i-disabled-outline" />
              <span className="count">x {information.handicapped}</span>
            </span>
          </Tooltip>
          <Tooltip id="floor" content="Floor">
            <span className="g-info-stat-item">
              <i className="sf-icon i-building-outline" />
              <span className="count">x {information.floor}</span>
            </span>
          </Tooltip>
          <Tooltip id="pets" content="Pets">
            <span className="g-info-stat-item">
              <i className="sf-icon i-paw-outline" />
              <span className="count">x {information.pets}</span>
            </span>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

GatewayInformation.propTypes = {};

export default GatewayInformation;
