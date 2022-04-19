import React, { useState, useEffect } from "react";
import classNames from "classnames";

import "./loadingMask.css";

export const LoadingMask = props => {
  const [extendedLoading, setExtendedLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExtendedLoading(true);
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div className="pre-loader" style={props.style}>
      <div
        className={classNames("lds-ring", {
          "extended-loading": extendedLoading
        })}
      >
        <div />
        <div />
        <div />
        <div />
      </div>
      <p
        className={classNames("extended-loading-detail", {
          visible: extendedLoading
        })}
      >
        <br/><br/><br/><br/><br/><br/>
        Please wait, we are working on your request...
      </p>
    </div>
  );
};