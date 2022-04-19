import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import AddOrganization from "../../../components/addOrganization/addOrganization";
import EditOrganization from "../../../components/editOrganization/editOrganization";
import ViewOrganization from "../../../components/viewOrganization/viewOrganization";
import { LoadingMask } from "../../../components/loadingMask";
import { confirmationAlert } from "../../../components/confirmationAlert";
import "./organizations.css";
import {
    deleteOrganization,
    updateOrganizationStatus,
    fetchOrganizationsCount
} from "../../../api";
import { Header } from "../../../components/adminHeader";
import OrganizationsDataTable from "./organizationsDataTable";
import { alertIconMap } from "../users/userDataTable";
import { success } from "../../../components/toast";
import {
    ORG_DELETED_SUCCESS,
    ORGANIZATION_DEACTIVE_STATUS,
    ORGANIZATION_ACTIVE_STATUS
} from "../../../constants/messages";
import { logAmplitudeEvent } from "../../../api";
import {
    ACCOUNT_MANAGEMENT_ACTIVATE_USER,
    ACCOUNT_MANAGEMENT_DEACTIVATE_USER
} from "../../../constants/amplitude";
import { ORGANIZATIONS_COLUMNS } from "../../../constants/tableColumns";



const ORGANIZATION_DEFAULT = {
    name: "",
    contact: "",
    email: "",
    zoom: "",
    coordinates: ["0", "0"],
    address: "",
    logo: null
};

