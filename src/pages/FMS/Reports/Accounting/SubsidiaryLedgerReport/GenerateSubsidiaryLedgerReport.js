import { useState } from "react";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import {
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import { GenerateReportButton } from "@/components/Common/Buttons";
import PDFPreviewModal from "@/components/Common/PDFs/PDFPreviewModal";
import useCustomHook from "@/components/Hooks/useCustomHook";
import SubsidiaryLedgerReport from "./SubsidiaryLedgerReport";

const GenerateSubsidiaryLedgerReport = ({ role = null, show, onCloseClick }) => {
  const { state, customFunction } = useCustomHook();
  const [dateValue, setDateValue] = useState("");
  const [fundCluster, setFundCluster] = useState(null);
  const [fundSource, setFundSource] = useState(null);
  const [financingSource, setFinancingSource] = useState(null);
  const [authorization, setAuthorization] = useState(null);
  const [fundCategory, setFundCategory] = useState(null);

  const fundClusterOptions = [
    { label: "Fiscal Autonomy (08409800)", value: 1 },
    { label: "Prison Autonomy (9999999)", value: 2 },
    { label: "Education Cluster (11223344)", value: 3 },
    { label: "Health Cluster (55667788)", value: 4 },
    { label: "Infrastructure Cluster (99001122)", value: 5 },
  ];

  const fundSourceOptions = [
    { label: "National Government", value: 1 },
    { label: "Local Government", value: 2 },
    { label: "Private Sector", value: 3 },
    { label: "Foreign Aid", value: 4 },
    { label: "Special Projects", value: 5 },
  ];

  const financingSourceOptions = [
    { label: "Internal Revenue", value: 1 },
    { label: "Loans", value: 2 },
    { label: "Donations", value: 3 },
    { label: "Grants", value: 4 },
    { label: "Bond Issues", value: 5 },
  ];

  const authorizationOptions = [
    { label: "General Appropriations Act", value: 1 },
    { label: "Special Purpose Fund", value: 2 },
    { label: "Continuing Appropriations", value: 3 },
    { label: "Automatic Appropriations", value: 4 },
    { label: "Off-Budget Funds", value: 5 },
  ];

  const fundCategoryOptions = [
    { label: "Capital Outlay", value: 1 },
    { label: "Maintenance & Other Operating Expenses", value: 2 },
    { label: "Personal Services", value: 3 },
    { label: "Subsidy", value: 4 },
    { label: "Others", value: 5 },
  ];

  const handleGenerateReport = () => {
    customFunction.updateToggle('isTogglePreviewReport')
  }

  return (
    <Modal
      fullscreen={state.toggleExpand}
      modalClassName="flip"
      size="lg"
      isOpen={show}
      toggle={onCloseClick}
      centered
    >
      <ModalHeader toggle={onCloseClick} className="p-3 bg-success-subtle">
        <div className="text-center w-100 pe-5">Generate Subsidiary Ledger Report</div>
      </ModalHeader>
      <ModalBody>

        {state.toggle.isTogglePreviewReport &&
          <PDFPreviewModal
            modalTitle="Subsidiary Ledger Report"
            show={true}
            DocumentComponent={SubsidiaryLedgerReport}
            onCloseClick={handleGenerateReport} />}

        <Row className="mb-2">
          <Col>
            <div>Fund Cluster</div>
            <Select
              placeholder="Select fund cluster"
              value={fundCluster}
              onChange={setFundCluster}
              options={fundClusterOptions}
            />
          </Col>
          <Col>
            <div>Fund Source</div>
            <Select
              placeholder="Select fund source"
              value={fundSource}
              onChange={setFundSource}
              options={fundSourceOptions}
            />
          </Col>
        </Row>

        <Row className="mb-2">
          <Col>
            <div>Authorization</div>
            <Select
              placeholder="Select authorization"
              value={financingSource}
              onChange={setFinancingSource}
              options={financingSourceOptions}
            />
          </Col>
          <Col>
            <div>Fund Source</div>
            <Select
              placeholder="Select fund source"
              value={fundCategory}
              onChange={setFundCategory}
              options={fundCategoryOptions}
            />
          </Col>
        </Row>

        <Row className="mb-2">
          <Col>
            <div>General Ledger Account</div>
            <Select
              placeholder="Select general ledger account"
              value={authorization}
              onChange={setAuthorization}
              options={authorizationOptions}
            />
          </Col>
          <Col>
            <div>Subsidiary Ledger Account</div>
            <Select
              placeholder="Select subsidiary ledger account"
              value={authorization}
              onChange={setAuthorization}
              options={authorizationOptions}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <div>From Date</div>
            <Input
              id="asOf"
              type="date"
              className="form-control"
              style={{
                borderColor: "#e9ebec",
                color: dateValue ? "#000000" : "#8e8e8e",
              }}
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </Col>
          <Col>
            <div>To Date</div>
            <Input
              id="asOf"
              type="date"
              className="form-control"
              style={{
                borderColor: "#e9ebec",
                color: dateValue ? "#000000" : "#8e8e8e",
              }}
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </Col>
        </Row>
        <div  >
          <Input type="checkbox" />
          <span style={{ marginLeft: '5px', marginTop: '2px' }}> Show Notes</span>
        </div>

        <div >
          <Input type="checkbox" />
          <span style={{ marginLeft: '5px', marginTop: '2px' }}> Show Multiple Funding Source Selection</span>
        </div>
      </ModalBody>

      <ModalFooter>
        <GenerateReportButton
          onClick={() => handleGenerateReport()}
        />
      </ModalFooter>
    </Modal>
  );
};

export default GenerateSubsidiaryLedgerReport;
