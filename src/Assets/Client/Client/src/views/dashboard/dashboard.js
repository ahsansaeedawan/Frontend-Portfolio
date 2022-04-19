import React, { Component } from "react";
import { connect } from "react-redux";
import {
  openDashboardMenu,
  toggleDashboardMenuOpen,
  openGatewayDetails,
  toggleGatewayDetailsView,
  closeGatewayDetails,
  fetchAllGateways,
  listenGatewayStatusUpdates,
  listenRespUnitLocationUpdate,
  listenRespUnitStatusUpdate,
  listenRefreshDashboard,
  fetchAllResponseUnits,
  incidentAcknowledged,
  verifyIncident,
  actionIncident,
  showAllGatewayOnMap,
  disableGatewayAssignOperation,
  selectGatewayTab,
  listenAlarmAssigned,
  listenAlarmUnassigned,
  listenGatewayAssigned,
  listenGatewayUnassigned,
  listenRespUnitStatusChangeRequest,
  listenAlarmClose,
  listenResponseUnitArrived,
  listenGatewayOnlineStatus,
  listenGatewayAddonUpdate,
  listenGatewaySubscriptionUpdate,
  listenGatewayDataUpdate,
  listenNewResponseUnitOnline,
  listenSlaBreach,
  listentransferAlertSocket,
  listenResponseUnitLogout,
  listenCallInProgress
} from "../../actions/dashboardActions";
import { Menu } from "../../components/menu";
import { GatewayInfoPanel } from "../../components/gatewayInfoPanel";
import { GatewayDetail } from "../../components/gatewayDetail";
import { DashboardMap } from "../../components/dashboardMap";
import { LoadingMask } from "../../components/loadingMask";
import SocketContext from "../../context/socket-context";
import { logAmplitudeEvent } from "../../api";
import {
  DASHBOARD_VIEW_GATEWAY_DETAIL_AND_OPERATION_TAB,
  DASHBOARD_MENU_GATEWAY_DETAIL_AND_OPERATION_TAB,
  VEHICLES_SEARCH_VEHICLES,
  DASHBOARD_MENU_PANEL,
} from "../../constants/amplitude";
import {
  VEHICLE_ONLINE,
  VEHICLE_OFFLINE,
  VEHICLE_REQUEST,
} from "../../constants/status";
import { sortGatewaysByUpdatedAt } from "../../utils/commonUtil";
import { Notifications } from "../../components/notifications";
import { SlaNotification } from "../../components/slaNotification";
import { ResponseUnitTrasnferNotification } from "../../components/transferRequestAlert";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      menuFirstLoad: false,
      eventSearchValue: "",
      vehicleSearchValue: "",
      gatewayFilterStatus: "incident",
      vehicleFilterStatus: "online",
      gateways: [],
      vehicles: [],
      mapCenter: {
        lat: this.props.user && this.props.user.organization
          ? this.props.user.organization.coordinates[0]
          : 25.204849,
        lng: this.props.user && this.props.user.organization
          ? this.props.user.organization.coordinates[1]
          : 55.270782,
      },
      mapZoom: this.props.user &&
        this.props.user.organization &&
        this.props.user.organization.zoom
        ? this.props.user.organization.zoom
        : 11,
      selectedGateway: null,
      loading: true,
      assignOperationDisable: false,
      gatewayShowOnMap: []
    };
  }

  componentWillReceiveProps(nextProps) {

    this.filterGatewaysOnMap();

    if (this.props.gateways !== nextProps.gateways) {
      this.filterGateways(nextProps.gateways);
    }

    if (this.props.responseUnits !== nextProps.responseUnits) {
      this.filterVehicles(nextProps.responseUnits);
    }
    if (!this.props.socket && nextProps.socket) {
      this.props.listenGatewayStatusUpdates(nextProps.socket);
      this.props.listenRefreshDashboard(nextProps.socket);
      this.props.listenGatewayAssigned(nextProps.socket);
      this.props.listenGatewayUnassigned(nextProps.socket);
      this.props.listenNewResponseUnitOnline(nextProps.socket);
      this.props.listenRespUnitLocationUpdate(nextProps.socket);
      this.props.listenRespUnitStatusUpdate(nextProps.socket);
      this.props.listenRespUnitStatusChangeRequest(nextProps.socket);
      this.props.listenAlarmAssigned(nextProps.socket);
      this.props.listenAlarmUnassigned(nextProps.socket);
      this.props.listenAlarmClose(nextProps.socket);
      this.props.listenResponseUnitArrived(nextProps.socket);
      this.props.listenGatewayOnlineStatus(nextProps.socket);
      this.props.listenGatewayDataUpdate(nextProps.socket);
      this.props.listenSlaBreach(nextProps.socket);
      this.props.listentransferAlertSocket(nextProps.socket);
      this.props.listenResponseUnitLogout(nextProps.socket);
      this.props.listenCallInProgress(nextProps.socket);
    }
  }

  componentDidMount() {
    if (
      !this.props.user.permissions.monitoring &&
      this.props.user.permissions.response
    ) {
      this.setState({ gatewayFilterStatus: "verified" });
    }

    this.props
      .fetchAllGateways()
      .then(() => {
        this.props.fetchAllResponseUnits();
      })
      .finally(() => {
        this.setState(
          {
            loading: false,
          },
          this.filterGateways,
          this.filterVehicles,
        );
      });
  }
  handleMenuTrigger = () => {
    /* Check if menu is loading first time, update firstload so we can show corresponding components */
    if (!this.state.menuFirstLoad) {
      this.setState(
        {
          menuFirstLoad: true,
        },
        this.props.openDashboardMenu,
        logAmplitudeEvent({ event_type: DASHBOARD_MENU_PANEL }).catch(() => { }),
      );
    } else {
      this.props.toggleDashboardMenuOpen();
    }
  };

  handleGatewayMarkerDetail = (gatewayId) => {
    const gateway = this.props.gateways.find((g) => g._id === gatewayId);
    this.setState({ selectedGateway: gateway });
    logAmplitudeEvent({
      event_type: DASHBOARD_VIEW_GATEWAY_DETAIL_AND_OPERATION_TAB,
    }).catch(() => { });
    if (!this.state.menuFirstLoad) {
      this.setState({ menuFirstLoad: true });
    }
    if (!this.props.appSetting.dashboardMenuOpen) {
      this.props.openDashboardMenu();
      setTimeout(() => {
        this.props.openGatewayDetails();
      }, 1000);
    } else {
      this.props.openGatewayDetails();
    }
  };

  handleNotificationViewDetail = (mac) => { //TODO here is gateway panel opener function!
    const gateway = this.props.gateways.find((g) => g.macAddress === mac);
    if (!gateway) return;
    this.setState({ selectedGateway: gateway });
    if (!this.state.menuFirstLoad) {
      this.setState({ menuFirstLoad: true });
    }
    if (!this.props.appSetting.dashboardMenuOpen) {
      this.props.openDashboardMenu();
      setTimeout(() => {
        this.props.openGatewayDetails();
      }, 1000);
    } else {
      this.props.openGatewayDetails();
    }
  };

  filterGatewaysOnMap = () => {
    const gateways = this.props.gateways.filter((gateway) => {
      const includeGateway = () => {
        if (gateway.status === "incident" || gateway.status === "verified" || gateway.status === "acknowledged" || gateway.status === "unverified") {
          this.setState({ assignOperationDisable: false });
          return true;
        }
        return false;
      };
      return includeGateway()
    });
    this.setState({
      gatewayShowOnMap: gateways.sort(sortGatewaysByUpdatedAt),
    });
  }

  filterGateways = (propGateways) => {
    const sourceGateways = propGateways ? propGateways : this.props.gateways;
    const gateways = sourceGateways.filter((gateway) => {
      const includeGateway = () => {
        if (this.state.gatewayFilterStatus === "all") {
          this.props.disableGatewayAssignOperation();
          this.setState({ assignOperationDisable: true });
          return true;
        }
        if (gateway.status === this.state.gatewayFilterStatus) {
          this.props.selectGatewayTab();
          this.setState({ assignOperationDisable: false });
          return true;
        }
        if (gateway.status === "unverified" && this.state.gatewayFilterStatus === "verified") {

          return true;
        }
        return false;
      };
      const searchKeyword = () => {
        if (gateway && gateway.countryFields && gateway.countryFields.value) {
          return (
            gateway.countryFields.value.indexOf(this.state.eventSearchValue) !==
            -1
          );
        } else {
          return true;
        }
      };
      return includeGateway() && searchKeyword();
    });
    this.setState({
      gateways: gateways.sort(sortGatewaysByUpdatedAt),
    });
  };

  filterVehicles = (propsVehicles) => {
    if (!this.props.responseUnits) return;
    const sourceVehicles = propsVehicles
      ? propsVehicles
      : this.props.responseUnits;
    const vehicles = sourceVehicles.filter((unit) => {
      const includeVehicle = () => {
        if (this.state.vehicleFilterStatus === VEHICLE_ONLINE) {
          return unit.online;
        }

        if (this.state.vehicleFilterStatus === VEHICLE_OFFLINE) {
          return !unit.online;
        }

        if (this.state.vehicleFilterStatus === VEHICLE_REQUEST) {
          return unit.request;
        }

        return false;
      };

      const searchKeyword = () => {
        return (
          unit.fullName
            .toUpperCase()
            .indexOf(this.state.vehicleSearchValue.toUpperCase()) !== -1
        );
      };

      return includeVehicle() && searchKeyword();
    });

    this.setState({ vehicles });
  };

  handleEventSearchChange = (e) => {
    this.setState({ eventSearchValue: e.target.value }, this.filterGateways);
  };

  handleVehicleSearchChange = (e) => {
    this.setState({ vehicleSearchValue: e.target.value }, this.filterVehicles);
    logAmplitudeEvent({ event_type: VEHICLES_SEARCH_VEHICLES }).catch(() => { });
  };

  handleGatewayDetailClose = () => {
    this.props.closeGatewayDetails();
  };

  handleTabChange = (gatewayFilterStatus) => {
    if (this.state.gatewayFilterStatus === gatewayFilterStatus) return;
    this.setState({ gatewayFilterStatus }, this.filterGateways);
  };

  handleVehicleTabChange = (vehicleFilterStatus) => {
    if (this.state.vehicleFilterStatus === vehicleFilterStatus) return;
    this.setState({ vehicleFilterStatus }, this.filterVehicles);
  };

  toggleGatewayDetails = (gatewayId) => {

    const gateway = this.props.gateways.find((g) => {
      return g._id === gatewayId
    });

    this.setState({ selectedGateway: gateway }, () => {
      this.props.openGatewayDetails();
    });
  };

  onGatewayAction = ({ macAddress, action, comments }) => {
    this.setState({ loading: true });
    return this.props
      .actionIncident({ macAddress, action, comments })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <>

        {this.state.loading && <LoadingMask />}
        <div className="dashboard">

          {/* Menu */}
          <Menu
            open={this.props.appSetting.dashboardMenuOpen}
            firstLoad={this.state.menuFirstLoad}
            eventSearch={this.state.eventSearchValue}
            vehicleSearch={this.state.vehicleSearchValue}
            onTrigger={this.handleMenuTrigger}
            onEventSearchChange={this.handleEventSearchChange}
            onVehicleSearchChange={this.handleVehicleSearchChange}
            gateways={this.state.gateways}
            vehicles={this.state.vehicles}
            onGatewayDetail={this.toggleGatewayDetails}
            onTabChange={this.handleTabChange}
            onVehicleTabChange={this.handleVehicleTabChange}
            selectedGateway={this.state.selectedGateway}
            isGatewayDetailVisible={this.props.appSetting
              .isGatewayDetailVisible}
            assignOperationDisable={this.state.assignOperationDisable}
          />

          {/* Map */}
          <DashboardMap
            gateways={this.props.appSetting.allGatewayOnMap ? this.props.gateways : this.state.gatewayShowOnMap}
            responseUnits={this.props.responseUnits}
            center={this.state.mapCenter}
            zoom={this.state.mapZoom}
            onMarkerClick={this.handleGatewayMarkerDetail}
          />

          {/* InfoPanel */}
          <GatewayInfoPanel
            open={this.props.appSetting.dashboardMenuOpen}
            firstLoad={this.state.menuFirstLoad}
            gateways={this.props.gateways}
            isGatewayDetailVisible={this.props.appSetting
              .isGatewayDetailVisible}
          />

          {/* Gateway Details */}
          <GatewayDetail
            onClose={this.handleGatewayDetailClose}
            onIncidentAcknowledged={this.props.incidentAcknowledged}
            onIncidentVerify={this.props.verifyIncident}
            onGatewayAction={this.onGatewayAction}
            gateway={this.state.selectedGateway}
            isVisible={this.props.appSetting.isGatewayDetailVisible}
            gatewayDetailInitialized={this.props.appSetting
              .gatewayDetailInitialized}
          />
        </div>

        {/* SLA Notification Panel */}
        <SlaNotification onViewDetail={this.handleNotificationViewDetail} />

        {/*Resppnse Unit Transfer Notification Panel */}
        <ResponseUnitTrasnferNotification onViewDetail={this.handleNotificationViewDetail} />

        {/* Notification Panel in Right bottom */}
        <Notifications onViewDetail={this.handleNotificationViewDetail} />
      </>
    );
  }
}

