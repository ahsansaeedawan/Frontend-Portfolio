import React from 'react';

const NotificationBell = ({ onClick }) => {
    return (
        <button onClick={onClick} className="--bell">
            <div className="--trigger">
                <i className="sf-icon i-trigrd i-alarm notification-bell"></i>
            </div>
            <div className="--dots">
                <div className="--dot"></div>
                <div className="--dot"></div>
                <div className="--dot"></div>
            </div>
        </button>
    );
};

export default NotificationBell;