import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FilterGateway from "./filterGateway";

import "./filter.css";

Filter.propTypes = {
  open: PropTypes.bool
};

function Filter({ open, showAllGateways, onShowAllGatewayChange }) {
  return (
    <div className={classNames("filters-container", { visible: open })}>
      <FilterGateway
        showAllGateways={showAllGateways}
        onChange={onShowAllGatewayChange}
      />
    </div>
  );
}

export default Filter;
