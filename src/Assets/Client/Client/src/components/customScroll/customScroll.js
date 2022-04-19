import React from "react";
import { Scrollbars } from "react-custom-scrollbars";

const renderThumbVert = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 3,
    backgroundColor: "rgba(172, 172, 172, 0.38)"
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const CustomScroll = props => (
  <Scrollbars renderThumbVertical={renderThumbVert} {...props} />
);

export default CustomScroll;
