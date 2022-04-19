import React from "react";
import PropTypes from "prop-types";
import "./adminHeader.css";

const AdminHeader = ({ title }) => {
  return (
    <div className="admin-header">
      <h2 className="title">{title}</h2>
    </div>
  );
};

AdminHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default AdminHeader;
