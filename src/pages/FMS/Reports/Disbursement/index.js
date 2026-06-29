import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";

import reports_icon from "@/assets/images/report.png";
import BreadCrumb from "@/components/Common/BreadCrumb";
import PDFPreviewModal from "@/components/Common/PDFs/PDFPreviewModal";
import useCustomHook from "@/components/Hooks/useCustomHook";
import AcountabliltyReport from "./AcountabliltyReport";
import CashDisbursement from "./CashDisbursement";
import CheckIssued from "./CheckIssued";
import IndexOfPayment from "./IndexOfPayment";
import ScheduleDeduction from "./ScheduleDeduction";

const DesktopView = () => {
  const { state, customFunction } = useCustomHook();

  const settings = [
    {
      title: "Checks Issued",
      description: "",
      link: "#",
      report: "CheckIssued"
    },
    {
      title: "Accountability for Accountable Forms",
      description: "",
      link: "#",
      report: "AcountabliltyReport"
    },
    {
      title: "Schedule of Deductions",
      description: "",
      link: "#",
      report: "ScheduleDeduction"
    },
    {
      title: "Index of Payments",
      description: "",
      link: "#",
      report: "IndexOfPayment"
    },
    {
      title: "Cash Disbursements",
      description: "",
      link: "#",
      report: "CashDisbursement"
    },
    {
      title: "Due and Demandable Accounts Payabale",
      description: "",
      link: "#"
    },
  ];

  const togglePreviewReport = useCallback((item) => {
    customFunction.updateToggle('isTogglePreviewReport', item)
  }, [customFunction.updateToggle])

  const pdfMap = {
    "AcountabliltyReport": AcountabliltyReport,
    "CheckIssued": CheckIssued,
    "ScheduleDeduction": ScheduleDeduction,
    "IndexOfPayment": IndexOfPayment,
    "CashDisbursement": CashDisbursement
  }

  return (
    <React.Fragment>
      {state.toggle.isTogglePreviewReport
        && <PDFPreviewModal
          modalTitle={state?.trxValue?.title}
          show={true}
          DocumentComponent={pdfMap[state?.trxValue?.report]}
          onCloseClick={togglePreviewReport} />
      }

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Reports"
            crumbs={[
              { title: "FMS", url: "/fms/dashboard" },
            ]} />
          <Card>
            <CardHeader className="border-0 rounded">
              <Row className="g-2">
                <Col xl={3}>
                  <div className="search-box">
                    <Input
                      type="text"
                      className="form-control bg-light border-light"
                      placeholder="Search for a particular report..."
                    />{" "}
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
              </Row>
            </CardHeader>
          </Card>

          <Row className="mt-4">

            {settings.map((item, key) => (
              <React.Fragment key={key}>
                <Col xl={3} lg={6}>
                  <Card className="ribbon-box right overflow-hidden card-animate">
                    <CardBody className="text-center p-4">
                      <img src={reports_icon} alt="" height="45" />
                      <h5
                        className="mb-1 mt-4"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                      <p
                        className="text-muted mb-4"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                      <div className="mt-4">
                        <Link
                          to={item.link}
                          className="btn btn-light w-100"
                          onClick={() => togglePreviewReport(item)}
                        >
                          Generate Report
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </React.Fragment>
            ))}

          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DesktopView;
