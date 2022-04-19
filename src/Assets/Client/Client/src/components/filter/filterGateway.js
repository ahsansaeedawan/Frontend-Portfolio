import React from "react";

import { EventCheckbox } from "../menuSearch/menuSearch";

import "./filterGateway.css";

const FilterGateway = ({ showAllGateways, onChange }) => {
  return (
    <div className="filter-gateway">
      <span className="f-gateway-label">Show All Gateways</span>
      <EventCheckbox
        id="event-toggle-checkbox"
        checked={showAllGateways}
        onChange={onChange}
      />
    </div>
  );
};

FilterGateway.propTypes = {};

export default FilterGateway;
