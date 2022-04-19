import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import AddOrganizationUser from "../../../components/addOrganizationUser/addOrganizationUser";
import EditOrganizationUser, {
    userRolesMap
} from "../../../components/editOrganizationUser/editOrganizationUser";
import ViewOrganizationUser from "../../../components/viewOrganizationUser/viewOrganizationUser";
import {
    fetchOrganizationUsers,
    fetchAllUsers
} from "../../../actions/adminActions";
import { LoadingMask } from "../../../components/loadingMask";
import {
    deleteOrganizationUser,
    updateOrganizationUserStatus,
    fetchUserCount
} from "../../../api";
import { appRoles } from "../../../assets/roles";
import { Header } from "../../../components/adminHeader";

import "./users.css";
import { success } from "../../../components/toast";
import { USER_DELETE_SUCCESS } from "../../../constants/messages";
import {
    ACCOUNT_MANAGEMENT_ACTIVATE_USER,
    ACCOUNT_MANAGEMENT_DELETE_USER
} from "../../../constants/amplitude";
import { logAmplitudeEvent } from "../../../api";
import UserDataTable from "./userDataTable";
import { nameColumnFormatter } from "../../../utils/commonUtil";
import { USERS_COULUMNS } from "../../../constants/tableColumns";
import { confirmationAlert } from "../../../components/confirmationAlert";

