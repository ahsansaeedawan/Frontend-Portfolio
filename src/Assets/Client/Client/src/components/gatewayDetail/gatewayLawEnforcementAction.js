import React, { useState, useContext } from 'react';
import { UserContext } from '../../context';
import RadioInput from "../customInputs/radio";
import ContegrisCall from '../VoipCall/ContegrisCall';



const LawEnforcementAction = ({ onClick, gatewayId, status, assignedAgent }) => {
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
    if (status === "acknowledged" && user.permissions.lawEnforcement) {
        return (
            <div className="event-action-container verify-alarm">
                <label className="alarm-label">Local Authorities Engagement</label>
                <div className="action-form">
                    <div className="detail-fields-container">
                        <div style={{ display: "flex" }}>
                            <RadioInput
                                onChange={(e) => {
                                    setAction("lawEnforcement");
                                }}
                                checked={action === "lawEnforcement"}
                                label={"Local Authorities Engaged"}
                                name="action"
                            />
                            <ContegrisCall intelliconUser={user} assignedAgent={assignedAgent} />
                        </div>
                        <RadioInput
                            onChange={(e) => {
                                setAction("communicatedImc");
                            }}
                            checked={action === "communicatedImc"}
                            label={"Local Authorities Engaged Communicated with IMC"}
                            name="action"
                        />

                    </div>

                </div>
                <div className="details-form-input event-report-details">
                    <label htmlFor="report-details">Details</label>
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

export default LawEnforcementAction;