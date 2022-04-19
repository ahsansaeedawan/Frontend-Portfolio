import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GoogleMap, Marker, useGoogleMap } from "@react-google-maps/api";
import { legacyMapTheme } from "../../views/map/theme";
import { mapMarkerIcon } from "../../assets/assetsMap";
import { smoothZoom } from "../../utils/googleMapUtils";
import "./gatewayDetailMap.css";
import { ResponseUnit } from "../responseUnit/responseUnit";

const GatewayDetailMarker = ({ position, status, online }) => {

  //getting the updated state of disableAssignOperation from store

  const map = useGoogleMap();
  useEffect(() => {
    if (map) {
      map.setZoom(8);
      setTimeout(() => {
        smoothZoom(map, 16, map.getZoom());
      }, 500);
    }
  }, [map, position]);
  status = status in mapMarkerIcon ? status : "idle";
  return <Marker position={position} icon={online == "1" ? mapMarkerIcon[status] : mapMarkerIcon[online]}
  />;
};

const GatewayDetailMap = props => {
  const { responseUnits } = useSelector(state => state);
  const [map, setMap] = useState(null);
  const assignedResponseUnits = responseUnits.filter(unit => {
    if (unit.siteDetail) {
      return unit.siteDetail.mac === props.mac;
    }
    return false;
  });

  return (
    <div className="gateway-detail-map">
      <GoogleMap
        mapContainerStyle={{
          height: "326px",
          width: "100%",
          borderRadius: "9px"
        }}
        mapContainerClassName="gm-overides"
        center={props.center}
        zoom={8}
        options={{
          disableDefaultUI: true,
          styles: legacyMapTheme
        }}
        onLoad={map => {
          setMap(map);
        }}
      >
        <GatewayDetailMarker position={props.center} status={props.status} online={props.online} />
        {map &&
          assignedResponseUnits &&
          assignedResponseUnits.length > 0 &&
          assignedResponseUnits.map(unit => (
            <ResponseUnit
              key={unit._id}
              siteDetail={unit.siteDetail || null}
              map={map}
              available={unit.available}
              position={{
                lat: unit.location.coordinates[1],
                lng: unit.location.coordinates[0]
              }}
              online={unit.online}
              name={unit.fullName}

            />
          ))}
      </GoogleMap>
    </div>
  );
};



GatewayDetailMap.propTypes = {};


export default GatewayDetailMap;
