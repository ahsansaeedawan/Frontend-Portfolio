import React, { Component } from "react";
import Moment from "react-moment";
import moment from "moment";
import fileDownload from "js-file-download";
import { Line } from "react-chartjs-2";
import { DateRangePicker, DatePicker } from "../../../components/datePicker";
import { fetchEventsHistoryTimeline, exportEventsInsight } from "../../../api";
import { LoadingMask } from "../../../components/loadingMask";
import { ExportButton } from "../../../components/exportButton";
import { logAmplitudeEvent } from "../../../api";
import { FilterSearch } from "../../../components/search";
import { EventDetail } from "../../../components/eventDetail";
import {
  HISTORY_SELECT_DATE,
  HISTORY_DOWNLOAD_REPORT_OF_SELECT_DATES,
} from "../../../constants/amplitude";
import { Table } from "../../../components/table";
import { HISTORY_COLUMN } from "../../../constants/tableColumns";
import { HistorySearchFilterOption } from "../../../constants/searchFilterConstants";

const chartConfigMap = {
  0: {
    label: "Triggered",
    backgroundColor: "rgba(245, 142, 93,0.4)",
    borderColor: "rgba(245, 142, 93, 1)",
    pointBackgroundColor: "rgba(245, 142, 93, 1)",
  },
  1: {
    label: "Verified",
    backgroundColor: "rgba(237, 28, 36, 0.4)",
    borderColor: "rgba(237, 28, 36, 1)",
    pointBackgroundColor: "rgba(237, 28, 36, 1)",
  },
  2: {
    label: "Acknowledged",
    backgroundColor: "rgba(0, 191, 243, 0.4)",
    borderColor: "rgba(0, 191, 243, 1)",
    pointBackgroundColor: "rgba(0, 191, 243, 1)",
  },
};


const EventsHistoryChart = React.forwardRef(({ data }, ref) => {
  return (
    <Line
      ref={ref}
      height={375}
      plugins={[
        {
          beforeInit: function (chart) {
            chart.legend.afterFit = function () {
              this.height = this.height + 30;
            };
          },
          beforeDraw: function (chart) {
            const ctx = chart.chart.ctx;
            ctx.fillStyle = "#f8f8f8";
            ctx.fillRect(0, 0, chart.chart.width, chart.chart.height);
          },
        },
      ]}
      options={{
        maintainAspectRatio: false,
        legend: {
          fullWidth: false,
          display: true,
          align: "start",
          labels: {
            boxWidth: 10,
            usePointStyle: true,
            fontColor: "#3c3e3f",
          },
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "No. of incidents",
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Time",
              },
            },
          ],
        },
      }}
      data={data}
    />
  );
});



