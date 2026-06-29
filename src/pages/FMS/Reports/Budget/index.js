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
import Far1 from "./Far1";
import Far2 from "./Far2";
import Far3 from "./Far3";
import Rao from "./Rao";
import Raod from "./Raod";
import Rbu from "./Rbu";
import Rbud from "./Rbud";

const DesktopView = () => {
  const { state, customFunction } = useCustomHook();

  const settings = [
    {
      title: "Financial Accountability Report<br/>(FAR No. 1)<br/><br/>",
      description: "Statement of Appropriations, Allotments, Obligations, Disbursements and Balances.",
      link: "#",
      report: 'far1',
      reportName: "Financial Accountability Report (FAR No. 1)"
    },
    {
      title: "Financial Accountability Report<br/>(FAR No. 2)<br/><br/>",
      description: "Statement of Appropriations, Allotments, Obligations, Disbursements and Balances.",
      link: "#",
      report: 'far2',
      reportName: "Financial Accountability Report (FAR No. 2)"
    },
    {
      title: "Financial Accountability Report<br/>(FAR No. 3)<br/><br/>",
      description: "Statement of Appropriations, Allotments, Obligations, Disbursements and Balances.",
      link: "#",
      report: 'far3',
      reportName: "Financial Accountability Report (FAR No. 3)"
    },
    {
      title: "Registry of Allotments and Obligations <br/>(RAO)<br/><br/>",
      description: "Record of government agency's budget allocation and commitments.",
      link: "#",
      report: 'rao',
      reportName: "Registry of Allotments and Obligations (RAO)"
    },
    {
      title: "Registry of Budgets and Utilizations <br/>(RBU)<br/><br/>",
      description: "Record tracking government agency's budget use and expenditures.",
      link: "#",
      report: 'rbu',
      reportName: "Registry of Budgets and Utilizations (RBU)"
    },
    {
      title: "Registry of Allotments, Obligations and Disbursements <br/>(RAOD)",
      description: "Record of budget allocations, commitments, payments.",
      link: "#",
      report: 'raod',
      reportName: "Registry of Allotments, Obligations and Disbursements (RAOD)"
    }, {
      title: "Registry of Budget, Utilization and Disbursements <br/>(RBUD)",
      description: "Record tracking budget allocation, usage, payments.",
      link: "#",
      report: 'rbud',
      reportName: "Registry of Budget, Utilization and Disbursements (RBUD)"
    },
  ];

  const togglePreviewReport = useCallback((item) => {
    customFunction.updateToggle('isTogglePreviewReport', item)
  }, [customFunction.updateToggle])

  const pdfMap = {
    "far1": Far1,
    "far2": Far2,
    "far3": Far3,
    "rao": Rao,
    "rbu": Rbu,
    "raod": Raod,
    "rbud": Rbud
  }

  return (
    <React.Fragment>
      {state.toggle.isTogglePreviewReport
        && <PDFPreviewModal
          modalTitle={state?.trxValue?.reportName}
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
