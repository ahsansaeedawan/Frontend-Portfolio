import React, { Component } from "react";
import { LoadingMask } from "../../../components/loadingMask";
import { fetchAllUsers, updateOrganizationUserStatus } from "../../../api";
import { CustomMessage } from "../../../components/customMessage";
import { UserContext } from "../../../context";
import { appRoles } from "../../../assets/roles";
import { confirmationAlert } from "../../../components/confirmationAlert";
import { success } from "../../../components/toast";
import {
  USER_ACTIVE_STATUS,
  USERS_ACTIVE_STATUS,
  USER_DEACTIVE_STATUS,
  USERS_DEACTIVE_STATUS
} from "../../../constants/messages";
import { ACCOUNT_MANAGEMENT_DEACTIVATE_USER } from "../../../constants/amplitude";
import { ACCOUNT_MANAGEMENT_ACTIVATE_USER } from "../../../constants/amplitude";
import { logAmplitudeEvent } from "../../../api";
import { FilterSearch } from "../../../components/search";
import { UserSearchFilterOptions } from "./constants";
import { Table } from "../../../components/table";

export const alertIconMap = {
  activate: "i-activate-user",
  deactivate: "i-deactivate-user"
};

class UserDataTable extends Component {
  static contextType = UserContext;

  componentDidMount() {
    // Exclude "organization" filter if user role is organization admin
    if (!this.context.role.includes(appRoles.sa)) {
      const filterOptions = UserSearchFilterOptions.filter(
        opt => opt.value !== "organization"
      );
      this.setState({ filterOptions });
    }

    // Fetch Users
    this.fetchUsers();
  }

  fetchUsers = () => {
    const { page, sizePerPage, search, filterBy, active } = this.state;
    this.setState({ loading: true });
    fetchAllUsers({
      page,
      sizePerPage,
      searchBy: filterBy,
      searchValue: search,
      active
    })
      .then(({ data }) => {
        this.setState({
          data: data.data.users,
          totalSize: data.data.count.total
        });
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      page: 1,
      sizePerPage: 10,
      totalSize: 0,
      search: "",
      filterBy: "",
      filterOptions: UserSearchFilterOptions,
      selectedRows: [],
      active: props.active
    };
    this.timer = null;
  }

  handleTableChange = (type, { page, sizePerPage }) => {
    this.setState({ page, selectedRows: [] }, this.fetchUsers);
  };
  handleSearch = e => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({ search: e.target.value, page: 1 });
    this.timer = setTimeout(() => {
      this.fetchUsers();
    }, 1000);
  };
  handleFilterBy = e => {
    if (this.state.filterBy === e.target.value) return;
    this.setState({ filterBy: e.target.value }, () => {
      if (this.state.search) {
        this.fetchUsers();
      }
    });
  };
  handleOnRowSelect = (row, isSelect) => {
    if (isSelect) {
      const { selectedRows } = this.state;
      selectedRows.push(row);
      this.setState({ selectedRows });
    } else {
      const selectedRows = this.state.selectedRows.filter(
        item => item._id !== row._id
      );
      this.setState({ selectedRows });
    }
  };
  handleOnRowSelectAll = (isSelect, rows = []) => {
    if (isSelect) {
      this.setState({ selectedRows: rows });
    } else {
      this.setState({ selectedRows: [] });
    }
  };
  changeStatus = (rows, status) => {
    const { page, sizePerPage, search, filterBy, active } = this.state;
    this.setState({ loading: true });
    const ids = rows.map(row => row._id);
    updateOrganizationUserStatus(ids, status)
      .then(() => {
        fetchAllUsers({
          page,
          sizePerPage,
          searchValue: search,
          searchBy: filterBy,
          active
        })
          .then(({ data }) => {
            const users = data.data.users;
            this.props.updateCount();
            this.setState({ data: users });

            if (ids.length === 1) {
              const user = users.find(user => user._id === ids[0]);
              if (!user) {
                this.setState({ selectedRows: [] });
              } else {
                this.setState({ selectedRows: [user] });
              }
              success(status ? USER_ACTIVE_STATUS : USER_DEACTIVE_STATUS);
            } else {
              success(status ? USERS_ACTIVE_STATUS : USERS_DEACTIVE_STATUS);
            }
          })
          .finally(() => this.setState({ loading: false }));
      })
      .catch(e => {
        console.log(e);
        this.setState({ loading: false });
      });
  };

  userStatusChangeConfirmation = (status, multiple, onConfirm) => {
    confirmationAlert({
      title: `You are about to ${status} the selected ${
        multiple ? "users" : "user"
        }`,
      message: `Are you sure you want to perform this action?`,
      confirmBtnText: "Yes",
      cancelBtnText: "No",
      iconClass: alertIconMap[status],
      onConfirm: () => {
        onConfirm();
      }
    });
  };