class EventHistory extends Component {
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
      chartData: {},
      tableData: [],
      search: "",
      filterBy: "email",
      fitlerOptions: HistorySearchFilterOption,
      eventDetailVisible: false,
      selectedEventId: "",
      page: 1,
      sizePerPage: 10,
      totalSize: 0,
    };
  }

  fetchEventsHistory = () => {
    const { page, sizePerPage, search, filterBy } = this.state;
    this.setState({ loading: true });
    fetchEventsHistoryTimeline({
      page,
      sizePerPage,
      startdate: moment(this.state.date[0]).format('YYYY-MM-DD'),
      enddate: moment(this.state.date[1]).format('YYYY-MM-DD'),
      searchBy: filterBy,
      search
    })
      .then(({ data }) => {
        const chartData = this.createChartData(data.data.graphData);
        this.setState({
          loading: false,
          chartData,
          tableData: data.data.alarmEvents,
          totalSize: data.data.metadata && data.data.metadata.total,

        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.fetchEventsHistory();
  }

  handleTableChange = (type, { page, sizePerPage }) => {
    this.setState({ page }, this.fetchEventsHistory);
  };
  handleSearch = (e) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({ search: e.target.value });
    this.timer = setTimeout(() => {
      this.fetchEventsHistory();
    }, 1000);
  };
  handleFilterBy = (e) => {
    if (this.state.filterBy === e.target.value) return;
    this.setState({ filterBy: e.target.value }, () => {
      if (this.state.search) {
        this.fetchEventsHistory();
      }
    });
  };
  handleDateRangeChange = (date) => {
    this.setState({ date, page: 1 }, // state update the page from current to First page!
      this.fetchEventsHistory);
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
      this.fetchEventsHistory);
  };

  createChartData = ({
    legendsArray,
    acknolwedgedArray,
    verifiedArray,
    incidentArray,
  }) => {
    const chartData = {};
    const datasets = [];
    const data = {
      0: incidentArray,
      1: verifiedArray,
      2: acknolwedgedArray,
    };

    chartData.labels = legendsArray;
    for (let i = 0; i < 3; i++) {
      datasets.push({
        label: chartConfigMap[i].label,
        fill: false,
        lineTension: 0.4,
        backgroundColor: chartConfigMap[i].backgroundColor,
        borderColor: chartConfigMap[i].borderColor,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#fff",
        pointBackgroundColor: chartConfigMap[i].pointBackgroundColor,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHitRadius: 10,
        spanGaps: true,
        data: data[i],
      });
    }
    chartData.datasets = datasets;
    return chartData;
  };
  handleExportInsight = () => {
    this.setState({ loading: true });
    const { date } = this.state;
    exportEventsInsight({
      startdate: date[0],
      enddate: date[1],
    })
      .then(({ data }) => {
        fileDownload(data, `Events-History-${date[0].getTime()}.csv`);
        logAmplitudeEvent({
          event_type: HISTORY_DOWNLOAD_REPORT_OF_SELECT_DATES,
        }).catch(() => { });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleStartDateChange = (startDate) => {
    const { date } = this.state;
    date[0] = startDate;
    this.setState({ date, page: 1 }, // state update the page from current to First page!
      this.fetchEventsHistory);
    logAmplitudeEvent({ event_type: HISTORY_SELECT_DATE }).catch(() => { });
  };

  handleEndDateChange = (endDate) => {
    const { date } = this.state;
    date[1] = endDate;
    this.setState({ date, page: 1 }, // state update the page from current to First page! 
      this.fetchEventsHistory);
    logAmplitudeEvent({ event_type: HISTORY_SELECT_DATE }).catch(() => { });
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

  downloadChartAsImage = () => {
    if (!this.chartRef.current) return;
    const tempAnchor = document.createElement("a");
    var dataURL = this.chartRef.current.chartInstance.canvas.toDataURL(
      "image/jpeg"
    );
    tempAnchor.href = dataURL;
    tempAnchor.download = `Chart-${this.state.date[0].getTime()}.jpg`;
    tempAnchor.click();
  };

  handleTabBtnClick = (e) => {
    if (this.state.activeTabIndex === e.target.tabIndex) {
      return;
    }
    this.setState({ activeTabIndex: e.target.tabIndex });
  };

  viewEventDetail = (e, row, rowIndex) => {
    this.setState({ eventDetailVisible: true, selectedEventId: row._id });
  };

  closeEventDetail = () => {
    this.setState({ eventDetailVisible: false });
  };

  render() {
    const eventsTblRowEvents = {
      onClick: this.viewEventDetail,
    };

    return (
      <>
        {this.state.loading && <LoadingMask />}
        {
          this.state.eventDetailVisible &&
          <EventDetail
            visible={this.state.eventDetailVisible}
            onClose={this.closeEventDetail}
            id={this.state.selectedEventId}
          />}
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
              onClick={this.handleExportInsight}
              style={{ marginLeft: "5px", marginRight: "-10px" }}
            />
          </div>
        </div>
        <div className="history-table-container">
          <Table
            remote
            data={this.state.tableData}
            columns={HISTORY_COLUMN}
            sizePerPage={this.state.sizePerPage}
            page={this.state.page}
            totalSize={this.state.totalSize ?? 0}
            onTableChange={this.handleTableChange}
            rowEvents={eventsTblRowEvents}
          />
        </div>
        <div style={{ position: "relative" }}>
          <i
            title="Download Graph Data as Image"
            onClick={this.downloadChartAsImage}
            className="sf-icon i-download btn-download-icon"
          />
          <EventsHistoryChart ref={this.chartRef} data={this.state.chartData} />
        </div>
      </>
    );
  }
}

export default EventHistory;
