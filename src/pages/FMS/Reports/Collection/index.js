import React from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
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
import { hasAccess } from "@/helpers/session_helper";
import ClientMasterListReport from "./ClientMasterListReport";

const DesktopView = () => {
  const { state, customFunction } = useCustomHook();

  const reports = [
    {
      title: "Client Masterlist Report", 
      description: "",
      link: "#",
      permissionTypeId: [
      ]
    },
    {
      title: "Client Collection Report",
      description: "",
      link: "#",
      permissionTypeId: [
      ]
    },
    {
      title: "Order of Payment Transaction Report",
      description: "",
      link: "#",
      permissionTypeId: [
      ]
    },
  ];

  const filteredReports = (items) => {
    return items
      .filter(item => hasAccess(item.permissionTypeId))
      .filter(Boolean);
  };

  const handleGenerateReport = () => {
    customFunction.updateToggle('isTogglePreviewReport')
  }

  return (
    <React.Fragment>
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

            {filteredReports(reports).map((item, key) => (
              <React.Fragment key={key}>
                <Col xl={3} lg={6}>
                  <Card className="ribbon-box right overflow-hidden card-animate" >
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
                          onClick={() => handleGenerateReport(item)}
                          to={item.link}
                          className="btn btn-light w-100"
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
        {state.toggle.isTogglePreviewReport &&
          <PDFPreviewModal
            modalTitle="Client Masterlist Report"
            show={true}
            DocumentComponent={ClientMasterListReport}
            onCloseClick={handleGenerateReport} />}
      </div>
    </React.Fragment>
  );
};

export default DesktopView;
