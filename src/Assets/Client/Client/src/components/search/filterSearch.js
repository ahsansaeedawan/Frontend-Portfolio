import React from "react";
import PropTypes from "prop-types";
import "./filterSearch.css";

function FilterSearch({ value, placeholder, onChange, filterValue, onFilterChange, options=[]  }){
    return(
        <div className="table-search">
        <div className="search-input">
          <i className="sf-icon i-search-magnifier" />
          <input
            value={value}
            type="text"
            placeholder={placeholder}
            onChange={onChange}
          />
        </div>
        <div className="search-filter">
          <i className="sf-icon i-search-filter-by" />
          <select
            onChange={onFilterChange}
            value={filterValue}
          >
              {
                  options.map((opt,i) => (
                  <option key={`${i}-fb-${opt.label}`} value={opt.value}>{opt.label}</option>
                  ))
              }
          </select>
          <i className="sf-icon i-search-chevron-down" />
        </div>
      </div>        
    )
}

FilterSearch.propTypes = {
    value: PropTypes.string.isRequired,
    filterValue: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })).isRequired
};

export default FilterSearch;
