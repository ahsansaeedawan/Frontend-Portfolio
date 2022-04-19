import React, { Component } from "react";
// import ToggleSwitch from "../toggleSwitch/toggleSwitch";
import { LoadingMask } from "../loadingMask";
import {
  getNearbyResponseUnits,
  assignAlarm,
  unassignAlarm,
  updateResponseUnitStatus,
} from "../../api";
import { calculateDistance } from "../../utils/googleMapUtils";
import { SocketContext } from "../../context";
import cn from "classnames";
import "./vehicleAssignment.css";
import InfoMessage from "../infoMessage/infoMessage";
import { error, success } from "../../components/toast";
import {
  ALARM_ASSIGN_SUCCEESS,
  ALARM_UNASSIGN_SUCCEESS,
} from "../../constants/status";
import { getErrorMessage } from "../../utils/commonUtil";
import { NO_RESPONSE_UNIT_AVALIABLE_NEARBY } from "../../constants/messages";
import { useDispatch } from "react-redux";
import { GATEWAY_ASSIGNMENT_COMPLETE } from "../../constants";
import { confirmationAlert } from "../confirmationAlert";

function VehicleListItem({ vehicle, onAssign, onUnassign }) {
  function assignVehicle() {
    onAssign(vehicle._id);
  }
  function unassignVehicle() {
    onUnassign(vehicle._id);
  }
  // function onVehicleStatusChange() {
  //   onStatusChange(vehicle);
  // }

  return (
    <div className="vehicle-list-item">
      <div className="vehicle-info">
        <img className="vehicle-icon" src="/assets/icons/car-icon.png" alt="" />
        <h3 className="vehicle-name">{`${vehicle.first_name} ${vehicle.last_name}`}</h3>
        <span
          className={`vehicle-status ${
            vehicle.online ? "vehicle-online" : "vehicle-offline"
            }`}
        />
      </div>

      <div className="vehicle-analytics">
        <div className="vehicle-duration">
          <img src="/assets/icons/time-icon.png" alt="" />
          <span>{vehicle.duration}</span>
        </div>
        <div className="vehicle-duration">
          <img src="/assets/icons/distance-icon.png" alt="" />
          <span>{vehicle.distance}</span>
        </div>
      </div>
      <div className="vehicle-analytics vehicle-cellno">
        <div className="vehicle-contact">
          <span className="number abs-sf-icon">{vehicle.contact}</span>
        </div>
      </div>

      <div className="vehicle-actions">
        {/* <ToggleSwitch
          onChange={onVehicleStatusChange}
          checked={vehicle.online}
          className="status-toggle"
          label={vehicle.online ? "Online" : "Offline"}
        /> */}

        <div className="vehicle-status-info">
          <span>{vehicle.online ? "Online" : "Offline"}</span>
          <span
            className={`vehicle-status ${
              vehicle.online ? "vehicle-online" : "vehicle-offline"
              }`}
          />
          <span
            className={cn("vehicle-current-status", {
              "waiting-status ": !vehicle.online,
            })}
          >
            {vehicle.online ? "Accepted" : "Waiting"}
          </span>
        </div>
        <button
          onClick={vehicle.available ? assignVehicle : unassignVehicle}
          disabled={!vehicle.online}
          className={cn("btn-action", {
            "active-btn": vehicle.available,
            "unassign-btn": !vehicle.available,
          })}
        >
          {vehicle.available ? "Assign" : "Unassign"}
        </button>
      </div>
    </div>
  );
}

function VehicleList({ vehicles, onAssign, onUnassign, onStatusChange, mac }) {
  const dispatch = useDispatch();
  // if (!vehicles || vehicles.length === 0) return null; // when you will uncomment this code the done and continue button will show while resp units are available
  function handleAssignmentComplete() {
    confirmationAlert({
      title: `Are you sure you want to move to "Incident Closed"?`,
      message: `This action will close the assignment and you will no longer be able to to assign / unassign Rapid Response.`,
      confirmBtnText: "Yes",
      cancelBtnText: "No",
      iconClass: "i-info-msg",
      containerClass: "dark-alert",
      onConfirm: () => {
        dispatch({
          type: GATEWAY_ASSIGNMENT_COMPLETE,
          payload: { mac },
        });
      },
    });
  }
  return (
    <div className="vehicle-list">
      {vehicles.map((vehicle) => {
        if (vehicle.siteDetail.mac === mac) {
          return (
            <VehicleListItem
              onAssign={onAssign}
              onUnassign={onUnassign}
              onStatusChange={onStatusChange}
              key={vehicle._id}
              vehicle={vehicle}
            />);
        }

        if (vehicle.siteDetail.mac === null) {
          return (
            <VehicleListItem
              onAssign={onAssign}
              onUnassign={onUnassign}
              onStatusChange={onStatusChange}
              key={vehicle._id}
              vehicle={vehicle}
            />);
        }

      })}
      <button onClick={handleAssignmentComplete} className="btn-action-submit">
        Done and continue
      </button>
    </div>
  );
}

