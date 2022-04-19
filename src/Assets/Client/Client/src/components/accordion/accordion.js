import React, { useState, useRef, useLayoutEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import "./accordion.css";

function Accordion({
  containerClass,
  title,
  titleCentered = false,
  titleClass,
  iconClass = "accordion-icon",
  leftIcon = false,
  leftIconClassName,
  rightIcon = false,
  rightIconClassName,
  panelClassName,
  open = false,
  children
}) {
  const [active, setActive] = useState(open);
  const [panelMaxHeight, setPanelMaxHeight] = useState(null);
  const panelElm = useRef(null);

  const handleAccordionClick = () => {
    if (panelElm) {
      setActive(!active);
      setPanelMaxHeight(
        panelMaxHeight ? null : `${panelElm.current.scrollHeight}px`
      );
    }
  };

  useLayoutEffect(() => {
    const { current } = panelElm;
    if (active) {
      setPanelMaxHeight(current.scrollHeight);
    }
  }, [active, children]);

  return (
    <div>
      <button
        onClick={handleAccordionClick}
        className={classNames(
          "accordion",
          containerClass,
          { "accordion-center": titleCentered },
          { [`${iconClass}`]: !titleCentered },
          { active }
        )}
      >
        {titleCentered && leftIcon && (
          <span
            className={classNames("a-head-icon", "left-icon", {
              leftIconClassName
            })}
          />
        )}
        <span
          className={classNames("a-title", titleClass, {
            "a-title-center": titleCentered
          })}
        >
          {title}
        </span>
        {titleCentered && rightIcon && (
          <span
            className={classNames(
              "a-head-icon",
              "right-icon",
              rightIconClassName,
              { active }
            )}
          />
        )}
      </button>
      <div
        ref={panelElm}
        className={classNames("panel", panelClassName)}
        style={{
          maxHeight: panelMaxHeight,
          overflow: active ? "visible" : "hidden"
        }}
      >
        <div className="panel-content">{children}</div>
      </div>
    </div>
  );
}

Accordion.propTypes = {
  containerClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleClass: PropTypes.string,
  titleCentered: PropTypes.bool,
  iconClass: PropTypes.string,
  rightIcon: PropTypes.bool,
  rightIconClassName: PropTypes.string,
  leftIcon: PropTypes.bool,
  leftIconClassName: PropTypes.string
};

export default Accordion;
