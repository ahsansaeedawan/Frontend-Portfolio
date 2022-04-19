import React, { useContext } from "react";
import { UserContext } from "../../context";
import { appRoles } from "../../assets/roles";
import "./boardName.css";

const role = {
    sa: "Iylus Dashboard Super Admin (IDSA)",
    oa: "Iylus Rapid Response Dashboard (IRRD)",
    ma: "Monitoring Dashboard Agent (MDA)",
    ra: "Response Dashboard Agent (RDA)",
    madmin: "Monitoring Dashboard Admin (MDA)",
    radmin: "Response Dashboard Admin (RDA)"
}

function dashboardName(currentUserRole) {

    let boardName = "";

    if (currentUserRole.includes(appRoles.sa)) {
        boardName = role.sa;
    }
    if (currentUserRole.includes(appRoles.oa)) {
        boardName = role.oa;
    }
    if (currentUserRole.includes(appRoles.madmin) || currentUserRole.includes(appRoles.radmin)) {
        boardName = role.madmin;
    }
    if (currentUserRole.includes(appRoles.ma) || currentUserRole.includes(appRoles.ra)) {
        boardName = role.ma;
    }
    if (currentUserRole.includes(appRoles.radmin)) {
        boardName = role.radmin;
    }
    if (currentUserRole.includes(appRoles.ra)) {
        boardName = role.ra;
    }

    if (currentUserRole.includes(appRoles.madmin)) {
        boardName = role.madmin;
    }
    if (currentUserRole.includes(appRoles.ma)) {
        boardName = role.ma;
    }

    return boardName;
}

const BoardName = () => {
    const user = useContext(UserContext);
    const currentUserRole = user.role;
    return (
        <div className="menu-act-btn" style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}>
            <div className="user-settings-label-cnt">
                <span className="highlight">{dashboardName(currentUserRole)}</span>
            </div>
        </div>
    );
};


export default BoardName;
