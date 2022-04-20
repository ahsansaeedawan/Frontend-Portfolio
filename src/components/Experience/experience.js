import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
// import Github from "./Github";
// import Techstack from "./Techstack";
import SystemsAboutCard from "./SystemsAboutCard";
import systems from "../../Assets/systems.jpg";
import zigron from "../../Assets/Zigron.png";
import ilogics from "../../Assets/ilogics.png";
import megait from "../../Assets/megait.jpg";
import ZigronAboutCard from "./ZigronAboutCard";
import ILogicsAboutCard from "./ILogicsAboutCard";
import MegaITAboutCard from "./MegaITAboutCard";
import Cerilogic from "../../Assets/Cerilogics.jpg";
import Cermegait from "../../Assets/Cermegait.jpeg";
import CertZigron from "../../Assets/CeriZigron.jpg";


// import Toolstack from "./Toolstack";

function Experience() {
  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1
              style={{
                fontSize: "2.1em",
                paddingBottom: "20px",
                color: "#f26224",
              }}
            >
              <strong className="orange"> Systems Limited</strong>
              ,G11, Islamabad, Pakistan
            </h1>
            <SystemsAboutCard />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img
              src={systems}
              alt="about"
              className="img-fluid"
              style={{ borderRadius: "8px 8px 8px 8px" }}
            />
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              <strong className="purple"> Zigron</strong>
              ,Gulberg, Islamabad, Pakistan
            </h1>
            <ZigronAboutCard />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <a
              download={`${CertZigron}`}
              href={CertZigron}
              data-toggle="tooltip"
              data-placement="top"
              title="Download Certificate / Experience Letter"
            >
              <img
                src={zigron}
                alt="about"
                className="img-fluid"
                style={{ borderRadius: "8px 8px 8px 8px" }}
              />
            </a>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              <strong className="purple"> I-Logics</strong>
              ,Bluearea, Islamabad, Pakistan
            </h1>
            <ILogicsAboutCard />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <a
              download={`${Cerilogic}`}
              href={Cerilogic}
              data-toggle="tooltip"
              data-placement="top"
              title="Download Certificate / Experience Letter"
            >
              <img
                src={ilogics}
                alt="about"
                className="img-fluid"
                style={{ borderRadius: "8px 8px 8px 8px" }}
              />
            </a>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              <strong className="purple"> Mega IT Solution </strong>
              ,Rehmanabad, Rawalpindi, Pakistan
            </h1>
            <MegaITAboutCard />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <a
              download={`${Cermegait}`}
              href={Cermegait}
              data-toggle="tooltip"
              data-placement="top"
              title="Download Certificate / Experience Letter"
            >
              <img
                src={megait}
                alt="about"
                className="img-fluid"
                style={{ borderRadius: "8px 8px 8px 8px" }}
              />
            </a>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Experience;
