import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { UserSettingPassword } from "../userSettingPassword";

import StudentImageSrc from "../../assets/images/student.svg";
import "./userSettingsModal.css";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "25px",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "10px"
  },
  overlay: {
    background: "rgba(0,0,0,0.8)"
  }
};

const UserSettingsModal = props => {
  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      contentLabel="User Settings Modal"
      closeTimeoutMS={200}
      style={customStyles}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc
    >
      <div className="user-settings-modal">
        <div className="user-settings-modal-header">
          <h2 className="title">
            <img className="student-logo" src={StudentImageSrc} alt="" />
            User Setting
            <i onClick={props.closeModal} className="sf-icon i-modal-close" />
          </h2>
        </div>
        <UserSettingPassword />
      </div>
    </Modal>
  );
};

UserSettingsModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default UserSettingsModal;
