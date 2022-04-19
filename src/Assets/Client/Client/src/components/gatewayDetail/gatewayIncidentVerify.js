import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import RadioInput from "../customInputs/radio";
import "./gatewayIncidentVerify.css";
import Accordion from "../accordion/accordion";
import { UserContext } from "../../context";
import InfoMessage from "../infoMessage/infoMessage";
import { GATEWAY_OPERATION_NOT_ASSIGNED } from "../../constants/messages";
function NoOperationToPerform() {
  return <InfoMessage message={GATEWAY_OPERATION_NOT_ASSIGNED} />;
}

export const VerifyAlarm = ({ onClick, gatewayId, status }) => {
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const user = useContext(UserContext);

  const handleOnClick = () => {
    if (!action) return;
    if (
      (action === "comment" && !comments) ||
      (action === "comment" && !comments.trim())
    ) {
      setComments("");
      return;
    }
    setSubmitting(true);
    onClick({ macAddress: gatewayId, action, comments })
      .then(() => {
        setComments("");
        setAction("");
      })
      .catch(() => { })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (user.permissions.cancelAlarm) {
    return (
      <div className="event-action-container verify-alarm">
        <label className="alarm-label">Incident Condition</label>
        <div className="action-form">
          <div className="detail-fields-container">
            <RadioInput
              onChange={(e) => {
                setAction("comment");
              }}
              checked={action === "comment"}
              label={"Comment"}
              name="step1Action"
            />

            {status === "incident" && user.permissions.verifyAlarm && (
              <RadioInput
                disabled={status === "verified"}
                onChange={(e) => {
                  setAction("verified");
                }}
                checked={action === "verified"}
                label={"Verified Incident Alert"}
                name="step1Action"
              />
            )}

            {status === "incident" && user.permissions.unverifyAlarm && (
              <RadioInput
                disabled={status === "unverified"}
                onChange={(e) => {
                  setAction("unverified");
                }}
                checked={action === "unverified"}
                label={"Unverified Incident Alert"}
                name="step1Action"
              />
            )}

            {status === "incident" && user.permissions.cancelAlarm && (
              <RadioInput
                onChange={(e) => {
                  setAction("falseAlarm");
                }}
                checked={action === "falseAlarm"}
                label={"False Incident Alert"}
                name="step1Action"
              />
            )}
          </div>
        </div>
        <div className="details-form-input event-report-details">
          <label htmlFor="report-details">Report Details</label>
          <textarea
            id="report-details"
            className="detail-textarea"
            placeholder="Enter your comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button
          onClick={handleOnClick}
          disabled={submitting || !action || (comments === "" && action === "comment")}
          className="btn-action-submit"
        >
          Submit
        </button>
      </div>
    );
  }

  return null;
};

export const AcknowledgeAlarm = ({ onClick, gatewayId, status }) => {
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const user = useContext(UserContext);

  const handleOnClick = () => {
    if (!action) return;
    if (
      (action === "comment" && !comments) ||
      (action === "comment" && !comments.trim())
    ) {
      setComments("");
      return;
    }
    setSubmitting(true);
    onClick({ macAddress: gatewayId, action, comments })
      .then(() => {
        setComments("");
        setAction("");
      })
      .catch(() => { })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if ((status === "verified" || status == "unverified") && user.permissions.acknowledgeAlarm) {
    return (
      <div className="event-action-container verify-alarm">
        <label className="alarm-label">Alarm Condition</label>
        <div className="action-form">
          <div className="detail-fields-container">
            <RadioInput
              onChange={(e) => {
                setAction("acknowledged");
              }}
              checked={action === "acknowledged"}
              label={"Acknowledge Incident Alert"}
              name="action"
            />
          </div>
        </div>
        <div className="details-form-input event-report-details">
          <label htmlFor="report-details">Report Details</label>
          <textarea
            id="report-details"
            className="detail-textarea"
            placeholder="Enter your comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button
          onClick={handleOnClick}
          disabled={submitting || !action}
          className="btn-action-submit"
        >
          Submit
        </button>
      </div>
    );
  }

  return null;
};
