import React, { Component } from "react";
import { LoadingMask } from "../../../components/loadingMask";
import { fetchAllOrganizations } from "../../../api";
import { CustomMessage } from "../../../components/customMessage";
import { UserContext } from "../../../context";
import { logAmplitudeEvent } from "../../../api";
import { ACCOUNT_MANAGEMENT_SEARCH_USER } from "../../../constants/amplitude";
import { Table } from "../../../components/table";
import { OrganizationSearchFilterOptions } from "../users/constants";
import { FilterSearch } from "../../../components/search";

class OrganizationsDataTable extends Component {
  static contextType = UserContext;
  componentDidMount() {
    this.fetchOrganizations();
  }

  fetchOrganizations = () => {
    const { page, sizePerPage, search, filterBy } = this.state;
    const { active = undefined } = this.props;
    this.setState({ loading: true });
    fetchAllOrganizations({
      page,
      sizePerPage,
      searchBy: filterBy,
      searchValue: search,
      active
    })
      .then(({ data }) => {
        this.setState({
          data: data.data.organizations,
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
      filterOptions: OrganizationSearchFilterOptions
    };
    this.timer = null;
  }

  handleTableChange = (type, { page, sizePerPage }) => {
    this.setState({ page }, this.fetchOrganizations);
  };

  handleSearch = e => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({ search: e.target.value, page: 1 });
    this.timer = setTimeout(() => {
      logAmplitudeEvent({ event_type: ACCOUNT_MANAGEMENT_SEARCH_USER }).catch(() => { })
      this.fetchOrganizations();
    }, 1000);
  };

  handleFilterBy = e => {
    if (this.state.filterBy === e.target.value) return;
    this.setState({ filterBy: e.target.value }, () => {
      if (this.state.search) {
        this.fetchOrganizations();
      }
    });
  };

  render() {
    const rowClasses = row => {
      let classes = null;
      if (!row.active) {
        classes = "tbl-disabled-tr all-disabled";
      }
      return classes;
    };
    return (
      <>
        {this.state.loading && <LoadingMask />}
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
          <CustomMessage message={"No Organizations Found."} />
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
            rowClasses={rowClasses}
          />
        )}
      </>
    );
  }
}

export default OrganizationsDataTable;
