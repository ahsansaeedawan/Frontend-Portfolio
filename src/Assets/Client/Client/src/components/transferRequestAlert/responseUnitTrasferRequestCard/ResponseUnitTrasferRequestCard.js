import React, { useState } from 'react';
import "./responseUnitTrasferRequestCard.css";
import "../../toast/toast.css"
import { unassignAlarm } from '../../../api';
import { error, success } from "../../../components/toast";
import { getErrorMessage } from "../../../utils/commonUtil";
import { ALARM_UNASSIGN_SUCCEESS } from "../../../constants/status";



const ResponseUnitTrasferRequestCard = ({ onClose, data, onViewDetail, showReason, onConfirm }) => {

    const [loading, setLoading] = useState(false)
    async function _onViewDetail(mac, id, unit) {
        try {
            setLoading(true);
            const data = await unassignAlarm(mac, id);
            if (data) {
                success(ALARM_UNASSIGN_SUCCEESS);
            }
            setLoading(false);
        } catch (e) {
            error(getErrorMessage(e));
        }
        onViewDetail(mac);
        onConfirm(data)
    }

    return (
        <>
            {
                <div className={`toast__content__container popup-container `}>
                    <div className="__content">
                        <h3 className="--next-action">Gateway: <span>{data.mac}</span></h3>
                        <h3 className="--mac">Responder: <span>{data?.responseUnitName}</span></h3>
                        <h3 className="--mac">Comments: <q><b>{data?.comments}</b></q></h3>
                    </div>
                    <div className="__action-btns">
                        <button className="btn btn-mini-primary --btn-details" onClick={() => _onViewDetail(data.mac, data.responseUnitId, data.responseUnitName)} >
                            Confirm
                        </button>
                        <button className="btn btn-mini-danger --btn-details" onClick={() => onClose(data)}  >
                            Cancel
                        </button>
                    </div>
                </div >
            }

        </>
    );
}

export default ResponseUnitTrasferRequestCard;


