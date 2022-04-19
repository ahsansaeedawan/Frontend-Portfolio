import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import "./mapMarkerInfoWindow.css";

const RespUnitInfoWindow = ({ name, position }) => {
    return (
        <InfoWindow position={position} >
            <div className="map-marker-i-window">
                <div className="i-window-header">
                    <h3>{name}</h3>
                </div>
            </div>
        </InfoWindow >
    );
};

RespUnitInfoWindow.propTypes = {};

export default RespUnitInfoWindow;
