import React from "react";
import { connect } from "react-redux";
import { Users } from "./users";
import { closeDashboardMenu } from "../../actions/dashboardActions";
import { NavLink } from "./adminDashboard";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./adminDashboard.css";

class UserDashboard extends React.Component {
  componentWillMount() {
    this.props.closeDashboardMenu();
  }
  render() {
    const { user } = this.props;
    return (
      <div className="admin-dashboard-container">
        <div className="admin-menu">
          <div>
            <img
              className="admin-dashboard-logo"
              src={
                user && user.organization
                  ? user.organization.logo
                  : `/assets/images/iylusWhite2.png`
              }
              alt=""
            />
            <nav className="admin-nav">
              <NavLink to="/dashboard" title="Dashboard" icon="i-dashboard" />
              <NavLink to="/users" title="Users" icon="i-groups" />
              {/* <NavLink
                to="/users"
                title="Users"
                count={10}
                iconClass="i-roles"
              /> */}
            </nav>
          </div>
          <button className="admin-user-settings-btn">
            {/* <i className="sf-icon i-settings" /> */}
            <span className="user-name-thumbanil">
              {/* {user.first_name && user.first_name[0].toUpperCase()} */}
              {user.organization.name &&
                user.organization.name[0].toUpperCase()}
            </span>
            <div className="user-settings-label-cnt">
              <span className="highlight">{user.organization.name}</span>
              <span className="dim">{user.email}</span>
            </div>
          </button>
        </div>
        <div className="adm-db-rt-outlet">
          {/* <Organizations /> */}
          <Users />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(
  mapStateToProps,
  { closeDashboardMenu }
)(UserDashboard);
