import React from "react";
import "./menuSearch.css";

export function EventCheckbox({ id, checked, onChange }) {
  return (
    <div className="event-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} id={id} />
      <label htmlFor={id} className="checkbox-toggle" tabIndex="0" />
    </div>
  );
}

function MenuSearchBox({ label, placeholder, value, onChange }) {
  return (
    <div className="event-search-box">
      {label && <label htmlFor="event-search-input">{label}</label>}
      <input
        name="eventSearchTerm"
        className="event-search-input"
        id="event-search-input"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <span className="event-search-icon">
        <i className="sf-icon i-search" />
      </span>
    </div>
  );
}

function MenuSearch({ searchValue, onSearchChange, placeholder }) {
  return (
    <div className="event-search">
      <MenuSearchBox
        placeholder={placeholder}
        value={searchValue}
        onChange={onSearchChange}
      />
    </div>
  );
}

export default MenuSearch;