const USER_DEFAULT = {
    first_name: "",
    last_name: "",
    password: "",
    role: [],
    email: "",
    contact: "",
    address: "",
    organization: {
        _id: null
    }
};

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            editPaneOpen: false,
            viewPaneOpen: false,
            user: USER_DEFAULT,
            activeTabIndex: 0,
            count: { all: 0, active: 0, inactive: 0 }
        };
        this.allUsersRef = React.createRef();
        this.activeUsersRef = React.createRef();
        this.inactiveUsersRef = React.createRef();
        this.actionFormatter = this.actionFormatter.bind(this);
    }

    componentDidMount() {
        this.updateCount();
    }

    updateCount = () => {
        this.setState({ isLoading: true });
        fetchUserCount()
            .then(({ data }) => {
                const { count } = data.data;
                if (count) {
                    this.setState({
                        count: {
                            all: count.total,
                            active: count.active,
                            inactive: count.inactive
                        }
                    });
                }
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    };

    changeOrganizationUserStatus = (id, status, organizationId) => {
        this.setState({ isLoading: true });
        updateOrganizationUserStatus(organizationId, id, !status)
            .then(({ data }) => {
                if (data.success) {
                    if (this.props.user.role.includes(appRoles.sa)) {
                        this.props.fetchAllUsers().finally(() => {
                            this.setState({ isLoading: false });
                        });
                    } else {
                        this.props
                            .fetchOrganizationUsers(this.props.user.organization._id)
                            .finally(() => {
                                this.setState({ isLoading: false });
                            });
                    }
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(e => {
                this.setState({ isLoading: false });
                console.log(e);
            });
    };

    handleDeleteOrganizationUser = (id, organizationId) => {
        this.setState({ isLoading: true });
        deleteOrganizationUser(organizationId, id)
            .then(({ data }) => {
                if (data.success) {
                    logAmplitudeEvent({
                        event_type: ACCOUNT_MANAGEMENT_DELETE_USER
                    }).catch(() => { });
                    this.setState({ isLoading: false }, this.refreshUsers);
                    success(USER_DELETE_SUCCESS);
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(e => {
                this.setState({ isLoading: false });
                console.log(e);
            });
    };

    handleEditOrganizationUserView = user => {
        this.setState({ user }, () => {
            this.setState({ editPaneOpen: true });
        });
    };

    handleEditOrganizationUserViewClose = () => {
        this.setState({ editPaneOpen: false }, () => {
            this.setState({ user: USER_DEFAULT });
        });
    };

    handleOrganizationUserViewOpen = (e, row, rowIndex) => {
        this.handleEditOrganizationUserBtnClick(row);
    };

    handleOrganizationUserViewClose = () => {
        this.setState({ viewPaneOpen: false }, () => {
            this.setState({ user: USER_DEFAULT });
        });
    };

    handleEditOrganizationUserBtnClick = user => {
        this.setState(
            {
                viewPaneOpen: false
            },
            () => this.handleEditOrganizationUserView(user)
        );
    };

    handleTabBtnClick = e => {
        this.setState({ activeTabIndex: e.target.tabIndex });
        logAmplitudeEvent({
            event_type: ACCOUNT_MANAGEMENT_ACTIVATE_USER
        }).catch(() => { });
    };

    refreshUsers = () => {
        switch (this.state.activeTabIndex) {
            case 0:
                if (this.allUsersRef) {
                    this.allUsersRef.current.fetchUsers();
                    this.updateCount();
                }
                break;
            case 1:
                if (this.activeUsersRef) {
                    this.activeUsersRef.current.fetchUsers();
                    this.updateCount();
                }
                break;
            case 2:
                if (this.inactiveUsersRef) {
                    this.inactiveUsersRef.current.fetchUsers();
                    this.updateCount();
                }
                break;
            default:
                break;
        }
    };

    actionFormatter(cell, row) {
        return (
            <div className="data-table-actions">
                <i
                    onClick={e => {
                        e.stopPropagation();
                        this.handleEditOrganizationUserView(row);
                    }}
                    className="sf-icon i-edit-pencil"
                    title="Edit User"
                />
                <i
                    onClick={e => {
                        e.stopPropagation();
                        confirmationAlert({
                            title: `You are about to delete this user`,
                            message: `This action will permanently delete this user and all data associated with it.`,
                            confirmMessage: "Are you sure you want to delete it?",
                            confirmBtnText: "Yes",
                            iconClass: "i-delete",
                            onConfirm: () => {
                                this.handleDeleteOrganizationUser(
                                    row._id,
                                    row.organization
                                );
                            }
                        });
                    }}
                    className="sf-icon i-delete"
                    title="Delete User"
                />
            </div>
        );
    }

    render() {
        const rowEvents = {
            onClick: this.handleOrganizationUserViewOpen
        };

        let orgID = this.props.user.organization !== undefined ? this.props.user.organization._id : "ObjectId('5f212ab201d8480222a8e835')"
        //Here we assign the ORGANIZATIONS_COLUMNS into columns then find the length and assign the
        // action column into lastObject and the add formmater into  last Object
        // beacuse in this component the all of actions functions are declare so thats why we do it
        let columns = USERS_COULUMNS;
        let lastIndex = columns.length - 1;
        let lastObject = columns[lastIndex];
        lastObject.formatter = this.actionFormatter;
        return (
            <>
                {this.state.isLoading && <LoadingMask />}
                <EditOrganizationUser
                    organizationId={
                        this.props.user.role.includes(appRoles.sa)
                            ? "5f212ab201d8480222a8e835"
                            : this.props.user.organization._id
                    }
                    user={this.state.user}
                    isPaneOpen={this.state.editPaneOpen}
                    onClose={this.handleEditOrganizationUserViewClose}
                    onSuccess={this.refreshUsers}
                />
                <ViewOrganizationUser
                    user={this.state.user}
                    isPaneOpen={this.state.viewPaneOpen}
                    onEditBtnClick={this.handleEditOrganizationUserBtnClick}
                    onClose={this.handleOrganizationUserViewClose}
                />
                <div className="organization-container">
                    <Header title="Users" />
                    <div className="panel-outer-container">
                        <div className="panel-container panel-with-header pos-r">
                            <div className="panel-header users-header">
                                <div className="tabs-btn-container">
                                    <button
                                        className={classNames("tab-btn", {
                                            "active-tab": this.state.activeTabIndex === 0
                                        })}
                                        onClick={this.handleTabBtnClick}
                                        tabIndex={0}
                                    >
                                        All<span className="count">{this.state.count.all}</span>
                                    </button>
                                    <button
                                        onClick={this.handleTabBtnClick}
                                        tabIndex={1}
                                        className={classNames("tab-btn", {
                                            "active-tab": this.state.activeTabIndex === 1
                                        })}
                                    >
                                        Active Users
                    <span className="count">{this.state.count.active}</span>
                                    </button>
                                    <button
                                        onClick={this.handleTabBtnClick}
                                        tabIndex={2}
                                        className={classNames("tab-btn", {
                                            "active-tab": this.state.activeTabIndex === 2
                                        })}
                                    >
                                        Inactive Users
                    <span className="count">{this.state.count.inactive}</span>
                                    </button>
                                </div>

                                <div className="header-actions">

                                    {this.props.user.permissions.addUser && (

                                        < AddOrganizationUser
                                            organizationId={orgID}
                                            onSuccess={this.refreshUsers}
                                        />

                                    )}
                                </div>
                            </div>
                            <div className="panel-body">
                                <div className="data-table-container">
                                    {this.state.activeTabIndex === 0 && (
                                        <UserDataTable
                                            columns={USERS_COULUMNS}
                                            rowEvents={rowEvents}
                                            updateCount={this.updateCount}
                                            ref={this.allUsersRef}
                                        />
                                    )}
                                    {this.state.activeTabIndex === 1 && (
                                        <UserDataTable
                                            columns={USERS_COULUMNS}
                                            rowEvents={rowEvents}
                                            updateCount={this.updateCount}
                                            ref={this.activeUsersRef}
                                            active={true}
                                        />
                                    )}
                                    {this.state.activeTabIndex === 2 && (
                                        <UserDataTable
                                            columns={USERS_COULUMNS}
                                            rowEvents={rowEvents}
                                            updateCount={this.updateCount}
                                            ref={this.inactiveUsersRef}
                                            active={false}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = ({ orgUsers, user }) => ({
    users: orgUsers.users,
    count: orgUsers.count,
    user
});

export default connect(mapStateToProps, {
    fetchOrganizationUsers,
    fetchAllUsers
})(Users);
