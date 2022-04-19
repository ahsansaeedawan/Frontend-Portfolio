import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <ul>
            <li className="about-activity mb-20">
              <ImPointRight /> Email: ahsansaeedawan@gmail.com
            </li>
            <li className="about-activity mb-20">
              <ImPointRight /> Cell No / Whatsapp: +92-336-1556-235
            </li>
            <li className="about-activity mb-20">
              <ImPointRight /> Address: G-10, Islamabad, Pakistan.
            </li>
            <li className="about-activity">
              <ImPointRight />
              Linkedin:{" "}
              <a
                href="https://www.linkedin.com/in/ahsan-saeed-102624183/"
                target="_blank"
              >
                https://www.linkedin.com/in/ahsan-saeed-102624183/
              </a>
            </li>
          </ul>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
