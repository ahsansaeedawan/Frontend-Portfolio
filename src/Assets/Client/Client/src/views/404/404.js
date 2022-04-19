import React from "react";
import NotFoundImg from "../../assets/images/404-not-found.svg";

export function PageNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <img style={{ width: "600px" }} src={NotFoundImg} alt="" />
    </div>
  );
}
