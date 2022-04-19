import React, { useContext, useState } from "react";
import { useSelector } from 'react-redux';

import { MiniPrimaryButton } from "../button";
import CircularProgressBar from "../circularProgressBar/circularProgressBar";
import { UserContext } from "../../context";
import { validateRole } from "../../utils/commonUtil";
const GatewayAgentAssignment = ({
    status,
    safeTime,
    safeTimePassed,
    timeElapsed,
    onAssign,
    onUnAssign,
    assigned,
    disabled,
    macAddress
}) => {
    // context
    const { disableAssignOperation } = useSelector(state => state.appSetting);//getting the updated state of disableAssignOperation from store
    const { permissions } = useSelector(state => state.user); //getting logged user's role 
    const { callInProgressMac } = useSelector(state => state.callWidgetReducer)
    const [callInProgress, setCallInProgress] = useState(false);

    const user = useContext(UserContext);
    if (disableAssignOperation)
        return null;

    if (status === "idle" || status === "armed")
        return null;

    // if (status !== "incident" && status !== "verified" && validateRole(user.role)) { // we are now displaying assignment info when gateway is in acknowledge state 
    //     return null;
    // }

    //if (status === "verified" && assigned) return null;
    const percentComplete = Math.round((timeElapsed / safeTime) * 100);
    let actionBtnTitle = "Assign";
    let actionBtnOnClick = onAssign;
    let assignedTo = assigned && `Assigned to: ${assigned.agentName}`;

    if (assigned && assigned.id === user._id) {
        actionBtnTitle = "Unassign";
        actionBtnOnClick = onUnAssign;
        assignedTo = "Assigned to You";
    }

    if (macAddress === callInProgressMac && status === "incident") {
        actionBtnTitle = "Call is in Progress";
        setCallInProgress(true);
    }

    return (
        <div className="agent-alarm-assignment">

            <div className="progress-status">
                {!safeTimePassed && (
                    <>
                        <div className="progress-circle-container">
                            <CircularProgressBar
                                size={16}
                                strokeWidth={2}
                                percentage={percentComplete}
                            />
                        </div>
                        <p className="status">{`You will be able to assign after ${safeTime - timeElapsed}s`}</p>
                    </>
                )}
                {safeTimePassed && assignedTo && <p className="status">{assignedTo}</p>}
            </div>
            {
                (status === 'incident') || (status === "unverified") || (status === 'verified' && permissions.response) ?
                    < MiniPrimaryButton
                        onClick={actionBtnOnClick}
                        disabled={!safeTimePassed || disabled || callInProgress}
                        title={actionBtnTitle}
                    />
                    : null

            }
        </div>
    );
}

export default GatewayAgentAssignment;