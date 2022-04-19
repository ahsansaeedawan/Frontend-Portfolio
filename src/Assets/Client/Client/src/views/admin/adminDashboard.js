import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { Link } from "@reach/router";
import { closeDashboardMenu } from "../../actions/dashboardActions";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./adminDashboard.css";
import { AdminRouter } from "../../routes/admin.router";
import { logOut } from "../../actions/appActions";
import { SocketContext, UserContext } from "../../context/";
import { appRoles } from "../../assets/roles";
import { UserSettings } from "../../components/userSettings";
import BoardName from "../../components/userSettings/boardName";
import { logoutUser } from "../../api"

export const NavLink = ({ to, title, iconClass, count, icon }) => {
  return (
    <Link
      to={to}
      getProps={({ isCurrent }) => {
        return { className: isCurrent ? "active-link" : null };
      }}
      style={{ textDecoration: "none" }}
    >
      <span className="link-detail">
        {icon && <i className={classNames("sf-icon", icon)} />}
        <span className="link-title">{title}</span>
      </span>
      {count && <span className="notif-count">{count}</span>}
    </Link>
  );
};

class AdminDashboard extends React.Component {
  componentWillMount() {
    this.props.closeDashboardMenu();
  }

  handleLogOut = async () => {
    let socket = this.props.socket;
    this.props.logOut();
    await logoutUser();
    window.localStorage.removeItem("token");
    if (socket) {
      console.log("disconnecting socket");
      socket.disconnect();
    }

    window.location.reload();
  };

  renderSettingsButton = () => {
    const button = [];
    const { user } = this.props;
    const role = user.role.includes(appRoles.sa)
      ? appRoles.sa
      : user.role.includes(appRoles.oa)
        ? appRoles.oa
        : "NORMAL_USER";
    const name =
      role === appRoles.sa
        ? "Super Admin"
        : role === appRoles.oa
          ? "Org Admin"
          : `${user.first_name} ${user.last_name}`;
    const organization =
      role === appRoles.sa ? "Iylus" : user.organization.name;

    button.push(
      <button
        key={`admin-user-settings-btn`}
        className="admin-user-settings-btn"
      >
        <span className="user-name-thumbanil">{name[0].toUpperCase()}</span>
        <div className="user-settings-label-cnt">
          <span className="highlight">{name}</span>
          <span className="dim">{organization}</span>
        </div>
      </button>
    );
    return button;
  };

  render() {
    const { user } = this.props;
    return (
      <div className="admin-dashboard-container">
        <div className="admin-menu">
          <div>
            <div className="admin-dashboard-logo-container">
              <img
                className="admin-dashboard-logo"
                src={
                  user && user.organization
                    ? user.organization.logo
                    : `/assets/images/iylusWhite2.png`
                }
                alt=""
              />
              <BoardName />
            </div>
            <nav className="admin-nav">
              {user && user.role.includes(appRoles.sa) && (
                <>
                  <NavLink
                    to="organizations"
                    title="Rapid Response Partner"
                    icon="i-user-organization"
                  />
                </>
              )}

              {user &&
                (user.role.includes(appRoles.ma) ||
                  user.role.includes(appRoles.madmin) ||
                  user.role.includes(appRoles.ra) ||
                  user.role.includes(appRoles.radmin)) && (
                  <>
                    <NavLink
                      to="/dashboard"
                      title="Dashboard"
                      icon="i-dashboard"
                    />
                  </>
                )}
              {user &&
                (user.role.includes(appRoles.madmin) ||
                  user.role.includes(appRoles.radmin)) && (
                  <>
                    <NavLink
                      to="history"
                      title="History"
                      icon="i-user-history"
                    />
                    <NavLink
                      to="insights"
                      title="Insight"
                      icon="i-user-insight"
                    />
                  </>
                )}

              {/* TODO: Refactor this */}
              {JSON.stringify(user.role) === JSON.stringify([appRoles.ma]) ||
                (JSON.stringify(user.role) === JSON.stringify([appRoles.ra]) ||
                  JSON.stringify(user.role) ===
                  JSON.stringify([appRoles.ma, appRoles.ra]) ? null : (
                    <NavLink to="users" title="Users" icon="i-user-outline" />
                  ))}


              <NavLink to="setting" title="Settings" icon="i-user-setting" />
            </nav>
          </div>
          <div className="menu-footer user-setting">
            <UserSettings />
          </div>
        </div>
        <div className="adm-db-rt-outlet">
          <AdminRouter />
        </div>
      </div>
    );
  }
}

const AdminDashboardWithContext = props => (
  <SocketContext.Consumer>
    {socket => (
      <UserContext.Consumer>
        {user => <AdminDashboard {...props} socket={socket} user={user} />}
      </UserContext.Consumer>
    )}
  </SocketContext.Consumer>
);

export default connect(null, { closeDashboardMenu, logOut })(
  AdminDashboardWithContext
);
