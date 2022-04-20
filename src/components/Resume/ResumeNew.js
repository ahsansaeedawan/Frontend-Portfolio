import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/AhsanSaeedCV.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Preloader from "../../components/Pre";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [pageNumber, setPageNumber] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [pageNumber]);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Row style={{ justifyContent: "space-evenly", position: "relative" }}>
          <Button
            variant="primary"
            style={{ maxWidth: "250px" }}
            onClick={() => {
              setIsLoading(true);
              let pageNo = pageNumber - 1;
              setPageNumber(pageNo);
            }}
            disabled={pageNumber === 1 ? true : false}
          >
            Previous Page
          </Button>
          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
          <Button
            variant="primary"
            style={{ maxWidth: "250px" }}
            onClick={() => {
              setIsLoading(true);
              let pageNo = pageNumber + 1;
              setPageNumber(pageNo);
            }}
            disabled={pageNumber === 4 ? true : false}
          >
            Next Page
          </Button>
        </Row>

        <Row className="resume">
          <Preloader load={isLoading} />
          <Document file={pdf} className="d-flex justify-content-center">
            <Page pageNumber={pageNumber} scale={width > 786 ? 1.7 : 0.6} />
          </Document>
        </Row>

        <Row style={{ justifyContent: "space-evenly", position: "relative" }}>
          <Button
            variant="primary"
            style={{ maxWidth: "250px" }}
            onClick={() => {
              let pageNo = pageNumber - 1;
              setPageNumber(pageNo);
            }}
            disabled={pageNumber === 1 ? true : false}
          >
            Previous Page
          </Button>
          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
          <Button
            variant="primary"
            style={{ maxWidth: "250px" }}
            onClick={() => {
              let pageNo = pageNumber + 1;
              setPageNumber(pageNo);
            }}
            disabled={pageNumber === 4 ? true : false}
          >
            Next Page
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
