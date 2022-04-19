import React, { useState } from "react";

export default function MenuSecondaryTabs({ onClick, children }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  function handleTabBtnClick(e) {
    if (e.target.tabIndex === activeTabIndex) return;
    setActiveTabIndex(e.target.tabIndex);
    onClick(e.target.tabIndex);
  }

  return (
    <div className="menu-sub-tabs">
      {children(handleTabBtnClick, activeTabIndex)}
    </div>
  );
}
