import React from "react";

export const MiniDangerButton = ({
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
      className="btn btn-mini-danger"
      disabled={disabled}
    >
      {title}
    </button>
  );
};
