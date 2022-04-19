import React, { Component, PureComponent, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polygon,
  MarkerClusterer,
  OverlayView,
  InfoWindow,
  HeatmapLayer
} from "@react-google-maps/api";
import socketIOClient from "socket.io-client";
import { createPolygonCoords } from "../../utils/googleMapUtils";
import redMarker from "../../assets/images/icons/map_icons/red-marker.svg";
import orangeMarker from "../../assets/images/icons/map_icons/orange-marker.svg";
import greenMarker from "../../assets/images/icons/map_icons/green-marker.svg";
import blueMarker from "../../assets/images/icons/map_icons/blue-marker.svg";
import whiteMarker from "../../assets/images/icons/map_icons/white-marker.svg";
import { QATAR_WKT } from "./wkts/qatar";
import { DUBAI_WKT } from "./wkts/dubai";
import { legacyMapTheme } from "./theme";
import { SOCKET_GATEWAYS } from "../../constants/socket";
import {
  ALARM_STATUS_BLUE,
  ALARM_STATUS_RED,
  ALARM_STATUS_ORANGE
} from "../../constants/status";

const markerIconMapUrl = {
  red: redMarker,
  blue: blueMarker,
  white: whiteMarker,
  orange: orangeMarker,
  green: greenMarker
};

const polygonOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#1E90FF",
  fillOpacity: 0
};

const allMarkers = [
  {
    id: 1,
    label: "Dubai",
    lat: 25.204849,
    lng: 55.270782,
    alarmType: "red"
  },
  {
    id: 2,
    label: "Rawalpindi",
    lat: 33.565109,
    lng: 73.016914,
    alarmType: "blue"
  },
  {
    id: 3,
    label: "Al Ghuwariyah",
    lat: 25.837014,
    lng: 51.2291621,
    alarmType: "red"
  },
  {
    id: 4,
    label: "Canada",
    lat: 56.130367,
    lng: -106.346771,
    alarmType: "orange"
  },
  {
    id: 5,
    label: "Los Angles",
    lat: 34.052235,
    lng: -118.243683,
    alarmType: "green"
  }
];

// const polygonPath = str => {
//   const polygonPath = [];
//   const splitStrLines = str.split("\n");
//   splitStrLines.forEach(line => {
//     const splitLatLng = line.split("\t");
//     const path = {
//       lat: parseFloat(splitLatLng[0]),
//       lng: parseFloat(splitLatLng[1])
//     };
//     polygonPath.push(path);
//   });
//   return polygonPath;
// };

// animation = { 1 = always bouncing }, { 2 = Drop }

class MapMarker extends Component {

  constructor(props){
    super(props);
    this.state = {
      overlayViewVisible: false
    };

  }

  shouldComponentUpdate(nextProps, nextState) {
    // We will only update the marker if its status is changed to avoid unneccessary renders, we can add more conditions as needed.
    if (
      nextProps.marker.alarmStatus !== this.props.marker.alarmStatus ||
      nextState.overlayViewVisible !== this.state.overlayViewVisible
    ) {
      return true;
    }
    // if(nextState.overlayViewVisible !== this.state.overlayViewVisible){
    //   return true;
    // }
    return false;
  }

  handleMouseOver = () => {
    this.setState({
      overlayViewVisible: true
    });
  };

  handleMouseOut = () => {
    this.setState({
      overlayViewVisible: false
    });
  };

