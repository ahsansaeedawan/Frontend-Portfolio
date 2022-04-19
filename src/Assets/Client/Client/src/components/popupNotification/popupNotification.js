import React from 'react';
import "./popupNotification.css";
import classNames from "classnames";
import "../toast/toast.css"



const PopupNotification = ({ show, onClose, data, onViewDetail }) => {
    function _onViewDetail(mac) {
        onViewDetail(mac);
    }
    return (
        <>

            {
                show &&
                <div className={`toast__content__container popup-container `}>
                    <i className="sf-icon i-modal-close --icon-close" onClick={() => onClose(data.mac)}
                    />
                    {/* 
                        <div className="--info">
                            <h3 className="--title">SLA BREACH </h3>
                        </div> 
                    */}


                    <div className="toast__message toast-message">
                        <h3 className="--next-action">SLA breach on <span>{data.prevAction}</span> Action </h3>
                        <h3 className="--mac">MAC: <span>{data.mac}</span></h3>
                        {/* <h3 className="--prev-action">Previous Action :<span>{data.prevAction}</span> </h3>
                            <h3 className="--prev-action">Previous Action Time: <span>{data.prevActionTime}</span></h3> */}
                        {/* <h3 className="--sla">SLA breach time: <span>{data.slaTime}</span></h3> */}
                    </div>
                    <div className="--action" >
                        <button className="btn btn-mini-primary --btn-details" onClick={() => _onViewDetail(data.mac)} >
                            View Details
                        </button>
                    </div>
                </div >
            }

        </>
    );
}

export default PopupNotification;


