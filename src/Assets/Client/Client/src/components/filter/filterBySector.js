import React from "react";

import { Accordion } from "../accordion";
import "./filterBySector.css";

function FilterBySector(props) {
  return (
    <div className="filter-by-sector">
      <Accordion
        title="Filter By Sectors"
        titleClass="accordion-label"
        iconClass="sf-icon i-chevron-down-after"
      >
        <div className="filter-by-sector-checkbox">
          <input type="checkbox" id="margham" />
          <label htmlFor="margham" className="checkbox-toggle">
            <i className="sf-icon i-sf-checkbox" />
            <span className="f-chkbx-lbl">Margham</span>
          </label>
        </div>

        <div className="filter-by-sector-checkbox">
          <input type="checkbox" id="allisaill" />
          <label htmlFor="allisaill" className="checkbox-toggle">
            <i className="sf-icon i-sf-checkbox" />
            <span className="f-chkbx-lbl">Al Lisaill</span>
          </label>
        </div>

        <div className="filter-by-sector-checkbox">
          <input type="checkbox" id="lahbab" />
          <label htmlFor="lahbab" className="checkbox-toggle">
            <i className="sf-icon i-sf-checkbox" />
            <span className="f-chkbx-lbl">Lahbab</span>
          </label>
        </div>

        <div className="filter-by-sector-checkbox">
          <input type="checkbox" id="deira" />
          <label htmlFor="deira" className="checkbox-toggle">
            <i className="sf-icon i-sf-checkbox" />
            <span className="f-chkbx-lbl">Deira</span>
          </label>
        </div>

        <div className="filter-by-sector-checkbox">
          <input type="checkbox" id="albarsha" />
          <label htmlFor="albarsha" className="checkbox-toggle">
            <i className="sf-icon i-sf-checkbox" />
            <span className="f-chkbx-lbl">Al Barsha</span>
          </label>
        </div>

        <div className="filter-by-sector-checkbox">
          <input type="checkbox" id="mirdiff" />
          <label htmlFor="mirdiff" className="checkbox-toggle">
            <i className="sf-icon i-sf-checkbox" />
            <span className="f-chkbx-lbl">Mirdif</span>
          </label>
        </div>

        <div className="filter-by-sector-checkbox">
          <input type="checkbox" id="nazwa" />
          <label htmlFor="nazwa" className="checkbox-toggle">
            <i className="sf-icon i-sf-checkbox" />
            <span className="f-chkbx-lbl">Nazwa</span>
          </label>
        </div>
      </Accordion>
    </div>
  );
}

FilterBySector.propTypes = {};

export default FilterBySector;
