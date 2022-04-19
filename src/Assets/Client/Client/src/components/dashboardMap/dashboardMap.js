import React, { useState, useContext } from "react";
import AlarmAlert from "../../assets/sounds/alarmAlert.mp3";
import { GoogleMap } from "@react-google-maps/api";
import { legacyMapTheme } from "../../views/map/theme";
import MapMarker from "../mapMarker/mapMarker";
import { ResponseUnit } from "../responseUnit/responseUnit";
import { UserContext } from "../../context";
import { Spiderfy } from '../spiderfy';

const DashboardMap = ({
  center,
  zoom,
  gateways,
  responseUnits,
  onMarkerClick,
}) => {
  const [map, setMap] = useState(null);
  const user = useContext(UserContext);
  const alarmAlert = () => {
    try {
      const audio = new Audio(AlarmAlert);
      audio.currentTime = 0;
      audio.play();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="dashboard-map">
      <GoogleMap
        mapContainerStyle={{ height: "100vh", width: "100vw" }}
        mapContainerClassName="gm-overides"
        center={center}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          styles: legacyMapTheme,
        }}
        onLoad={(map) => {
          setMap(map);
        }}
      >
        {gateways &&
          gateways.length > 0 &&
          <Spiderfy>
            {gateways.map((gateway) => (
              <MapMarker
                alarmType={gateway.lastEvent.name}
                key={gateway._id}
                position={gateway.coordinates}
                status={gateway.status}
                online={gateway.online}
                gateway={gateway}
                onMarkerClick={onMarkerClick}
                onAlarmAlert={alarmAlert}
                map={map}
                user={user}
              />
            ))}
          </Spiderfy>
        }
        {responseUnits &&
          responseUnits.length > 0 &&
          responseUnits.map((unit) => (
            <ResponseUnit
              name={unit.fullName}
              key={unit._id}
              siteDetail={unit.siteDetail || null}
              map={map}
              available={unit.available}
              position={{
                lat: unit.location.coordinates[1],
                lng: unit.location.coordinates[0],
              }}
              online={unit.online}
            />
          ))}
      </GoogleMap>
    </div>
  );
};
DashboardMap.propTypes = {};
export default DashboardMap;
















