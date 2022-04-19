import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";

const CLOSE_TIMEOUT = 500;

export default function ReactSlidingPane({
  isOpen,
  title,
  subtitle,
  onRequestClose,
  onAfterOpen,
  children,
  className,
  overlayClassName,
  closeIcon,
  from = "right",
  width,
  ...rest
}) {
  const directionClass = `slide-pane_from_${from}`;
  return (
    <Modal
      className={`slide-pane ${directionClass} ${className || ""}`}
      style={{
        content: { width: width || "80%" }
      }}
      overlayClassName={`slide-pane__overlay ${overlayClassName || ""}`}
      closeTimeoutMS={CLOSE_TIMEOUT}
      isOpen={isOpen}
      {...rest}
    >
      {children}
    </Modal>
  );
}

ReactSlidingPane.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.any,
  subtitle: PropTypes.any,
  onRequestClose: PropTypes.func,
  onAfterOpen: PropTypes.func,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  from: PropTypes.oneOf(["left", "right", "bottom"]),
  width: PropTypes.string,
  closeIcon: PropTypes.any
};
