import React from "react";
import "./routeDetail.css";
import RealTime from "../../assets/images/tripdetail.png";
const AddressDetails = ({ destinationAddress, initialAddress }) => {
  return (
    <div className="address-detail-container">
      <h4>Address Details</h4>

      <div className="route-info">
        <h2 className="heading">Destination Address</h2>
        <span className="address">{destinationAddress}</span>
      </div>
      <div className="route-info">
        <h2 className="heading initial">Initial Address</h2>
        <span className="address">{initialAddress}</span>
      </div>
    </div>
  );
};

const InitialAndArrivalTime = ({ initialTime, arrivalTime }) => {
  return (
    <div className="time-details-container">
      <h4>Initial and Arrival Time</h4>
      <div className="details-body">
        <div className="time-detail">
          <i className="sf-icon i-wall-clock " />
          <span>{initialTime}</span>
        </div>
        <div className="time-detail  ">
          <i className="sf-icon i-wall-clock " />
          <span >{arrivalTime}</span>
        </div>
      </div>
    </div>
  );
};

const TimeAndDistance = ({ actualDistance, time }) => {
  return (
    <div className="time-details-container">
      <h4>Actual Distance and Time</h4>
      <div className="details-body">
        <div className="time-detail">
          <i className="sf-icon i-map-distance-outline " />
          <span>{actualDistance}</span>
        </div>
        <div className="time-detail">
          <i className="sf-icon i-map-time-outline" />
          <span className="margin-zero">{time}</span>
        </div>
      </div>
    </div>
  );
};

const RealTimeDetail = ({ media }) => {
  return (
    <div className="realtime-trip-container">
      <h4>Realtime Trip Details</h4>
      <div className="media">
        <img src={RealTime} alt="" />
      </div>
    </div>
  );
};

const RouteDetails = ({
  destinationAddress,
  initialAddress,
  initialTime,
  arrivalTime,
  actualDistance,
  time,
}) => {

  return (
    <div className="route-detail-container">
      <h3>Route Details</h3>
      <AddressDetails
        destinationAddress={destinationAddress}
        initialAddress={initialAddress}
      />
      <InitialAndArrivalTime
        initialTime={initialTime}
        arrivalTime={arrivalTime}
      />
      <TimeAndDistance actualDistance={actualDistance} time={time} />
      {/* <RealTimeDetail /> */}
    </div>
  );
};

export default RouteDetails;