  render() {
    const { marker, clusterer } = this.props;
    return (
      <Marker
        position={{
          lat: marker.lat,
          lng: marker.lng
        }}
        icon={markerIconMapUrl[marker.alarmStatus]}
        animation={marker.alarmStatus === "red" ? 1 : 2}
        // animation={2}
        clusterer={clusterer}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        {this.state.overlayViewVisible && (
          <InfoWindow
            position={{
              lat: marker.lat,
              lng: marker.lng
            }}
          >
            <div className="custom-infowindow">
              <div className="w50">
                <p className="gray-title main-title">Makani No:</p>
                <p className="gray-title">124 456 78</p>
                <p className="main-title">Name:</p>
                <p>My Alarm Name</p>
              </div>
              <div className="w50">
                <p className="gray-title main-title">Emirates:</p>
                <p className="gray-title">#124 87 5</p>
                <p className="main-title">Address:</p>
                <p>Falana at dhimkana dot com</p>
              </div>
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

// const MapMarker = React.memo(({ marker, clusterer }) => {
//   const [overlayViewVisible, setOverlayViewVisible] = useState(false);

//   function handleMouseOver() {
//     setOverlayViewVisible(true);
//   }

//   function handleMouseOut() {
//     setOverlayViewVisible(false);
//   }
//   console.log("Map Marker rendered.....");
//   return (
//     <Marker
//       position={{
//         lat: marker.lat,
//         lng: marker.lng
//       }}
//       icon={markerIconMapUrl[marker.alarmStatus]}
//       // animation={marker.alarmType === "red" ? 1 : 2}
//       animation={2}
//       clusterer={clusterer}
//       onMouseOver={handleMouseOver}
//       onMouseOut={handleMouseOut}
//     >
//       {/* {overlayViewVisible && (
//         <OverlayView
//           position={{
//             lat: marker.lat,
//             lng: marker.lng
//           }}
//           mapPaneName={OverlayView.FLOAT_PANE}
//         >
//           <div
//             style={{
//               position: "absolute",
//               bottom: "calc(100% + 50px)",
//               left: -40,
//               background: "white",
//               padding: "20px",
//               borderRadius: "4px",
//               color: "black"
//             }}
//           >
//             {marker.label}
//           </div>
//         </OverlayView>
//       )} */}
//       {overlayViewVisible && (
//         <InfoWindow
//           position={{
//             lat: marker.lat,
//             lng: marker.lng
//           }}
//         >
//           <div className="custom-infowindow">
//             <div className="w50">
//               <p className="gray-title main-title">Makani No:</p>
//               <p className="gray-title">124 456 78</p>
//               <p className="main-title">Name:</p>
//               <p>My Alarm Name</p>
//             </div>
//             <div className="w50">
//               <p className="gray-title main-title">Emirates:</p>
//               <p className="gray-title">#124 87 5</p>
//               <p className="main-title">Address:</p>
//               <p>Falana at dhimkana dot com</p>
//             </div>
//           </div>
//         </InfoWindow>
//       )}
//     </Marker>
//   );
// });

// const MapMarker = ({ marker, clusterer }) => {
//   const [overlayViewVisible, setOverlayViewVisible] = useState(false);

//   function handleMouseOver() {
//     setOverlayViewVisible(true);
//   }

//   function handleMouseOut() {
//     setOverlayViewVisible(false);
//   }
//   console.log("Map Marker rendered.....");
//   return (
//     <Marker
//       position={{
//         lat: marker.lat,
//         lng: marker.lng
//       }}
//       icon={markerIconMapUrl[marker.alarmStatus]}
//       // animation={marker.alarmType === "red" ? 1 : 2}
//       animation={2}
//       clusterer={clusterer}
//       onMouseOver={handleMouseOver}
//       onMouseOut={handleMouseOut}
//     >
//       {/* {overlayViewVisible && (
//         <OverlayView
//           position={{
//             lat: marker.lat,
//             lng: marker.lng
//           }}
//           mapPaneName={OverlayView.FLOAT_PANE}
//         >
//           <div
//             style={{
//               position: "absolute",
//               bottom: "calc(100% + 50px)",
//               left: -40,
//               background: "white",
//               padding: "20px",
//               borderRadius: "4px",
//               color: "black"
//             }}
//           >
//             {marker.label}
//           </div>
//         </OverlayView>
//       )} */}
//       {overlayViewVisible && (
//         <InfoWindow
//           position={{
//             lat: marker.lat,
//             lng: marker.lng
//           }}
//         >
//           <div className="custom-infowindow">
//             <div className="w50">
//               <p className="gray-title main-title">Makani No:</p>
//               <p className="gray-title">124 456 78</p>
//               <p className="main-title">Name:</p>
//               <p>My Alarm Name</p>
//             </div>
//             <div className="w50">
//               <p className="gray-title main-title">Emirates:</p>
//               <p className="gray-title">#124 87 5</p>
//               <p className="main-title">Address:</p>
//               <p>Falana at dhimkana dot com</p>
//             </div>
//           </div>
//         </InfoWindow>
//       )}
//     </Marker>
//   );
// };

// const MapMarkers = ({ markers = [], clusterer }) => {
//   console.log("Map Markers Rendered...");
//   return markers.map(marker => (
//     <MapMarker key={marker.id} marker={marker} clusterer={clusterer} />
//   ));
// };

class MapMarkers extends PureComponent {
  render() {
    return this.props.markers.map(marker => (
      <MapMarker
        key={marker.id}
        marker={marker}
        clusterer={this.props.clusterer}
      />
    ));
  }
}

class HeatMap extends PureComponent {
  render() {
    return (
      <HeatmapLayer
        data={this.props.data}
        onLoad={() => console.log("Heatmap Loaded")}
      />
    );
  }
}

class GoogleMapDashboard extends PureComponent {
  
  constructor(props) {
    super(props);
    this.map = React.createRef();

    this.state = {
      endpoint: "http://127.0.0.1:4001",
      center: { lat: 37.775, lng: -122.434 },
      zoom: 2,
      mapMarkers: [],
      clusterMarkers: [],
      heatMapData: [
        new window.google.maps.LatLng(37.782, -122.447),
        new window.google.maps.LatLng(37.782, -122.445)
      ]
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on(SOCKET_GATEWAYS, data => {
      const clusterMarkers = data.gateways.filter(
        gateway =>
          gateway.alarmStatus === "white" || gateway.alarmStatus === "green"
      );
      const mapMarkers = data.gateways.filter(
        gateway =>
          gateway.alarmStatus === ALARM_STATUS_ORANGE ||
          gateway.alarmStatus === ALARM_STATUS_RED ||
          gateway.alarmStatus === ALARM_STATUS_BLUE
      );

      this.setState({ mapMarkers, clusterMarkers });
    });
  }

  // changeMarkerColor = () => {
  //   this.setState({
  //     mapMarkers: [
  //       {
  //         id: 1,
  //         label: "Dubai",
  //         lat: 25.204849,
  //         lng: 55.270782,
  //         alarmType: "red"
  //       },
  //       {
  //         id: 2,
  //         label: "Rawalpindi",
  //         lat: 33.565109,
  //         lng: 73.016914,
  //         alarmType: "blue"
  //       },
  //       {
  //         id: 3,
  //         label: "London",
  //         lat: 51.507351,
  //         lng: -0.127758,
  //         alarmType: "green"
  //       },
  //       {
  //         id: 4,
  //         label: "Canada",
  //         lat: 56.130367,
  //         lng: -106.346771,
  //         alarmType: "orange"
  //       },
  //       {
  //         id: 5,
  //         label: "Los Angles",
  //         lat: 34.052235,
  //         lng: -118.243683,
  //         alarmType: "red"
  //       }
  //     ]
  //   });
  // };

  // handleMapCenterChange = () => {
  //   const { lat, lng } = this.map.getCenter();
  //   this.setState({
  //     center: {
  //       lat: lat(),
  //       lng: lng()
  //     }
  //   });
  // };

  showOnlyMarkersWithinPolygon = () => {
    const regionPolygon = new window.google.maps.Polygon({
      paths: createPolygonCoords(DUBAI_WKT),
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#1E90FF",
      fillOpacity: 0
    });

    // const dubaiLatLng = new window.google.maps.LatLng(
    //   this.state.mapMarkers[0].lat,
    //   this.state.mapMarkers[0].lng
    // );
    // console.log(
    //   window.google.maps.geometry.poly.containsLocation(
    //     dubaiLatLng,
    //     regionPolygon
    //   )
    // );
    //    console.dir(regionPolygon);

    // console.log(
    //   regionPolygon.containsLocation(
    //     this.state.mapMarkers[0].lat,
    //     this.state.mapMarkers[0].lng
    //   )
    // );

    const markersWithinRegion = this.state.mapMarkers.filter(marker => {
      return window.google.maps.geometry.poly.containsLocation(
        new window.google.maps.LatLng(marker.lat, marker.lng),
        regionPolygon
      );
    });

    this.setState({ mapMarkers: markersWithinRegion });

    //console.log("Polygon created imperatively", regionPolygon);
  };

  showAllMarkers = () => {
    this.setState({ mapMarkers: allMarkers });
  };

  handleMapZoomChange = () => {
    this.setState({
      zoom: this.map.zoom
    });
  };
  // polygonOptions = paths => ({
  //   paths,
  //   strokeColor: "#FF0000",
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   fillColor: "#1E90FF",
  //   fillOpacity: 0.5
  // });

  render() {
    return (
      <>
        {/* <button onClick={this.changeMarkerColor}>Change</button> */}
        {/* <button onClick={this.showOnlyMarkersWithinPolygon}>
          Show Only Dubai Markers
        </button>
        <button onClick={this.showAllMarkers}>Show All Markers</button> */}
        <GoogleMap
          mapContainerStyle={{ height: "100vh", width: "100vw" }}
          mapContainerClassName="gm-overides"
          center={this.state.center}
          zoom={this.state.zoom}
          onLoad={map => (this.map = map)}
          onZoomChanged={this.handleMapZoomChange}
          options={{
            disableDefaultUI: true,
            styles: legacyMapTheme
          }}
        >
          {/* <HeatMap data={this.state.heatMapData} /> */}
          {this.state.mapMarkers.length > 0 && (
            <MarkerClusterer averageCenter maxZoom={12}>
              {clusterer => (
                <MapMarkers
                  markers={this.state.mapMarkers}
                  clusterer={clusterer}
                />
              )}
            </MarkerClusterer>
          )}
          {this.state.clusterMarkers.length > 0 && (
            <MarkerClusterer averageCenter maxZoom={30}>
              {clusterer => (
                <MapMarkers
                  markers={this.state.clusterMarkers}
                  clusterer={clusterer}
                />
              )}
            </MarkerClusterer>
          )}
          {this.state.paths && this.state.paths.DUBAI_POLYGON_PATH && (
            <Polygon
              paths={this.state.paths.DUBAI_POLYGON_PATH}
              options={polygonOptions}
              visible={this.state.zoom > 4}
            />
          )}
          {this.state.paths && this.state.paths.QATAR_POLYGON_PATH && (
            <Polygon
              paths={this.state.paths.QATAR_POLYGON_PATH}
              options={polygonOptions}
              visible={this.state.zoom > 4}
            />
          )}
        </GoogleMap>
      </>
    );
  }
}

export default GoogleMapDashboard;
