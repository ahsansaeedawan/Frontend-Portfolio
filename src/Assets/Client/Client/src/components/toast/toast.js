import React from "react";
import PropTypes from "prop-types";

import "./toast.css";

const toastIconMapClass = {
  info: "icon__info",
  warning: "icon__info",
  error: "icon__error",
  success: "icon__success"
};

function Toast({ onClose, type, message }) {
  return (
    <div className={`toast__content__container ${type}`}>
      <i onClick={onClose} className="toast__icon icon__close" />
      <div className="toast__status__icon">
        <i
          className={`toast__icon ${toastIconMapClass[type] || "icon__info"}`}
        />
      </div>
      <div className="toast__message">
        <p>{message}</p>
      </div>
    </div>
  );
}

Toast.defaultProps = {
  type: "info"
};

Toast.propTypes = {
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["info", "warning", "error", "success"]).isRequired
};

export default Toast;
