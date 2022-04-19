import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";

// import cancelImage from "";
import "./CancelRequestModal.scss";

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

const CancelRequestModal = props => {
    const [comment, setComment] = useState('');

    const updateComment = () => {
        props.comment(comment);
        setComment('');
    }

    const closeModal = () => {
        props.closemodal(false);
        setComment('');
    }

    return (
        <Modal
            isOpen={props.modalIsOpen}
            // onRequestClose={props.closeModal}
            contentLabel="Cancel Request Modal"
            closeTimeoutMS={200}
            style={customStyles}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc
        >
            <div className="__modal-header">
                <h3>Cancel request</h3>
                <i onClick={() => closeModal()} className="sf-icon i-modal-close" />
            </div>
            <div className="__modal-wrap">
                {/* <div className="__img-wrapper">
                    <img className="cancel-logo" src={`https://img.icons8.com/color/344/info--v1.png`} width="85" height="85" alt="" />
                </div> */}
                <div className="__wrapper">
                    <div>
                        <textarea
                            className="text-area"
                            placeholder="Remember, be nice!"
                            rows="4"
                            name='comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}>
                        </textarea>
                    </div>
                    <button onClick={() => updateComment()} disabled={!comment}>Cancel request</button>
                </div>
            </div>
        </Modal >
    );
};

CancelRequestModal.propTypes = {
    modalIsOpen: PropTypes.bool.isRequired,
    // closeModal: PropTypes.func.isRequired
};

export default CancelRequestModal;
