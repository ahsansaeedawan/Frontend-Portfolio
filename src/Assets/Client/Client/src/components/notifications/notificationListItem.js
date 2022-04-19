import React from 'react';
import Moment from "react-moment";
import classNames from 'classnames';
import "./notificationListItem.css"

export const NotificationListItem = ({ notification, onViewDetail }) => {
    const alarmType = {
        duressCode: "high",
        empty: "low"
    };
    function _onViewDetail() {
        onViewDetail(notification.mac);
    }
    let arr = [];
    let alarmPriority = "";
    let isDescription = notification.description ?? false;
    isDescription && arr.push(notification.description.split(","))
    for (let obj of arr) {
        if (obj.includes("Duress Alert")) alarmPriority = alarmType.duressCode;
        else alarmPriority = alarmType.empty;
    }
    return (
        < li className={classNames(alarmPriority)}>
            <div className="--info">
                <h3 className="--title">{notification.event}</h3>
                {isDescription && notification.description.split(",").map((i, data) => {
                    if (data === 0) return < p className="--desc" key={`${notification.mac}-${data}-${notification.createdAt}`}
                    >  {i}</p>
                    if (data === 1) return < p className="--desc" key={`${notification.mac}-${data}-${notification.createdAt}`}
                    >Role: {i}</p>
                })}
                <h3 className="--mac">{notification.mac}</h3>
            </div>
            <div className="--details">
                <Moment className="--time abs-sf-icon i-time" local fromNow>
                    {notification.createdAt}
                </Moment>
                <button
                    onClick={_onViewDetail}
                    className="btn btn-mini-primary --btn-details"
                >
                    View Details
          </button>
            </div>
        </li >
    );
};