class VehicleAssignment extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      units: [],
    };
  }


  componentDidMount() {
    this.getNearByResponseUnits();
  }

  componentWillUnmount() {
    this.props.socket.removeListener(
      "alarmAssigned",
      this.alarmAssignedSocketHandler
    );
    this.props.socket.removeListener(
      "alarmUnassigned",
      this.alarmUnassignedSocketHandler
    );
    this.props.socket.removeListener(
      "unitOnlineStatus",
      this.statusChangeSocketHandler
    );
    this.props.socket.removeListener(
      "responseUnitLogout",
      this.logoutSocketHandler
    );
    this.props.socket.removeListener(
      "newResponseUnitLogin",
      this.getNearByResponseUnits
    );
  }


  handleChangeStatus = (vehicle) => {
    this.setState({ loading: true });
    updateResponseUnitStatus(!vehicle.online, vehicle._id)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((e) => {
        this.setState({ loading: false });
        console.log(e);
      });
  };
  getNearByResponseUnits = () => {
    const { lat, lng } = this.props;
    getNearbyResponseUnits({
      coordinates: [lng, lat],
      mac: this.props.mac,
    }).then(({ data }) => {
      const units = data.data.units;
      if (!units || units.length === 0) {
        this.setState({ loading: false, units: [] });
        return;
      }

      const origins = units.map((unit) => ({
        lat: unit.location.coordinates[1],
        lng: unit.location.coordinates[0],
      }));

      const destination = { lat: this.props.lat, lng: this.props.lng };
      calculateDistance(
        {
          destination,
          origins,
        },
        (resp, status) => {
          resp.rows.forEach((row, i) => {
            units[i].distance = row.elements[0].distance.text;
            units[i].duration = row.elements[0].duration.text;
          });
          this.setState({ units, loading: false });
          if (this.props.socket) {
            this.listenAlarmAssigned(this.props.socket);
            this.listenAlarmUnassigned(this.props.socket);
            this.listenRespUnitOnlineStatus(this.props.socket);
            this.listenRespUnitLogout(this.props.socket);
            this.listenNewRespUnitOnline(this.props.socket);
          }
        }
      );
    });
  }

  alarmAssignedSocketHandler = (payload) => {
    if (this.state.units) {
      const units = this.state.units.map((unit) => {
        if (unit._id === payload.unitId) {
          unit.available = false;
          unit.siteDetail = payload.siteDetail;
        }
        return unit;
      });
      this.setState({
        units,
      });
    }
  };

  alarmUnassignedSocketHandler = (payload) => {
    if (this.state.units) {
      const units = this.state.units.map((unit) => {
        if (unit._id === payload.unitId) {
          unit.available = true;
          unit.siteDetail = { mac: null, destination: null };
        }
        return unit;
      });
      this.setState({
        units,
      });
    }
  };

  statusChangeSocketHandler = (payload) => {
    if (this.state.units) {
      const units = this.state.units.map((unit) => {
        if (unit._id === payload.unitId) {
          unit.online = payload.online;
        }

        return unit;
      });
      this.setState({
        units,
      });
    }
  };


  logoutSocketHandler = (payload) => {
    this.setState({ loading: true });
    let tempArr = this.state.units;
    if (tempArr) {
      tempArr = tempArr.filter((unit) => {
        if (unit._id !== payload.unitId) {
          return unit
        }
      })
      this.setState({ units: tempArr, loading: false })
    }
  };

  listenRespUnitLogout = (socket) => {
    socket.on("responseUnitLogout", this.logoutSocketHandler);
  };


  listenNewRespUnitOnline = (socket) => {
    socket.on("newResponseUnitLogin", () => {
      this.setState({ loading: true });
      this.getNearByResponseUnits()
    })
  }

  listenAlarmAssigned = (socket) => {
    socket.on("alarmAssigned", this.alarmAssignedSocketHandler);
  };

  listenAlarmUnassigned = (socket) => {
    socket.on("alarmUnassigned", this.alarmUnassignedSocketHandler);
  };

  listenRespUnitOnlineStatus = (socket) => {
    socket.on("unitOnlineStatus", this.statusChangeSocketHandler);
  };


  handleAssignAlarm = async (responseUnit) => {
    this.setState({ loading: true });
    try {
      const data = await assignAlarm(this.props.mac, responseUnit);
      if (data) {
        success(ALARM_ASSIGN_SUCCEESS);
      }
      this.setState({ loading: false });
    } catch (e) {
      error(getErrorMessage(e));
      this.setState({ loading: false });
    }
  };

  handleUnassignAlarm = async (responseUnit) => {
    this.setState({ loading: true });
    try {
      const data = await unassignAlarm(this.props.mac, responseUnit);
      if (data) {
        success(ALARM_UNASSIGN_SUCCEESS);
      }
      this.setState({ loading: false });
    } catch (e) {
      error(getErrorMessage(e));
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loading) return <LoadingMask />;
    return (
      <div className="vehicle-assignment">
        {!this.state.loading && this.state.units.length === 0 && (
          <InfoMessage message={NO_RESPONSE_UNIT_AVALIABLE_NEARBY} />
        )}
        <VehicleList
          onAssign={this.handleAssignAlarm}
          onUnassign={this.handleUnassignAlarm}
          onStatusChange={this.handleChangeStatus}
          vehicles={this.state.units}
          mac={this.props.mac}
        />
      </div>
    );
  }
}

const VehicleAssignmentWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <VehicleAssignment {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default VehicleAssignmentWithSocket;
