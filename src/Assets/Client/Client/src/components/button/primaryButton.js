import React from "react";

export const PrimaryButton = ({
  onClick,
  title,
  type = "button",
  style,
  disabled
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={style}
      className="btn-form-action primary-btn"
      disabled={disabled}
    >
      {title}
    </button>
  );
};
