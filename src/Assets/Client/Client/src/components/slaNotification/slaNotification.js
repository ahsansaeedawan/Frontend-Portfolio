import React, { useState, useEffect } from 'react';
import cn from "classnames";
import "./slaNotification.css";
import PopupNotification from '../popupNotification/popupNotification';
import { useSelector } from 'react-redux';
import InfoMessage from '../infoMessage/infoMessage';
import { voilatedSLARequest } from '../../api';
import { LoadingMask } from "../loadingMask";

const SlaNotification = ({ onViewDetail }) => {
    const [open, setOpen] = useState(true);
    const [close, setClose] = useState(true);
    const [notificatioData, setNotificationData] = useState([]);
    const [metaData, setMetaData] = useState(null);
    const [total, setTotal] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slaNotification } = useSelector(state => state.notification)

    // SLA voilation request API 
    useEffect(() => {
        async function fetchApiSLAvoilationRequest() {
            try {
                const page = 1;
                const res = await voilatedSLARequest(page);
                setMetaData(res.data.data.metadata[0]);
                setTotal(res.data.data.slaRecord.length);
                res.data.data && setNotificationData(res.data.data.slaRecord);
            } catch (error) { }
        };
        fetchApiSLAvoilationRequest();
    }, []);

    // Handling sla voilation event for new sla-voilation
    useEffect(() => {
        slaNotification && slaNotification.alarmId && setNotificationData(prevData => [...prevData, slaNotification]);
    }, [slaNotification])

    function toggleMenu() {
        setOpen(!open);
    }

    function onClose(mac, index) {
        setNotificationData(notificatioData.filter((gateway, i) => i !== index)); //TODO need to update its logic 
    }

    async function loadMoreData() {
        let { page } = metaData;
        setMetaData(prevPage => prevPage++);
        try {
            setLoading(true);
            const res = await voilatedSLARequest(++page);
            setMetaData(res.data.data.metadata[0]);
            setTotal(res.data.data.slaRecord.length);
            res.data.data && setNotificationData(res.data.data.slaRecord);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={cn("sla-notifications-container", { "open": open })} >
                <button onClick={toggleMenu} className="menu-open-btn">
                    <img src="/assets/icons/chevron-down-white-panel.png" alt="v" />
                </button>
                <div className="sla-notificaiton-heading">
                    <h2>Service Level's Violation</h2>
                </div>
                <div className="box-wrap">
                    {loading && <LoadingMask style={{ position: 'absolute' }} />}
                    {
                        notificatioData.length ?
                            notificatioData.map((data, index) => (

                                <>
                                    <PopupNotification show={close} onClose={(mac) => onClose(mac, index)} data={data} onViewDetail={onViewDetail} key={`${data._id}` + `${index}`} />
                                    <br />
                                </>
                            ))
                            : <InfoMessage message={"No Service Level Notification"} />
                    }
                    {
                        (total && notificatioData.length) ?
                            <div className="--load-more-btn-wrap">
                                <button onClick={() => loadMoreData()} className="btn btn-mini-primary --btn-load-more">
                                    Load More
                                </button>
                            </div> : null
                    }
                </div>
            </div>
        </>
    );

}

export default SlaNotification;