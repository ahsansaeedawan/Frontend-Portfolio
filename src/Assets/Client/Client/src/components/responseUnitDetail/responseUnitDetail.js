import React from 'react';
import { connect } from "react-redux";
import Modal from "react-modal";
import fileDownload from "js-file-download";
import SlidingModal from "../ReactSlideModal";
import "./responseUnitDetail.css"
import classNames from "classnames";
import VehicleDetail from './vehicleDetail';
import RouteDetails from './routeDetail';
import { LoadingMask } from '../loadingMask';
import { distanceFormatter, timeFormatter } from '../../utils/columnFormatter';
import { exportResponseUnitEventHistoryPdf } from "../../api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocumentResponseUnit from './PdfDocumentResponseUnit'

const TabButton = ({ activeTabIndex, tabIndex, onClick, label }) => {
    return (
        <button
            className={classNames("tab-btn", {
                "active-tab": activeTabIndex === tabIndex
            })}
            onClick={onClick}
            tabIndex={tabIndex}
        >
            {label}
        </button>
    );
};

const SettingTabButtons = ({ onClick, activeTabIndex }) => {
    return (
        <>
            <TabButton
                label="Details"
                tabIndex={0}
                onClick={onClick}
                activeTabIndex={activeTabIndex}
            />
            {/* <TabButton
                label="Timeline Details"
                tabIndex={1}
                onClick={onClick}
                activeTabIndex={activeTabIndex}
            /> */}
        </>
    );
};

const Details = ({ history }) => {
    return (
        <div>
            {/* Hide due to static data */}
            {/* <VehicleDetail status={history.type} carName="Yellow Toyota Corolla MVC-2020" /> */} 
            <br/>
            <RouteDetails 
                destinationAddress={history.endingAddress} 
                initialAddress={history.startingAddress} 
                initialTime={timeFormatter(history.createdAt)} 
                arrivalTime={history.updatedAt != null ? timeFormatter(history.updatedAt) : "-- --"} 
                actualDistance={distanceFormatter(history.distance)} time={history.timeDiff} 
                />
        </div>
    );
}
class ResponseUnitDetailPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTabIndex: 0,
            loading: false,
            event: null,
            history: null,
            id: null
        };
    }
    componentDidMount() {
        Modal.setAppElement(this.el);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
            const history = this.props.responseUnits.find((e) => e.uuid === nextProps.id);
            this.setState({ history });
        }
    }
    exportResponseUnitEventHistoryPdfApi = () => {
        const { history } = this.state;
        const id = history.alarmId;
        exportResponseUnitEventHistoryPdf(id).then((res) => {
            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
            fileDownload(pdfBlob, `ResponseUnit-Events-History-${id}.pdf`)
        }).catch((err) => {
            console.log(err);
        })
    }

    handleTabBtnClick = e => {
        if (this.state.activeTabIndex === e.target.tabIndex) return;
        this.setState({ activeTabIndex: e.target.tabIndex });
    };


    render() {

        const { activeTabIndex, loading } = this.state;
        return (
            <div ref={(ref) => (this.el = ref)}>
                <SlidingModal isOpen={this.props.visible} width="386px">
                    {loading && <LoadingMask />}
                    <div className="detail-panel-container">
                        <div className="detail-panel-title">
                            <h2>Response Unit Details</h2>
                            {this.state.history &&
                                <PDFDownloadLink
                                    document={<PdfDocumentResponseUnit data={this.state.history} />}
                                    fileName={`Events-History-${this.state.id}.pdf`}
                                >
                                    <i className="sf-icon i-download" />
                                </PDFDownloadLink>
                            }
                            <i
                                className="sf-icon i-modal-close"
                                onClick={this.props.onClose}
                            />
                            <i className="sf-icon i-modal-close"
                                onClick={this.props.onClose}
                            />
                        </div>
                        <div className="tabs-btn-container">
                            <SettingTabButtons
                                onClick={this.handleTabBtnClick}
                                activeTabIndex={activeTabIndex}
                            />

                        </div>
                        <div className="detail-panel-body">
                            {activeTabIndex === 0 && <Details history={this.state.history} />}
                            {activeTabIndex === 1}

                        </div>
                    </div>

                </SlidingModal>
            </div>

        );
    }
}

const mapStateToProps = (({ history }) => ({ responseUnits: history.responseUnits }));

export default connect(mapStateToProps, {})(ResponseUnitDetailPanel);