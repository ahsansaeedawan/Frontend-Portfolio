import React, { Component } from "react";
import { Table } from "./usersDataTable";
import { LoadingMask } from "../../../components/loadingMask";
import { fetchAllUsers, updateOrganizationUserStatus } from "../../../api";
import { CustomMessage } from "../../../components/customMessage";
import { UserContext } from "../../../context";
import { appRoles } from "../../../assets/roles";
import { alertIconMap } from "./allUsersDataTable";
import { confirmationAlert } from "../../../components/confirmationAlert";

class ActiveUsers extends Component {
  static contextType = UserContext;

  componentDidMount() {
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
      selectedRows: [],
      active: true
    };
    this.timer = null;
  }

  handleTableChange = (type, { page, sizePerPage }) => {
    this.setState({ page }, this.fetchUsers);
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
    this.setState({ loading: true });

    const ids = rows.map(row => row._id);

    updateOrganizationUserStatus(ids, status)
      .then(() => {
        const { page, sizePerPage, search, filterBy, active } = this.state;
        fetchAllUsers({
          page,
          sizePerPage,
          searchBy: filterBy,
          searchValue: search,
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
  };

  handleSingleUserActivate = () => {
    this.userStatusChangeConfirmation("activate", false, () =>
      this.changeStatus(this.state.selectedRows, true)
    );
  };

  handleBulkUserActivate = () => {
    this.userStatusChangeConfirmation("activate", true, () =>
      this.changeStatus(this.state.selectedRows, true)
    );
  };

  handleBulkUserDeactivate = () => {
    this.userStatusChangeConfirmation("deactivate", true, () =>
      this.changeStatus(this.state.selectedRows, false)
    );
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
            onChange={() => { }}
            ref={input => {
              if (input) input.indeterminate = indeterminate;
            }}
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
        <div
          // style={
          //   this.context && this.context.role.includes(appRoles.sa)
          //     ? { right: "25px" }
          //     : null
          // }
          className="table-selection-actions"
        >
          {this.renderActionButtons()}
        </div>
        <div className="table-search-container">
          <div className="table-search">
            <div className="search-input">
              <i className="sf-icon i-search-magnifier" />
              <input
                value={this.state.search}
                type="text"
                placeholder="Search"
                onChange={this.handleSearch}
              />
            </div>
            <div className="search-filter">
              <i className="sf-icon i-search-filter-by" />
              <select
                onChange={this.handleFilterBy}
                value={this.state.filterBy}
              >
                <option value="">Filter By</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="contact">Contact</option>
                {this.context &&
                  this.context.role.includes(appRoles.oa) ? null : (
                    <option value="organization">Rapid Response Partner</option>
                  )}
              </select>
              <i className="sf-icon i-search-chevron-down" />
            </div>
          </div>
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

export default ActiveUsers;
