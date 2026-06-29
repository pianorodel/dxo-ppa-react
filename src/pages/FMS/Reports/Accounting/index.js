import React from "react";

import BreadCrumb from "@/components/Common/BreadCrumb";
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
import useCustomHook from "@/components/Hooks/useCustomHook";
import { Link } from "react-router-dom";
import GenerateGeneralLedgerReport from "./GeneralLedgerReport/GenerateGeneralLedgerReport";
import GenerateStatementOfFinancialPerformanceReport from "./StatementOfFinancialPerformanceReport/GenerateStatementOfFinancialPerformanceReport";
import GenerateStatementOfFinancialPositionReport from "./StatementOfFinancialPositionReport/GenerateStatementOfFinancialPositionReport";
import GenerateSubsidiaryLedgerReport from "./SubsidiaryLedgerReport/GenerateSubsidiaryLedgerReport";
import GenerateTrialBalanceReport from "./TrialBalanceReport/GenerateTrialBalanceReport";

const DesktopView = (props) => {
  const { state, customFunction } = useCustomHook();

  const settings = [
    {
      title: "Trial Balance Report",
      description: "Statement showing all accounts' debit/credit balances per COA rules to verify equality.<br/><br/>",
      link: "#"
    },
    {
      title: "Statement of Financial Position Report",
      description: "Summary of assets, liabilities, and equity at a specific date.<br/><br/>",
      link: "#"
    },
    {
      title: "Statement of Financial Performance Report",
      description: "Summary of revenues, expenses, and net results for a period.",
      link: "#"
    },
    {
      title: "Statement of Cash Flow Report",
      description: "A financial report showing cash inflows/outflows from operations, investing, and financing activities.<br/><br/>",
      link: "#"
    },
    {
      title: "Statement Of Changes In Net Assets Equity",
      description: "Report that shows changes in owners' equity from net income, investments, and distributions.",
      link: "#"
    },
    {
      title: "General Ledger Report",
      description: "Detailed record of all account transactions and balances in government accounting.<br/><br/>",
      link: "#"
    }, {
      title: "Subsidiary Ledger Report",
      description: "Detailed breakdown of individual components supporting general ledger accounts.<br/><br/>",
      link: "#"
    },
  ];

  const handleGenerateReport = (reportName) => {
    if (reportName === 'Trial Balance Report') {
      customFunction.updateToggle('isToggleGenerateTrialBalanceReport')
    } else if (reportName === 'General Ledger Report') {
      customFunction.updateToggle('isToggleGenerateGeneralLedgerReport')
    } else if (reportName === 'Subsidiary Ledger Report') {
      customFunction.updateToggle('isToggleSubsidiaryLedgerReport')
    } else if (reportName === 'Statement of Financial Position Report') {
      customFunction.updateToggle('isToggleStatementOfFinancialPositionReport')
    } else if (reportName === 'Statement of Financial Performance Report') {
      customFunction.updateToggle('isToggleStatementOfFinancialPerformanceReport')
    }
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

            {settings.map((item, key) => (
              <React.Fragment key={key}>
                <Col xl={3} lg={6}>
                  <Card className="ribbon-box right overflow-hidden card-animate">
                    <CardBody className="text-center p-4">
                      <img src={reports_icon} alt="" height="45" />
                      <h5 className="mb-1 mt-4">
                        {item.title}
                      </h5>
                      <p
                        className="text-muted mb-4"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      ></p>
                      <div className="mt-4">
                        <Link
                          onClick={() => handleGenerateReport(item.title)}
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
      </div>

      {state.toggle.isToggleGenerateTrialBalanceReport && <GenerateTrialBalanceReport show={true} onCloseClick={() => handleGenerateReport('Trial Balance Report')} />}
      {state.toggle.isToggleSubsidiaryLedgerReport && <GenerateSubsidiaryLedgerReport show={true} onCloseClick={() => handleGenerateReport('Subsidiary Ledger Report')} />}
      {state.toggle.isToggleStatementOfFinancialPositionReport && <GenerateStatementOfFinancialPositionReport show={true} onCloseClick={() => handleGenerateReport('Statement of Financial Position Report')} />}
      {state.toggle.isToggleGenerateGeneralLedgerReport && <GenerateGeneralLedgerReport show={true} onCloseClick={() => handleGenerateReport('General Ledger Report')} />}
      {state.toggle.isToggleStatementOfFinancialPerformanceReport && <GenerateStatementOfFinancialPerformanceReport show={true} onCloseClick={() => handleGenerateReport('Statement of Financial Performance Report')} />}

    </React.Fragment>
  );
};

export default DesktopView;
