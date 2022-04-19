import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import MakaniLogo from "../../assets/images/makani-info-window.png";
import MapMarkerLogo from "../../assets/images/info-window-map-marker.png";
import "./mapMarkerInfoWindow.css";
import { formatCNIC } from '../../utils/cnicFormat';

const MapMarkerInfoWindow = ({ position, gateway }) => {
  return (
    <InfoWindow position={position}>
      <div className="map-marker-i-window">
        <div className="i-window-header">
          <h3>{gateway.info.name}</h3>
        </div>
        <div className="i-window-body">
          <div className="i-window-row">
            {gateway.countryFields ? (
              <>
                <div className="i-window-logo">
                  {gateway.countryFields.fieldLabel}
                </div>
                <div className="i-window-detail">
                  <h3>{formatCNIC(gateway.countryFields.value)}</h3>
                </div>
              </>
            ) : null}
          </div>
          <div className="i-window-row">
            <div className="i-window-logo">
              <img src={MapMarkerLogo} alt="" />
            </div>
            <div className="i-window-detail">
              <p>{gateway.address.fullAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
};

MapMarkerInfoWindow.propTypes = {};

export default MapMarkerInfoWindow;