const mapStateToProps = ({ gateways, appSetting, user, responseUnits }) => ({
  gateways,
  appSetting,
  user,
  responseUnits,
});

const DashboardWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Dashboard {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default connect(mapStateToProps, {
  showAllGatewayOnMap,
  openDashboardMenu,
  toggleDashboardMenuOpen,
  openGatewayDetails,
  toggleGatewayDetailsView,
  closeGatewayDetails,
  fetchAllGateways,
  listenGatewayStatusUpdates,
  listenRefreshDashboard,
  actionIncident,
  incidentAcknowledged,
  verifyIncident,
  fetchAllResponseUnits,
  disableGatewayAssignOperation,
  selectGatewayTab,
  listenRespUnitLocationUpdate,
  listenAlarmAssigned,
  listenAlarmUnassigned,
  listenGatewayAssigned,
  listenGatewayUnassigned,
  listenRespUnitStatusUpdate,
  listenRespUnitStatusChangeRequest,
  listenAlarmClose,
  listenResponseUnitArrived,
  listenGatewayOnlineStatus,
  listenGatewayAddonUpdate,
  listenGatewaySubscriptionUpdate,
  listenGatewayDataUpdate,
  listenNewResponseUnitOnline,
  listenSlaBreach,
  listentransferAlertSocket,
  listenResponseUnitLogout,
  listenCallInProgress
})(DashboardWithSocket);
