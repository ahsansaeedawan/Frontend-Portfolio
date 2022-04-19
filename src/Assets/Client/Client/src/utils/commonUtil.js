import React from "react"

export function nameThumbnailColumnFormatter(cell, row) {
  if (typeof row.first_name === "string" && Boolean(row.first_name[0])) {
    return (
      <div className="data-table-name-thumbnail">
        {row.first_name[0].toUpperCase()}
      </div>
    );
  }
  return null;
}

export function nameColumnFormatter(cell, row, rowIndex) {
  return (
    <div className="data-table-info">
      {typeof row.first_name === "string" && Boolean(row.first_name[0]) && (
        <div className="data-table-name-thumbnail">
          {row.first_name[0].toUpperCase()}
        </div>
      )}
      <span className="name">{`${row.first_name} ${row.last_name}`}</span>
    </div>
  );
}
export function nameColumnFormatterOrg(cell, row, rowIndex) {
  return (
    <div className="data-table-info">
      {typeof cell === "string" && Boolean(cell[0]) && (
        <div className="data-table-name-thumbnail">{cell[0].toUpperCase()}</div>
      )}
      <span className="name">{cell}</span>
    </div>
  );
}


export const sortGatewaysByUpdatedAt = (a, b) => {
  return new Date(parseInt(b.updatedAt)) - new Date(parseInt(a.updatedAt));
};

export const canAccessRoute = (currentRoles, authorizedRoles) => {
  let canAccess = false;
  for (let i = 0; i < authorizedRoles.length; i++) {
    if (authorizedRoles.includes(currentRoles[i])) {
      canAccess = true;
      break;
    }
  }
  return canAccess;
};

export const getErrorMessage = error => {
  return error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;
};



export const validateRole = (role) => {
  let flag = false;
  role.map((e) => {
    if (["MONITORING_ADMIN", "MONITORING_AGENT"].includes(e)) {
      flag = true;
      return;
    }
    if (["MONITORING_AGENT", "RESPONSE_AGENT"].includes(e)) {
      flag = false;
      return;
    }
    if (["MONITORING_ADMIN", "RESPONSE_ADMIN"].includes(e)) {
      flag = false;
      return;
    }
  });
  return flag;
}

export const alarmAlert = (alert) => {
  try {
    const audio = new Audio(alert);
    audio.currentTime = 0;
    audio.play();
  } catch (e) {
    console.log(e);
  }
};