import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import classNames from "classnames";
// import fileDownload from "js-file-download";
import SlidingModal from "../ReactSlideModal";
import GatewayInformation from "../gatewayDetail/gatewayInfromation";
import ContactDetail from "../gatewayDetail/contactDetail";
import { TimeLine } from "../gatewayDetail/gatewayDetailTimeline";
import { getAlarmDetail, exportEventHistoryPdf } from "../../api";
import { LoadingMask } from "../loadingMask";
import { toast } from "../toast";
import PdfDocument from './PdfDocument';
import { PDFDownloadLink } from "@react-pdf/renderer";

const TimelineDate = ({ date, position = "left" }) => (
  <div className="timeline-legend">
    <span className="bordered-line" />
    <div className={`timeline-date ${position}`}>{date}</div>
  </div>
);

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      activeTabIndex: 0,
      eventDetail: null,
      loading: false,
      id: null,
    };
  }

  componentDidMount() {
    Modal.setAppElement(this.el);
    this.setState({ loading: true, activeTabIndex: 0 });
    getAlarmDetail(this.props.id)
      .then(({ data }) => {
        this.setState({ eventDetail: data.data, loading: false, id: this.props.id });
      })
      .catch((error) => {
        this.setState({ loading: false });
        toast("error", error.message);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && this.props.id !== nextProps.id) {
      this.setState({ loading: true, activeTabIndex: 0 });
      getAlarmDetail(nextProps.id)
        .then(({ data }) => {
          this.setState({ eventDetail: data.data, loading: false, id: nextProps.id });
        })
        .catch((error) => {
          this.setState({ loading: false });
          toast("error", error.message);
        });
    }
  }

  handleTabBtnClick = (e) => {
    if (this.state.activeTabIndex === e.target.tabIndex) {
      return;
    }
    this.setState({ activeTabIndex: e.target.tabIndex });
  };

  renderTimeline = () => {
    const { eventDetail } = this.state;
    const { timelineDetails } = eventDetail;

    return Object.keys(timelineDetails).map((date, i) => (
      <Fragment key={date}>
        <TimelineDate date={timelineDetails[date].date} />
        <div className="detail-box timeline-box">
          <TimeLine timeline={timelineDetails[date].events} />
        </div>
        <TimelineDate position="right" date={timelineDetails[date].date} />
      </Fragment>
    ));
  };

  render() {
    const { eventDetail } = this.state;
    const ref = React.createRef();
    const closeModal = () => {
      this.props.onClose();
      this.setState({ eventDetail: null })
    }


    return (
      <div ref={(ref) => (this.el = ref)}>
        <SlidingModal isOpen={this.props.visible} width="386px">
          {this.state.loading && <LoadingMask />}
          <div className="history-event-detail" ref={ref}>
            <div className="history-detail-header">
              <h2>Incident Details &nbsp;&nbsp;</h2>
              {eventDetail &&
                <PDFDownloadLink
                  document={<PdfDocument data={eventDetail ?? eventDetail} />}
                  fileName={`Events-History-${this.state.id}.pdf`}
                >
                  <i className="sf-icon i-download" />
                </PDFDownloadLink>
              }
              <i
                className="sf-icon i-modal-close"
                onClick={() => closeModal()}
              />
            </div>

            <div className="history-detail-tabs">
              <div className="menu-sub-tabs">
                <button
                  className={classNames("sub-tab", {
                    active: this.state.activeTabIndex === 0,
                  })}
                  onClick={this.handleTabBtnClick}
                  tabIndex={0}
                >
                  Details
                </button>
                <button
                  className={classNames("sub-tab", {
                    active: this.state.activeTabIndex === 1,
                  })}
                  onClick={this.handleTabBtnClick}
                  tabIndex={1}
                >
                  Timeline Details
                </button>
              </div>
            </div>

            {this.state.activeTabIndex === 0 && (
              <div className="history-detail-body">
                <div className="gateway-information history-section">
                  {eventDetail && eventDetail.gatewayDetails && (
                    <>
                      <h3 className="section-title">Occupancy Details</h3>
                      <ContactDetail
                        mac={eventDetail.gatewayDetails.macAddress}
                        contacts={eventDetail.gatewayDetails.contacts}
                        showCallBtn={false}
                      />

                      <GatewayInformation
                        countryFields={eventDetail.gatewayDetails.countryFields}
                        information={{
                          address: eventDetail.gatewayDetails.address.fullAddress,
                          floor: eventDetail.gatewayDetails.info.floors,
                          childrens: eventDetail.gatewayDetails.info.infants,
                          adults: eventDetail.gatewayDetails.info.persons,
                          handicapped: eventDetail.gatewayDetails.info.disables,
                          pets: eventDetail.gatewayDetails.info.pets,
                          elder: eventDetail.gatewayDetails.info.persons,
                        }}
                      />
                    </>
                  )}
                </div>

                {/* <div className="response-unit-details history-section">
                  <h3 className="section-title">Response Unit Details</h3>
                  <div className="detail-box">
                    <h3>Actual Distance and Time</h3>
                    <div className="distance-time-container">
                      <div className="trip-distance">
                        <i className="sf-icon i-map-distance-outline" />
                        <span>1.8 Km</span>
                      </div>
                      <div className="trip-time">
                        <i className="sf-icon i-map-time-outline" />
                        <span>20 Mins</span>
                      </div>
                    </div>
                    <button className="btn btn-blue btn-view-realtime-trip ">
                      View Realtime Trip
                    </button>
                  </div>
                </div> */}
              </div>
            )}

            {this.state.activeTabIndex === 1 && (
              <div className="timeline-detail-body">
                {eventDetail &&
                  eventDetail.timelineDetails &&
                  Object.keys(eventDetail.timelineDetails).length > 0 &&
                  this.renderTimeline()}
              </div>
            )}
          </div>
        </SlidingModal>
      </div>
    );
  }
}

export default EventDetail;
