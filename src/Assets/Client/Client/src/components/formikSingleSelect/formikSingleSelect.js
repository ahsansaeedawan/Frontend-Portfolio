import React from "react";
import { getDealerIdWithSubDealer } from "../../api";
import Select from 'react-select';
import classNames from "classnames";
import { LoadingMask } from "../loadingMask";

class FormikSingleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      subDealer: null,
      dealer: null,
      isLoading: true,
      defaultDealer: "",
      defaultSubDealer: "",
      orgId: ""
    };

  }


  componentDidMount() {
    getDealerIdWithSubDealer(this.props.orgId).then(({ data }) => {
      this.setState({ isLoading: false });
      let index = this.props.dealerValue != undefined && this.props.dealerValue != "" ? this.findIndex(this.props.dealerValue, data) : 0;
      let dealer = data.map((e) => ({ value: e.dealerId, label: e.dealerName }));
      let subDealer = data[index].subDealer.map((e) => ({ value: e.id, label: e.name }));
      if (this.props.dealerValue !== undefined && this.props.dealerValue !== "") {
        this.setState({
          defaultDealer: dealer.filter((e) => (e.value === this.props.dealerValue)),
          defaultSubDealer: subDealer.filter((e) => (e.value === this.props.subDealerValue))
        })
      }
      this.setState({ dealer: dealer, subDealer: subDealer, data: data, });
    });

  }

  findIndex = (dealerValue, data) => {
    for (let i = 0; i < data.length; i++) {
      if (dealerValue == data[i].dealerId) {
        return i;
      }
    }
    return -1;
  }

  handleChangeDropDown = (e, list) => {
    if (list === "dealer") {
      let dealer = this.state.data.filter((obj) => { return obj.dealerId == e.value })
      let subDealer = dealer[0].subDealer.map((e) => ({ value: e.id, label: e.name }));
      this.setState({
        subDealer: subDealer
      });
      this.props.dealerOnValueChange(this.props.dealerName, e.value);
    }
    else if (list === "subDealer") {
      this.props.subDealerOnValueChange(this.props.subDealerName, e.value);

    }
  }

  render() {
    return (
      <>
        {this.state.isLoading && <LoadingMask />}
        {
          this.state.dealer &&
          <div className={classNames("form-group", {
            "has-errors": this.props.dealerErrors,
            valid: !this.props.dealerErrors
          })}>
            <Select
              className="react-multi-select "
              classNamePrefix="react-select"
              placeholder="Select Dealer "
              name={this.props.dealerName}
              isSearchable={false}
              options={this.state.dealer}
              onBlur={this.props.dealerOnBlur}
              onChange={(value) => this.handleChangeDropDown(value, "dealer")}
              defaultValue={this.state.defaultDealer && this.state.defaultDealer[0]}
            />
            {this.props.dealerErrors && <span className="form-field-error">{this.props.dealerErrors}</span>}
          </div>
        }
        {
          this.state.subDealer &&

          <div className={classNames("form-group", {
            "has-errors": this.props.subDealerErrors,
            valid: !this.props.subDealerErrors
          })}>
            <Select
              className="react-multi-select "
              classNamePrefix="react-select"
              placeholder={"Select Subdealer "}
              name={this.props.subDealerName}
              isSearchable={false}
              options={this.state.subDealer}
              onBlur={this.props.subDealerOnBlur}
              onChange={(value) => this.handleChangeDropDown(value, "subDealer")}
              defaultValue={this.state.defaultSubDealer && this.state.defaultSubDealer[0]}

            />
            {this.props.subDealerErrors && <span className="form-field-error">{this.props.subDealerErrors}</span>}
          </div>
        }
      </>

    );
  }

}
export default FormikSingleSelect;