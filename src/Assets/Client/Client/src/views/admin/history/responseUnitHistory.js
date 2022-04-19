import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import { DateRangePicker, DatePicker } from "../../../components/datePicker";
import { LoadingMask } from "../../../components/loadingMask";
import { ExportButton } from "../../../components/exportButton";
import { FilterSearch } from "../../../components/search";
import ResponseUnitDetail from "../../../components/responseUnitDetail/responseUnitDetail";
import { fetchResponseUnitHistory } from "../../../actions/adminActions";
import { Table } from "../../../components/table";
import { RESPONSE_UNIT_COLUMNS } from "../../../constants/tableColumns";
import { RespHistorySearchFilterOption } from "../../../constants/searchFilterConstants";




class ResponseUnitHistory extends Component {
  

  constructor(props) {
    super(props);
    this.startDateRef = React.createRef();
    this.endDateRef = React.createRef();
    this.chartRef = React.createRef();

    this.state = {
      date: [
        new Date(new Date().setHours(0, 0, 0, 0)),
        new Date(new Date().setHours(0, 0, 0, 0)),
      ],
      loading: true,
      tableData: [],
      search: "",
      filterBy: "",
      fitlerOptions: RespHistorySearchFilterOption,
      responseUnitDetailVisible: false,
      responseUnitDetailId: "",
      page: 1,
      sizePerPage: 10,
      totalSize: 0,
    };
  }
  componentDidMount() {
    this.fetchResponseUnitHistory();
  }

  fetchResponseUnitHistory() {
    this.setState({ loading: true });
    const { page, sizePerPage, } = this.state;
    this.props.fetchResponseUnitHistory({
      page,
      sizePerPage,
      startdate: moment(this.state.date[0]).format('YYYY-MM-DD'),
      enddate:  moment(this.state.date[1]).format('YYYY-MM-DD'),
      search: this.state.search,
      searchBy: this.state.filterBy
    }).then(() => {
      this.setState({
        loading: false,
        totalSize: this.props.metadata[0] && this.props.metadata[0].total

      });
    }).catch((e) => {
      console.log(e);
      this.setState({ loading: false });
    })
  }

