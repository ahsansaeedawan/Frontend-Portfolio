import React from 'react';
import "./badge.css";

const Badge = ({ status }) => {
    return (
        <div className="badge">
            <span>{status}</span>
        </div>
    );
}

export default Badge;