  handleSingleUserDeactivate = () => {
    this.userStatusChangeConfirmation("deactivate", false, () =>
      this.changeStatus(this.state.selectedRows, false)
    );
    logAmplitudeEvent({
      event_type: ACCOUNT_MANAGEMENT_DEACTIVATE_USER
    }).catch(() => { });
  };

  handleSingleUserActivate = () => {
    this.userStatusChangeConfirmation("activate", false, () =>
      this.changeStatus(this.state.selectedRows, true)
    );
    logAmplitudeEvent({
      event_type: ACCOUNT_MANAGEMENT_ACTIVATE_USER
    }).catch(() => { });
  };

  handleBulkUserActivate = () => {
    this.userStatusChangeConfirmation("activate", true, () =>
      this.changeStatus(this.state.selectedRows, true)
    );
    logAmplitudeEvent({
      event_type: ACCOUNT_MANAGEMENT_DEACTIVATE_USER
    }).catch(() => { });
  };

  handleBulkUserDeactivate = () => {
    this.userStatusChangeConfirmation("deactivate", true, () =>
      this.changeStatus(this.state.selectedRows, false)
    );
    logAmplitudeEvent({
      event_type: ACCOUNT_MANAGEMENT_DEACTIVATE_USER
    }).catch(() => { });
  };

  renderActionButtons = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) return null;
    if (selectedRows.length === 1) {
      const className = selectedRows[0].active
        ? "i-deactivate-user"
        : "i-activate-user";
      return (
        <i
          title={selectedRows[0].active ? "Deactivate User" : "Activate User"}
          onClick={
            selectedRows[0].active
              ? this.handleSingleUserDeactivate
              : this.handleSingleUserActivate
          }
          className={`sf-icon ${className}`}
        />
      );
    }
    if (selectedRows.length > 1) {
      return (
        <>
          <i
            title="Activate Users"
            onClick={this.handleBulkUserActivate}
            className={`sf-icon i-activate-user with-margin`}
          />
          <i
            title="Deactivate Users"
            onClick={this.handleBulkUserDeactivate}
            className={`sf-icon i-deactivate-user`}
          />
        </>
      );
    }
    return null;
  };
  render() {
    const selectRow = {
      mode: "checkbox",
      clickToSelect: false,
      selected: this.state.selectedRows.map(rows => rows._id),
      onSelect: this.handleOnRowSelect,
      onSelectAll: this.handleOnRowSelectAll,
      headerColumnStyle: status => ({
        width: "20px",
        paddingLeft: "0px",
        paddingRight: "0px"
      }),
      selectColumnStyle: {
        paddingLeft: "0px",
        paddingRight: "0px"
      },
      selectionRenderer: ({ mode, rowIndex, ...rest }) => (
        <label className="tbl-checkbox-container">
          <input
            onChange={() => { }}
            rowindex={rowIndex}
            type={mode}
            {...rest}
          />
          <span className="checkmark"></span>
        </label>
      ),
      selectionHeaderRenderer: ({ indeterminate, ...rest }) => (
        <label className="tbl-checkbox-container">
          <input
            type="checkbox"
            ref={input => {
              if (input) input.indeterminate = indeterminate;
            }}
            onChange={() => { }}
            {...rest}
          />
          <span className="checkmark"></span>
        </label>
      )
    };

    const rowClasses = row => {
      let classes = null;

      if (!row.active) {
        classes = "tbl-disabled-tr";
      }

      return classes;
    };
    return (
      <>
        {this.state.loading && <LoadingMask />}
        <div className="table-selection-actions"        >
          {this.renderActionButtons()}
        </div>
        <div className="table-search-container">
          <FilterSearch
            placeholder="Search"
            value={this.state.search}
            onChange={this.handleSearch}
            options={this.state.filterOptions}
            filterValue={this.state.filterBy}
            onFilterChange={this.handleFilterBy}
          />
        </div>
        {!this.state.loading && this.state.data.length === 0 && (
          <CustomMessage message={"No Users Found."} />
        )}
        {this.state.data.length > 0 && (
          <Table
            remote
            data={this.state.data}
            columns={this.props.columns}
            rowEvents={this.props.rowEvents}
            sizePerPage={this.state.sizePerPage}
            page={this.state.page}
            totalSize={this.state.totalSize}
            onTableChange={this.handleTableChange}
            selectRow={selectRow}
            rowClasses={rowClasses}
          />
        )}
      </>
    );
  }
}

export default UserDataTable;
