import React, { useState, useContext } from "react";
import { UserContext } from "../../context";
import "./closeAlarm.css";

export const CloseAlarm = ({ onClick, mac, status }) => {
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState("");
  const user = useContext(UserContext);

  const handleOnClick = () => {
    setSubmitting(true);
    onClick({ macAddress: mac, action: "close", comments: comments.trim() })
      .then(() => { })
      .catch(() => {
        setSubmitting(false);
      });
  };

  if (status === "acknowledged" && user.permissions.closeAlarm) {
    return (
      <div className="event-action-container close-alarm">
        <div className="details-form-input">
          <label htmlFor="incident-details">Incident Report</label>
          <textarea
            id="incident-details"
            className="detail-textarea"
            placeholder="Enter details"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button
          onClick={handleOnClick}
          disabled={submitting}
          className="btn-action-submit"
        >
          Submit and Close
        </button>
      </div>
    );
  }

  return null;
};
