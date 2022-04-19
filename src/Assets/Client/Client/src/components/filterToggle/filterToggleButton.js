import React from "react";
import PropTypes from "prop-types";

import classNames from "classnames";

import "./filterToggle.css";

function FilterToggleButton({ onClick, filterOpen }) {
  return (
    <button
      className={classNames("filter-toggle-btn", {
        "toggle-active": filterOpen
      })}
      onClick={onClick}
    >
      <i className="sf-icon i-filter-results" />
    </button>
  );
}

FilterToggleButton.propTypes = {
  onClick: PropTypes.func
};

export default FilterToggleButton;
