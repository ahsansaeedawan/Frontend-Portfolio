import React from "react";
import cn from "classnames";
import { confirmAlert } from "react-confirm-alert";
import { DEFAULT_CONFIRMATION_ALERT_MESSAGE } from "../../constants/messages";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./confirmationAlert.css";

const confirmationAlert = ({
  title,
  message,
  onConfirm,
  confirmBtnText,
  cancelBtnText,
  confirmMessage,
  iconClass,
  containerClass,
}) =>
  confirmAlert({
    closeOnClickOutside: false,
    customUI: ({ onClose }) => {
      function closeAlert() {
        onClose();
      }
      function confirmAlert() {
        onConfirm();
        onClose();
      }

      return (
        <div className={cn("confrim-alert-container", containerClass)}>
          <div className="alert-left-panel">
            <div className="outer-circle">
              <div className="inner-circle">
                <i className={cn("sf-icon", iconClass)} />
              </div>
            </div>
          </div>
          <div className="alert-right-panel">
            <div className="alert-header">
              <i onClick={closeAlert} className="sf-icon i-modal-close" />
              <h2>{title ? title : "Confirm"}</h2>
            </div>
            <div className="alert-body">
              <p>{message ? message : DEFAULT_CONFIRMATION_ALERT_MESSAGE}</p>
              {confirmMessage && (
                <p className="confirm-message">{confirmMessage}</p>
              )}
            </div>
            <div className="alert-actions">
              <button onClick={confirmAlert} className="alert-btn-confirm">
                {confirmBtnText ? confirmBtnText : "Confirm"}
              </button>
              <button onClick={closeAlert} className="alert-btn-cancel">
                {cancelBtnText ? cancelBtnText : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      );
    },
  });

export default confirmationAlert;
