import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import Moment from "react-moment";
import fileDownload from "js-file-download";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { LoadingMask } from "../../../components/loadingMask";
import { Header } from "../../../components/adminHeader";
import "./insights.css";
import { ToggleSwitch } from "../../../components/toggleSwitch";
import { DatePicker } from "../../../components/datePicker";
import { legacyMapTheme } from "../../map/theme";
import { fetchEvents } from "../../../actions/adminActions";
import { mapMarkerIcon } from "../../../assets/assetsMap";
import { ExportButton } from "../../../components/exportButton"; // Hide for now!
import { exportEventsHistory } from "../../../api";
import { logAmplitudeEvent } from "../../../api";
import { INSIGHT_SELECT_DATE } from "../../../constants/amplitude";
import { INSIGHT_DOWNLOAD_REPORT_OF_SELECT_DATE } from "../../../constants/amplitude";
import {
  INSIGHTS_PLAY_EVENT,
  INSIGHTS_SWITCH_EVENT_INCIDENT,
  INSIGHTS_SWITCH_EVENT_VERIFIED,
  INSIGHTS_SWITCH_EVENT_ACKNOWLEDGED,
} from "../../../constants/amplitude";
import { legendMap, opacityMap } from "./dataMaps";
function IntervalSelect({ onChange, value, name }) {
  return (
    <select
      name={name}
      onChange={onChange}
      className="interval-select"
      value={value}
    >
      <option value="1">1 Hour</option>
      <option value="4">4 Hours</option>
      <option value="8">8 Hours</option>
      <option value="12">12 Hours</option>
      <option value="24">24 Hours</option>
    </select>
  );
}

class InsightSlider extends Component {


  constructor(props) {
    super(props);
    this.interval = null;

    this.state = {
      left: "0%",
      currentStep: 1,
      playing: false,
      width: "0%",
      totalSteps: 24,
      perStepWidth: 0,
    };
  }

  componentWillMount() {
    this.calculateSteps(this.props.step);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.step !== this.props.step) {
      this.calculateSteps(nextProps.step);
      this.clearSliderInteval();
    }
    if (
      nextProps.filters !== this.props.filters ||
      nextProps.date !== this.props.date
    ) {
      this.clearSliderInteval();
      this.setState({
        currentStep: 1,
        left: "0%",
      });
      this.props.onLegendClick(`${legendMap[1 * this.props.step]}`);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  calculateSteps = (step) => {
    const totalSteps = 24 / step;
    const perStepWidth = 100 / totalSteps;
    this.setState({
      totalSteps,
      perStepWidth,
      width: `${perStepWidth}%`,
      currentStep: 1,
      left: "0%",
    });
  };

  clearSliderInteval = () => {
    clearInterval(this.interval);
    this.setState({ playing: false });
  };

  handleLegendClick = (i) => {
    this.clearSliderInteval();
    if (i === 0) {
      this.setState({ width: "3px", left: "0%" });
    } else {
      this.setState((prevState) => ({
        width: `${prevState.perStepWidth}%`,
        left: `${i * prevState.perStepWidth - prevState.perStepWidth}%`,
        currentStep: i,
      }));
    }
    this.props.onLegendClick(`${legendMap[i * this.props.step]}`);
  };
  handleSliderPlay = () => {
    if (!this.state.playing) {
      logAmplitudeEvent({
        event_type: INSIGHTS_PLAY_EVENT + " " + this.props.step,
      }).catch(() => { });
      this.setState(
        {
          playing: true,
        },
        () => {
          this.interval = setInterval(() => {
            if (this.state.totalSteps === this.state.currentStep) {
              this.clearSliderInteval();
              this.setState(
                {
                  left: "0%",
                  currentStep: 1,
                },
                () => {
                  this.props.onLegendClick(
                    `${legendMap[this.state.currentStep * this.props.step]}`
                  );
                }
              );
            } else {
              const currentStep = this.state.currentStep + 1;
              this.setState((prevState) => ({
                currentStep,
                left: `${
                  currentStep * prevState.perStepWidth - prevState.perStepWidth
                  }%`,
              }));
              this.props.onLegendClick(
                `${legendMap[currentStep * this.props.step]}`
              );
            }
          }, 2000);
        }
      );
    } else {
      this.clearSliderInteval();
    }
  };

  createLegend = (steps, step) => {
    const legend = [];
    for (let i = 0; i <= steps; i++) {
      legend.push(
        <button
          key={legendMap[i * step]}
          className="insights-legend-btn"
          style={{
            left:
              i === 0
                ? "calc(0% - 17px)"
                : `calc(${i * this.state.perStepWidth}% - 17px)`,
          }}
          onClick={() => this.handleLegendClick(i)}
          disabled={i === 0}
        >
          {legendMap[i * step]}
        </button>
      );
    }
    return legend;
  };

  render() {
    const { width, left, playing } = this.state;
    return (
      <div className="insights-slider">
        <div className="slider-actions">
          <button className="slider-play-btn" onClick={this.handleSliderPlay}>
            <i
              className={classNames("sf-icon", playing ? "i-pause" : "i-play")}
            />
          </button>
        </div>
        <div className="slider-container">
          <div className="slider">
            <div className="slide" style={{ width, left }}></div>
          </div>
          <div className="slider-legend">
            {this.createLegend(this.state.totalSteps, this.props.step)}
          </div>
        </div>
      </div>
    );
  }
}

function getSelectedKeyNames(obj) {
  const keys = [];
  Object.keys(obj).forEach((key) => {
    if (obj[key] === true) {
      keys.push(key);
    }
  });
  return keys;
}

class Insights extends Component {


