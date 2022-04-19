import React, { Component } from "react";
import classNames from "classnames";
import { Header } from "../../../components/adminHeader";
import EventHistory from "./eventHistory";
import ResponseUnitHistory from "./responseUnitHistory";
import { UserContext } from "../../../context";
import "./history.css";

class History extends Component {
  // static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };

  }

  handleTabBtnClick = (e) => {
    if (this.state.activeTabIndex === e.target.tabIndex) {
      return;
    }
    this.setState({ activeTabIndex: e.target.tabIndex });
  };

  render() {
    return (
      <>
        <div className="history">
          <Header title="History" />

          <div className="history-content">
            <div className="panel-container panel-with-header pos-r">
              <div className="panel-header">
                <div className="tabs-btn-container">
                  <button
                    className={classNames("tab-btn", {
                      "active-tab": this.state.activeTabIndex === 0
                    })}
                    onClick={this.handleTabBtnClick}
                    tabIndex={0}
                  >
                    Event
                  </button>
                  <button
                    className={classNames("tab-btn", {
                      "active-tab": this.state.activeTabIndex === 1,
                    })}
                    onClick={this.handleTabBtnClick}
                    tabIndex={1}
                  >
                    Rapid Response
                    </button>

                </div>
              </div>
              <div className="panel-body">
                {this.state.activeTabIndex === 0 && <EventHistory />}
                {this.state.activeTabIndex === 1 && <ResponseUnitHistory />}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default History;