class Organizations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            editPaneOpen: false,
            viewPaneOpen: false,
            organization: ORGANIZATION_DEFAULT,
            activeTabIndex: 0,
            count: { all: 0, active: 0, inactive: 0 }
        };
        this.allOrgRef = React.createRef();
        this.activeOrgRef = React.createRef();
        this.inactiveOrgRef = React.createRef();
        this.actionFormatter = this.actionFormatter.bind(this);

    }

    updateCount = () => {
        this.setState({ isLoading: true });
        fetchOrganizationsCount()
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

    handleTabBtnClick = e => {
        this.setState({ activeTabIndex: e.target.tabIndex });
    };

    componentDidMount() {
        this.updateCount();
    }

    changeOrganizationStatus = (id, status) => {
        this.setState({ isLoading: true });
        updateOrganizationStatus(id, !status)
            .then(({ data }) => {
                logAmplitudeEvent({
                    event_type: status
                        ? ACCOUNT_MANAGEMENT_DEACTIVATE_USER
                        : ACCOUNT_MANAGEMENT_ACTIVATE_USER
                }).catch(() => { });
                if (data.success) {
                    this.setState({ isLoading: false }, this.refreshOrganizations);
                    success(
                        status ? ORGANIZATION_DEACTIVE_STATUS : ORGANIZATION_ACTIVE_STATUS
                    );
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(e => {
                this.setState({ isLoading: false });
                console.log(e);
            });
    };

    handleDeleteOrganization = id => {
        this.setState({ isLoading: true });

        deleteOrganization(id)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ isLoading: false }, this.refreshOrganizations);
                    success(ORG_DELETED_SUCCESS);
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(e => {
                this.setState({ isLoading: false });
                console.log(e);
            });
    };

    handleEditOrganizationView = organization => {
        this.setState({ organization }, () => {
            this.setState({ editPaneOpen: true });
        });
    };

    handleEditOrganizationViewClose = () => {
        this.setState({ editPaneOpen: false }, () => {
            this.setState({ organization: ORGANIZATION_DEFAULT });
        });
    };

    handleOrganizationViewOpen = (e, row, rowIndex) => {
        this.handleEditOrganizationBtnClick(row);
    };

    handleOrganizationViewClose = () => {
        this.setState({ viewPaneOpen: false }, () => {
            this.setState({ organization: ORGANIZATION_DEFAULT });
        });
    };

    handleEditOrganizationBtnClick = organization => {
        this.setState(
            {
                viewPaneOpen: false
            },
            () => this.handleEditOrganizationView(organization)
        );
    };

    refreshOrganizations = () => {
        switch (this.state.activeTabIndex) {
            case 0:
                if (this.allOrgRef) {
                    this.allOrgRef.current.fetchOrganizations();
                    this.updateCount();
                }
                break;
            case 1:
                if (this.activeOrgRef) {
                    this.activeOrgRef.current.fetchOrganizations();
                    this.updateCount();
                }
                break;
            case 2:
                if (this.inactiveOrgRef) {
                    this.inactiveOrgRef.current.fetchOrganizations();
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
                    title={
                        row.active
                            ? "Deactivate Rapid Response Partner"
                            : "Activate Rapid Response Partner"
                    }
                    onClick={e => {
                        e.stopPropagation();
                        confirmationAlert({
                            title: `You are about to ${
                                row.active ? "deactivate" : "activate"
                                } this Rapid Response Partner`,
                            message: `This action will ${
                                row.active ? "deactivate" : "activate"
                                } your Rapid Response Partner and all users associated with this Rapid Response Partner.`,
                            confirmMessage: `Are you sure you want to ${
                                row.active ? "deactivate" : "activate"
                                } it?`,
                            confirmBtnText: "Yes",
                            cancelBtnText: "No",
                            iconClass:
                                alertIconMap[row.active ? "deactivate" : "activate"],
                            onConfirm: () => {
                                this.changeOrganizationStatus(row._id, row.active);
                            }
                        });
                    }}
                    className={`sf-icon ${
                        row.active ? "i-deactivate-user" : "i-activate-user"
                        }`}
                ></i>
                <i
                    title="Delete Rapid Response Partner"
                    onClick={e => {
                        e.stopPropagation();
                        confirmationAlert({
                            title: `You are about to delete this Rapid Response Partner`,
                            message: `This action will permanently delete your Rapid Response Partner and all users associated with this Rapid Response Partner.`,
                            confirmMessage: `Are you sure you want to delete it?`,
                            confirmBtnText: "Yes",
                            cancelBtnText: "No",
                            iconClass: "i-delete",
                            onConfirm: () => {
                                this.handleDeleteOrganization(row._id);
                            }
                        });
                    }}
                    className="sf-icon i-delete"
                ></i>
                <i
                    onClick={e => {
                        e.stopPropagation();
                        this.handleEditOrganizationView(row);
                    }}
                    title="Edit Rapid Response Partner"
                    className="sf-icon i-edit-pencil"
                ></i>
            </div>
        );
    }

    render() {
        const rowEvents = {
            onClick: this.handleOrganizationViewOpen
        };
        //Here we assign the ORGANIZATIONS_COLUMNS into columns then find the length and assign the
        // action column into lastObject and the add formmater into  last Object
        // beacuse in this component the all of actions functions are declare so thats why we do it
        let columns = ORGANIZATIONS_COLUMNS;
        let lastIndex = columns.length - 1;
        let lastObject = columns[lastIndex];
        lastObject.formatter = this.actionFormatter;

        return (
            <>
                {this.state.isLoading && <LoadingMask />}
                <EditOrganization
                    organization={this.state.organization}
                    isPaneOpen={this.state.editPaneOpen}
                    onClose={this.handleEditOrganizationViewClose}
                    onSuccess={this.refreshOrganizations}
                />
                <ViewOrganization
                    organization={this.state.organization}
                    isPaneOpen={this.state.viewPaneOpen}
                    onEditBtnClick={this.handleEditOrganizationBtnClick}
                    onClose={this.handleOrganizationViewClose}
                />
                <div className="organization-container">
                    <Header title="Rapid Response Partner" />
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
                                        Active Rapid Response Partner
                    <span className="count">{this.state.count.active}</span>
                                    </button>
                                    <button
                                        onClick={this.handleTabBtnClick}
                                        tabIndex={2}
                                        className={classNames("tab-btn", {
                                            "active-tab": this.state.activeTabIndex === 2
                                        })}
                                    >
                                        Inactive Rapid Response Partner
                    <span className="count">{this.state.count.inactive}</span>
                                    </button>
                                </div>
                                <div className="header-actions">
                                    <AddOrganization onSuccess={this.refreshOrganizations} />
                                </div>
                            </div>
                            <div className="panel-body">
                                <div className="data-table-container">
                                    {this.state.activeTabIndex === 0 && (
                                        <OrganizationsDataTable
                                            columns={columns}
                                            rowEvents={rowEvents}
                                            updateCount={this.updateCount}
                                            ref={this.allOrgRef}
                                        />
                                    )}
                                    {this.state.activeTabIndex === 1 && (
                                        <OrganizationsDataTable
                                            columns={columns}
                                            rowEvents={rowEvents}
                                            updateCount={this.updateCount}
                                            ref={this.activeOrgRef}
                                            active
                                        />
                                    )}
                                    {this.state.activeTabIndex === 2 && (
                                        <OrganizationsDataTable
                                            columns={columns}
                                            rowEvents={rowEvents}
                                            updateCount={this.updateCount}
                                            ref={this.inactiveOrgRef}
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

const mapStateToProps = ({ organizations }) => ({
    organizations
});

export default connect(mapStateToProps, null)(Organizations);
