import React from "react";
import RadioInput from "../customInputs/radio";

export default function VerifyIncident() {
  return (
    <div className="event-action-container">
      <div className="action-form">
        <fieldset className="detail-fieldset">
          <legend>Alarm Condition</legend>
          <div className="detail-fields-container">
            <RadioInput
              onChange={e => {
                console.log(e.target);
              }}
              label={"No Action"}
              name="action"
            />
            <RadioInput
              onChange={e => {
                console.log(e.target);
              }}
              label={"Cancel Alarm"}
              name="action"
            />
            <RadioInput
              onChange={e => {
                console.log(e.target);
              }}
              label={"Verify Alarm"}
              name="action"
            />
          </div>
        </fieldset>
        <div className="details-form-input event-report-details">
          <label htmlFor="report-details">Report Details</label>
          <input
            id="report-details"
            type="text"
            className="detail-input"
            placeholder="Enter Text"
          />
        </div>
      </div>
      <button className="btn-action-submit">Submit</button>
    </div>
  );
}
