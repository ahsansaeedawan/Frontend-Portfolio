import React, { useEffect, useRef, useState } from "react";
import { Marker } from "@react-google-maps/api";
import { mapMarkerIcon } from "../../assets/assetsMap";
import MapMarkerInfoWindow from "../mapMarkerInfoWindow/mapMarkerInfoWindow";
import RespUnitInfoWindow from "../mapMarkerInfoWindow/respUnitInfoWindow";

function ResponseUnitComponent({
  position,
  available,
  map,
  siteDetail,
  online,
  clusterer,
  name
}) {


  const polylineOptions = useRef(
    new window.google.maps.Polyline({
      strokeColor: "#008ae3",
      strokeOpacity: 1.0,
      strokeWeight: 3
    })
  );
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRendererRef = useRef(
    new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: polylineOptions.current
    })
  );
  useEffect(() => {
    // If available = false, ride in progess - render distance line.
    if (!available) {
      directionsRendererRef.current.setMap(map);
      if (siteDetail && siteDetail.destination) {
        directionsService.route(
          {
            origin: new window.google.maps.LatLng(position.lat, position.lng),
            destination: new window.google.maps.LatLng(
              siteDetail.destination[0],
              siteDetail.destination[1]
            ),
            travelMode: "DRIVING"
          },
          function (response, status) {
            if (status === "OK") {
              directionsRendererRef.current.setDirections(response);
            } else {
              console.log("Directions request failed due to " + status);
            }
          }
        );
      }
    }
    if (available) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current.setPanel(null);
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer(
        {
          suppressMarkers: true,
          preserveViewport: true,
          polylineOptions: polylineOptions.current
        }
      );
    }
    return () => {
      /* Reset Route Line If Component is Disposed Off */
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current.setPanel(null);
    };
  }, [available, directionsService, map, position, siteDetail]);

  const [overlayViewVisible, setOverlayViewVisible] = useState(false);
  const handleMouseOver = () => {
    setOverlayViewVisible(true);
  };

  const handleMouseOut = () => {
    setOverlayViewVisible(false);
  };

  return (
    <Marker
      clusterer={clusterer}
      position={position}
      icon={mapMarkerIcon[online ? "respUnitAvailable" : "respUnitAssigned"]}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {overlayViewVisible && (
        <RespUnitInfoWindow name={name} position={position} />
      )}
    </Marker>


  );
}

function arePropsEqual(prevProps, nextProps) {
  const isPositionEqualToPrevProps =
    JSON.stringify(prevProps.position) === JSON.stringify(nextProps.position);
  const isAvailableEqualToPrevProps =
    prevProps.available === nextProps.available;

  const isOnlineEqual = prevProps.online === nextProps.online;
  return (
    isAvailableEqualToPrevProps && isPositionEqualToPrevProps && isOnlineEqual
  );
}

export const ResponseUnit = React.memo(ResponseUnitComponent, arePropsEqual);
