import React from "react";
import Card from "react-bootstrap/Card";

function ILogicsAboutCard(props) {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            <strong className="purple">ASP.Net Developer</strong>
            December 2018 - May 2019
            <br />
            <br />
            . Analyzing end-users needs and develop software solutions within
            time and cost constraints <br />
            . Working closely with support and operation teams to Develop Web
            Application. <br />
            . Program, test, debug, monitor to computer systems & applications
            <br />
            . Created Desktop Applications with design implemented in DEV
            Express with Backend Coded in C#
            <br />
            . Theme conversion of different web application to ASP.Net Web
            Forms.
            <br />
            . Make Website responsive using Bootstrap
            <br />
            . Design and Implement Databases in SQL Server and Oracle <br />
          </p>
          <br />
          <br />
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default ILogicsAboutCard;
