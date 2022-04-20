import React from "react";
import Card from "react-bootstrap/Card";

function SystemsAboutCard(props) {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            <strong className="purple">

              Junior Consultant (Microsoft Dynamics 365 Commerce / ReactJs /
              Typescript)
            </strong>
            January 2022 - Present
            <br />
            <br />
            . Hands on experience on Microsoft Dynamics 365 Commerce <br />
            . Create website through MSDYN365 Commerce through CMS with out of
            the box modules <br />
            . Hands on MSDYN365 Commerce modules extensibility & extensions in
            Reactjs with typescript
            <br />
            . Working with different type of Data actions, OOTB, Retail proxy,
            State share data actions
            <br />
            . Code debugging & test extended modules / cloned module with page
            mock
            <br />
            . Customization of Out the box theme Fabrikam <br />
            . CSS Override & Customize CSS on module level <br />
            . Deployment of MSDYN365 Commerce Frontend Package on Life cycle
            service (LCS) <br />
            . Follow best practices of Microsoft defined standard for better
            development <br />. Use Git, Azure DevOps and working with agile
            methodology
          </p>
          <br />
          <br />
          <p style={{ textAlign: "justify" }}>
            <strong className="purple">
              Associate Consultant (Microsoft Dynamics 365 Commerce / ReactJs /
              Typescript)
            </strong>
            March 2021 - January 2022
            <br />
            <br />
            . Microsoft Dynamics 365 Commerce <br />
            . Extensibility of Modules MSDYN365 Commerce in ReactJs <br />
            . Working in typescript with ReactJs <br />
            . Knowledge of architecture of Microsoft Dynamics 365 Commerce{" "}
            <br />. Follow best practices of Microsoft defined standard for
            better development
          </p>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default SystemsAboutCard;