  constructor(props) {
    super(props);
    this.datePickerRef = React.createRef();

    this.state = {
      filters: {
        incident: true,
        verified: true,
        acknowledged: false,
      },

      date: new Date(),
      step: "4",
      loading: true,
      selectedHour: "04:00",
      markers: [],
      center: { lat: 25.296938, lng: 55.341385 },
      zoom: 8,
    };
  }

  componentWillMount() {
    const { user } = this.props;
    const {
      incident,
      verified,
      acknowledged,
    } = user.permissions.insightsFilter;
    const filters = {
      incident,
      verified,
      acknowledged,
    };

    const center = {
      lat: user.organization.coordinates[0] || 25.296938,
      lng: user.organization.coordinates[1] || 55.341385,
    };

    const zoom = user.organization.zoom || 14;

    this.setState({
      filters,
      center,
      zoom,
    });
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    this.setState({ loading: true });
    const { date, step, filters } = this.state;
    this.props
      .fetchEvents({
        date:
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : +date.getMonth() + 1) +
          "-" +
          (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()),
        step,
        events: getSelectedKeyNames(filters),
      })
      .then(() => {
        this.setState(
          {
            loading: false,
          },
          this.filterMapMarkers
        );
      });
  };
  handleExportHistory = () => {
    this.setState({ loading: true });
    const { date, step, filters } = this.state;
    exportEventsHistory({
      date:
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : +date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()),
      step,
      events: getSelectedKeyNames(filters),
    })
      .then(({ data }) => {
        fileDownload(data, `Events-Insight-${date.getTime()}.csv`);
        logAmplitudeEvent({
          event_type: INSIGHT_DOWNLOAD_REPORT_OF_SELECT_DATE,
        }).catch(() => { });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  handleFilterChange = (e) => {
    const name = e.target.name;
    logAmplitudeEvent({ event_type: e.target.title }).catch(() => { });
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          [name]: !prevState.filters[name],
        },
      }),
      this.fetchEvents
    );
  };
  handleIntervalChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
        selectedHour: `${legendMap[e.target.value]}`,
      },
      this.fetchEvents
    );
  };
  handleDateChange = (date) => {
    this.setState(
      {
        date,
      },
      this.fetchEvents
    );
    logAmplitudeEvent({ event_type: INSIGHT_SELECT_DATE }).catch(() => { });
  };
  handleDateChangeControl = (action) => {
    if (!action) return;
    const { date } = this.state;
    const nextDate = date;
    if (action === "add") {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    if (action === "subtract") {
      nextDate.setDate(nextDate.getDate() - 1);
    }
    this.setState({ date: nextDate }, this.fetchEvents);
  };

  handleLegendClick = (time) => {
    this.setState(
      {
        selectedHour: time,
      },
      this.filterMapMarkers
    );
  };

  filterMapMarkers = () => {
    this.setState({
      markers: this.props.events[this.state.selectedHour] || [],
    });
  };
  toggleDatePicker = () => {
    if (this.datePickerRef) {
      this.datePickerRef.current.toggleCalendar();
    }
  };
  render() {
    const {
      incident,
      verified,
      acknowledged,
    } = this.props.user.permissions.insightsFilter;
    return (
      <>
        {this.state.loading && <LoadingMask />}
        <div className="insights">
          <Header title="Insights" />
          <div className="insights-content">
            <div className="panel-container">
              <div className="insights-toggle-filters single-date-picker">
                <div className="status-fitlers">
                  <ToggleSwitch
                    onChange={this.handleFilterChange}
                    name="incident"
                    label="Incident"
                    className="incident"
                    checked={this.state.filters["incident"]}
                    disabled={!incident}
                    title={INSIGHTS_SWITCH_EVENT_INCIDENT}
                  />
                  <ToggleSwitch
                    onChange={this.handleFilterChange}
                    name="verified"
                    label="Verified" // updated after QA ask to replace the name form verified to Verified
                    className="verified"
                    checked={this.state.filters["verified"]}
                    disabled={!verified}
                    title={INSIGHTS_SWITCH_EVENT_VERIFIED}
                  />
                  <ToggleSwitch
                    onChange={this.handleFilterChange}
                    name="acknowledged"
                    label="Acknowledged"
                    className="acknowledged"
                    checked={this.state.filters["acknowledged"]}
                    disabled={!acknowledged}
                    title={INSIGHTS_SWITCH_EVENT_ACKNOWLEDGED}
                  />
                  <IntervalSelect
                    onChange={this.handleIntervalChange}
                    value={this.state.step}
                    name="step"
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <DatePicker
                    value={this.state.date}
                    onChange={this.handleDateChange}
                    calendarIcon={<i className="sf-icon i-calendar" />}
                    ref={this.datePickerRef}
                  >
                    <Moment
                      onClick={this.toggleDatePicker}
                      className="insights-date"
                      format="DD.MM.YYYY"
                      local
                    >
                      {this.state.date}
                    </Moment>
                    <div className="date-controls">
                      <i
                        onClick={() => {
                          this.handleDateChangeControl("add");
                        }}
                        className="sf-icon i-chevron-down date-up"
                      />
                      <i
                        onClick={() => {
                          this.handleDateChangeControl("subtract");
                        }}
                        className="sf-icon i-chevron-down date-down"
                      />
                    </div>
                  </DatePicker>
                  {/* <ExportButton
                    style={{ marginLeft: "5px", marginRight: "-10px" }}
                    onClick={this.handleExportHistory}
                  /> */}
                </div>
              </div>

              <div className="insights-google-map">
                <GoogleMap
                  mapContainerStyle={{
                    height: "697px",
                    width: "100%",
                    borderRadius: "5px",
                  }}
                  mapContainerClassName="gm-overides"
                  center={this.state.center}
                  zoom={this.state.zoom}
                  options={{
                    disableDefaultUI: true,
                    styles: legacyMapTheme,
                  }}
                >
                  {this.state.markers.map((marker) => (
                    <Marker
                      key={marker.mac}
                      position={{
                        lat: marker.coordinates[0],
                        lng: marker.coordinates[1],
                      }}
                      icon={mapMarkerIcon[`event-${marker.status}`]}
                      opacity={opacityMap[marker.totalOccurence] || 1}
                    />
                  ))}
                </GoogleMap>
              </div>
              <InsightSlider
                onLegendClick={this.handleLegendClick}
                step={parseInt(this.state.step)}
                filters={this.state.filters}
                date={this.state.date}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ insights, user }) => ({
  events: insights.events,
  user,
});

export default connect(mapStateToProps, { fetchEvents })(Insights);
