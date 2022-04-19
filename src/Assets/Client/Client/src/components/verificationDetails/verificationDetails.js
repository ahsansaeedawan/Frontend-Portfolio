import React from "react";
import "./verificationDetails.css";

const VerificationDetails = ({ name, message, time }) => {
    return (
        <div className="verification-details">
            <h3>{name}</h3>
            <div className="verification-information">
                <span
                    className="vehicle-current-status">
                    Verify Alarm
                </span>
                <p>{message}</p>
                <span>{time}</span>
            </div>
        </div>
    );


}

export default VerificationDetails;