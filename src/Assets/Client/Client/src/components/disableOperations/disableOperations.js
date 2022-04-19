import React from "react";

import "./disableOperations.css";

export const DisableOperations = props => {
    return (
        <div className="pre-loader non-fixed" style={props.style}>
            <div>
                <div />
                <div />
                <div />
                <div />
            </div>
            <p className="extended-loading-detail" >
                Please assign this alarm to yourself first and then you will be able to perform operations on the alarm....
      </p>
        </div>
    );
};
