import React from "react";
import Card from "react-bootstrap/Card";

function MegaITAboutCard(props) {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            <strong className="purple">Intern / Trainee</strong>
            April 2018 - September 2018
            <br />
            <br />
            . Training of HTML, CSS, Bootstrap, Java Script and Asp.Net (Web
            Forms) and SQL Server. <br />
            . Worked on MVC and Webforms in ASP.Net <br />
            . Ecommerce Site as a final Project
            <br />
            . Learn how to develop a web applications
            <br />
            . Learn to work according to process model
            <br />
            . Learn theme conversion from HTML to Asp.net format by using master
            page concept in webforms <br />
          </p>
          <br />
          <br />
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default MegaITAboutCard;
