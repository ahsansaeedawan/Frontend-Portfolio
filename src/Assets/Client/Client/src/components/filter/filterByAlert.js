import React from "react";

import "./filterByAlert.css";

function FilterByAlert(props) {
  return (
    <div className="filter-by-alert">
      <div className="filter-checkbox">
        <input type="checkbox" id="alarm" />
        <label htmlFor="alarm" className="checkbox-toggle orange">
          <span className="f-icon-container">
            <i className="sf-icon i-alarm" />
          </span>
          <span className="f-chkbx-lbl">Orange</span>
        </label>
      </div>
      <div className="filter-checkbox">
        <input type="checkbox" id="alert" />
        <label htmlFor="alert" className="checkbox-toggle red">
          <span className="f-icon-container">
            <i className="sf-icon i-alert" />
          </span>
          <span className="f-chkbx-lbl">Red</span>
        </label>
      </div>
      <div className="filter-checkbox">
        <input type="checkbox" id="police" />
        <label htmlFor="police" className="checkbox-toggle blue">
          <span className="f-icon-container">
            <i className="sf-icon i-police" />
          </span>
          <span className="f-chkbx-lbl">Blue</span>
        </label>
      </div>
    </div>
  );
}

FilterByAlert.propTypes = {};

export default FilterByAlert;
