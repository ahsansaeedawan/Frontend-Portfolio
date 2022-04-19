import React from "react";
import { GoogleMap } from "@react-google-maps/api";
import { legacyMapTheme } from "../../views/map/theme";

export const AddOrganizationGoogleMap = props => {
  return (
    <div className="gateway-detail-map">
      <GoogleMap
        mapContainerStyle={{
          height: "325px",
          width: "100%",
          borderRadius: "12px"
        }}
        mapContainerClassName="gm-overides"
        center={props.center}
        onLoad={props.onLoad}
        onCenterChanged={props.onCenterChanged}
        zoom={props.zoom}
        options={{
          disableDefaultUI: true,
          styles: legacyMapTheme
        }}
      ></GoogleMap>
    </div>
  );
};
