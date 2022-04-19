import React from "react";
import "./viewOrganizationDetailItem.css";

const DetailItem = (heading, value) => {
  return (
    <div className="org-detail-row">
      <div className="org-column-heading">
        <h2>{heading}</h2>
      </div>
      <div className="org-col-content">
        <p>{value}</p>
      </div>
    </div>
  );
};

export default DetailItem;