  handleSearch = (e) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({ search: e.target.value });
    this.timer = setTimeout(() => {
      this.fetchResponseUnitHistory();
    }, 1000);

  };
  handleFilterBy = (e) => {
    if (this.state.filterBy === e.target.value) return;
    this.setState({ filterBy: e.target.value }, () => {
      if (this.state.search) {
        this.fetchResponseUnitHistory();
      }
    });
  };
  handleDateRangeChange = (date) => {
    this.setState({ date, page: 1 }, // state update the page from current to First page!
    this.fetchResponseUnitHistory);  
  };

  handleDateChange = (index, action) => {
    if (!action) return;

    const { date } = this.state;
    const startDate = date[0].getTime();
    const enddate = date[1].getTime();

    if (index === 0 && action === "add" && startDate === enddate) return;
    if (index === 1 && action === "subtract" && startDate === enddate) return;

    const nextDate = date[index];
    if (action === "add") {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    if (action === "subtract") {
      nextDate.setDate(nextDate.getDate() - 1);
    }

    date[index] = nextDate;
    this.setState({ date, page: 1 }, // state update the page from current to First page! 
    this.fetchResponseUnitHistory);
  };

  handleExportHistory = () => { };

  handleStartDateChange = (startDate) => {
    const { date } = this.state;
    date[0] = startDate;
    this.setState({ date, page: 1 }, // state update the page from current to First page!
    this.fetchResponseUnitHistory);
  };

  handleEndDateChange = (endDate) => {
    const { date } = this.state;
    date[1] = endDate;
    this.setState({ date, page: 1 }, // state update the page from current to First page!
    this.fetchResponseUnitHistory);
  };

  toggleStartCalendar = () => {
    if (this.startDateRef) {
      this.startDateRef.current.toggleCalendar();
    }
  };

  toggleEndCalendar = () => {
    if (this.endDateRef) {
      this.endDateRef.current.toggleCalendar();
    }
  };

  viewResponseUnitDetail = (e, row, rowIndex) => {
    this.setState({ responseUnitDetailVisible: true, responseUnitDetailId: row.uuid });
  };

  closeResponseUnitDetail = () => {
    this.setState({ responseUnitDetailVisible: false });
  };
  handleTableChange = (type, { page, sizePerPage }) => {
    this.setState({ page }, this.fetchResponseUnitHistory);
  };
  render() {
    const eventsTblRowEvents = {
      onClick: this.viewResponseUnitDetail,
    };

    return (
      <>
        {this.state.loading && <LoadingMask />}
        <ResponseUnitDetail
          visible={this.state.responseUnitDetailVisible}
          onClose={this.closeResponseUnitDetail}
          id={this.state.responseUnitDetailId}
        />

        <div className="history-filters">
          <div className="history-search-container table-search-container">
            <FilterSearch
              placeholder="Search"
              value={this.state.search}
              onChange={this.handleSearch}
              options={this.state.fitlerOptions}
              filterValue={this.state.filterBy}
              onFilterChange={this.handleFilterBy}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <DateRangePicker
              onChange={this.handleDateRangeChange}
              value={this.state.date}
              calendarIcon={<i className="sf-icon i-calendar" />}
            >
              <div className="date-ranges">
                <div className="date-range-start">
                  <h3 className="date-range-label">From</h3>
                  <Moment
                    className="insights-date"
                    format="DD.MM.YYYY"
                    local
                    onClick={this.toggleStartCalendar}
                  >
                    {this.state.date[0]}
                  </Moment>
                  <div className="history-start-date single-date-picker">
                    <DatePicker
                      value={this.state.date[0]}
                      maxDate={this.state.date[1]}
                      onChange={this.handleStartDateChange}
                      calendarIcon={<i />}
                      ref={this.startDateRef}
                    />
                  </div>

                  <div className="date-controls">
                    <i
                      onClick={() => {
                        this.handleDateChange(0, "add");
                      }}
                      className="sf-icon i-chevron-down date-up"
                    />
                    <i
                      onClick={() => {
                        this.handleDateChange(0, "subtract");
                      }}
                      className="sf-icon i-chevron-down date-down"
                    />
                  </div>
                </div>
                <div className="date-range-end">
                  <h3 className="date-range-label">To</h3>
                  <Moment
                    className="insights-date"
                    format="DD.MM.YYYY"
                    onClick={this.toggleEndCalendar}
                    local
                  >
                    {this.state.date[1]}
                  </Moment>
                  <div className="history-start-date single-date-picker">
                    <DatePicker
                      value={this.state.date[1]}
                      minDate={this.state.date[0]}
                      onChange={this.handleEndDateChange}
                      calendarIcon={<i />}
                      ref={this.endDateRef}
                    />
                  </div>
                  <div className="date-controls">
                    <i
                      onClick={() => {
                        this.handleDateChange(1, "add");
                      }}
                      className="sf-icon i-chevron-down date-up"
                    />
                    <i
                      onClick={() => {
                        this.handleDateChange(1, "subtract");
                      }}
                      className="sf-icon i-chevron-down date-down"
                    />
                  </div>
                </div>
              </div>
            </DateRangePicker>
            <ExportButton
              onClick={this.handleExportHistory}
              style={{ marginLeft: "5px", marginRight: "-10px" }}
            />
          </div>
        </div>
        <div className="history-table-container">
          <Table
            remote
            data={this.props.responseUnits}
            rowEvents={eventsTblRowEvents}
            columns={RESPONSE_UNIT_COLUMNS}
            onTableChange={this.handleTableChange}
            sizePerPage={this.state.sizePerPage}
            page={this.state.page}
            totalSize={this.state.totalSize}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ history }) => ({
  responseUnits: history.responseUnits,
  metadata: history.metadata
});


export default connect(mapStateToProps, {
  fetchResponseUnitHistory
})(ResponseUnitHistory);
