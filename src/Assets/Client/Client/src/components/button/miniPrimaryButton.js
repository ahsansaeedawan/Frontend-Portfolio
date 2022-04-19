import React from "react";

export const MiniPrimaryButton = ({
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
      className="btn btn-mini-primary"
      disabled={disabled}
    >
      {title}
    </button>
  );
};
