import React from "react";

export const SettingBox = ({ title, iconPath, children }) => {
  return (
    <div className="setting-box-container">
      <div className="box-details">
        <img className="box-icon" src={iconPath} alt="" />
        <h2>{title}</h2>
      </div>
      <div className="box-separator"></div>
      <div className="box-body">{children}</div>
    </div>
  );
};
