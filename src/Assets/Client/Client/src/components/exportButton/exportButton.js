import React from "react";
import classNames from "classnames";
import "./exportButton.css";

const ExportButton = ({ style, className, onClick }) => {
  return (
    <button
      className={classNames("btn-excel-export", classNames)}
      style={style}
      onClick={onClick}>
      <i className="sf-icon i-excel-export" />
    </button>
  );
};

export default ExportButton;
