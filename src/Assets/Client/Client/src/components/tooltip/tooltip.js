import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

function Tooltip(props) {
  if (!props.children) return null;
  const { effect = "solid", type = "info", place = "top", id } = props;
  const clonedChildren = React.cloneElement(props.children, {
    "data-for": id,
    "data-tip": props.content
  });
  return (
    <>
      {clonedChildren}
      <ReactTooltip place={place} id={id} type={type} effect={effect} />
    </>
  );
}

Tooltip.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  effect: PropTypes.string,
  type: PropTypes.string,
  place: PropTypes.string
};

export default Tooltip;
