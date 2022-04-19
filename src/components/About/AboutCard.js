import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Ahsan Saeed Awan </span>
            from <span className="purple"> Islamabad, Pakistan.</span>
            <br />I am a Frontend / React / Web Developer.
            <br />
            <br />
            Highly motivated and technically strong resource with understanding
            of Product development, design, implementation and management of
            information management applications / business process management
            applications / Web based applications. Proven expertise in writing
            Microsoft Dynamics 365 Commerce, ReactJs, Redux, JavaScript,
            Typescript, ASP.Net & NodeJS. Comfortably working with agile
            methodology & perform as a team player.
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Learn New Languages
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Ahsan</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
