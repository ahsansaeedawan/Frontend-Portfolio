import React, { useState } from "react";
import PropTypes from "prop-types";
import RadioInput from "../customInputs/radio";
import "./gatewayIncidentAcknowledged.css";
import Accordion from "../accordion/accordion";
import { logAmplitudeEvent } from "../../api";
import { OPERATIONS_COMMENT, OPERATIONS_VERIFY } from "../../constants/amplitude";

const GatewayIncidentAcknowledged = ({ onClick, gatewayId, status }) => {
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");

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
        logAmplitudeEvent({ event_type: OPERATIONS_VERIFY }).catch(() => { })
      })
      .catch(() => { })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (status === "verified") {
    return (
      <div className="event-action-container">
        <div>
          <Accordion
            panelClassName="operations-panel"
            iconClass="operations-accordion-icon abs-sf-icon"
            title="Alarm Condition"
            open
          >
            <div className="action-form">
              <div className="detail-fields-container">
                <RadioInput
                  onChange={e => {
                    setAction("comment");
                  }}
                  checked={action === "comment"}
                  label={"Comment"}
                  name="action"
                />

                <RadioInput
                  onChange={e => {
                    setAction("acknowledged");
                  }}
                  checked={action === "acknowledged"}
                  label={"Acknowledge Alarm"}
                  name="action"
                />

              </div>
            </div>
          </Accordion>
          <div className="details-form-input event-report-details">
            <label htmlFor="report-details">Report Details</label>
            <textarea
              id="report-details"
              type="text"
              className="detail-textarea"
              placeholder="Enter your comments"
              value={comments}
              onChange={e => setComments(e.target.value)}
            />
          </div>
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

GatewayIncidentAcknowledged.propTypes = {
  onClick: PropTypes.func
};

export default GatewayIncidentAcknowledged;
