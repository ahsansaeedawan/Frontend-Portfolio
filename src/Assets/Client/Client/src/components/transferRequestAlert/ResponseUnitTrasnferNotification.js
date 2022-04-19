import React, { useState, useEffect } from 'react';
import cn from "classnames";
import "./responseUnitTrasnferNotification.css";
import ResponseUnitTrasferRequestCard from './responseUnitTrasferRequestCard/ResponseUnitTrasferRequestCard';
import { useSelector, useDispatch } from 'react-redux';
import InfoMessage from '../infoMessage/infoMessage';
import { cancelResponseUnitTransferAlarmRequest, transferAlarmRequest } from '../../api';
import CancelRequestModal from './CancelRequestModal/CancelRequestModal';

const ResponseUnitTrasnferNotification = ({ onViewDetail }) => {

    const [responseUnitRequestData, setResponseUntitRequestData] = useState([]);
    const [cancelTransferRequestData, setCancelTransferRequestData] = useState(null);
    const [isReason, setReason] = useState(false);

    // const dispatch = useDispatch();

    const { transferRequestNotifications } = useSelector(state => state.transferAlarmReducer);


    // Transfer Alaram request API 
    useEffect(() => {
        async function fetchApiTrasferRequest() {
            try {
                const res = await transferAlarmRequest();
                (res.data.data && res.data.data.length) && 
                    setResponseUntitRequestData(res.data.data)
            } catch (error) {

            }
        };
        fetchApiTrasferRequest();

    }, []);

    // Handling Datata from socket events for new transfer request
    useEffect(() => {
        (transferRequestNotifications && transferRequestNotifications.alarmId) &&
            setResponseUntitRequestData(prevData => [...prevData, transferRequestNotifications])
    }, [transferRequestNotifications]);




    const updateComment = async (value) => {
        cancelTransferRequestData.comments = value;
        try {
            const cancelRequest = await cancelResponseUnitTransferAlarmRequest(cancelTransferRequestData);
        } catch (error) {
            console.log("cancel alarm request eerror ", error.message)
        }
        setReason(false);
        setResponseUntitRequestData(responseUnitRequestData.filter((data, i) => data.responseUnitId !== cancelTransferRequestData.responseUnitId));
    }

    function onConfirm(cancelData) {
        setResponseUntitRequestData(responseUnitRequestData.filter((data, i) => data.responseUnitId !== cancelData.responseUnitId));
    }

    async function onClose(cancelData) {
        setReason(true);
        let alaramCancelData = {
            comments: '',
            alarmId: cancelData.alarmId,
            responseUnitId: cancelData.responseUnitId
        }
        setCancelTransferRequestData(alaramCancelData);
    }



    return (
        <>
            <CancelRequestModal modalIsOpen={isReason} comment={(e) => updateComment(e)} onRequestClose={() => setReason(false)} closemodal={(val) => setReason(val)} />
            <div className={cn("transfer-notificaiton-container", { "view": responseUnitRequestData.length })} >
                <div className="transfer-notificaiton-heading">
                    <h2>Response unit's transfer request</h2>
                </div>
                <div className="box-wrap">
                    {
                        responseUnitRequestData.length ?
                            responseUnitRequestData.map((data, index) => (
                                <>
                                    <ResponseUnitTrasferRequestCard onConfirm={(name) => onConfirm(name)} onClose={(name) => onClose(name)} data={data} onViewDetail={onViewDetail} key={`${data.responseUnitName}` + `${index}`} />
                                    <br />
                                </>
                            ))
                            : <InfoMessage message={"No Response units transfer request"} />
                    }
                </div>
            </div>
        </>
    );

}

export default ResponseUnitTrasnferNotification;