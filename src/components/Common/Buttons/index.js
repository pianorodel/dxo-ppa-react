import { Tooltip } from "@mui/material";

import { isMobile } from "react-device-detect";
import { Spinner } from "reactstrap";

const borderRadius = "7px";

export const FilterButton = ({ onClick, toggle }) => {
  return (
    <button type="button" className="btn btn-primary text-nowrap" onClick={onClick} style={{ borderRadius: borderRadius }}>
      <Tooltip title={toggle ? "Hide Filters" : "Show Filters"} arrow>
        <i className={`${toggle ? "ri-filter-line" : "ri-filter-fill"} align-bottom me-1`} />{" "}
        {isMobile ? "" : toggle ? "Hide Filters" : "Show Filters"}
      </Tooltip>
    </button>
  );
};

export const CreateButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-success add-btn" style={{ borderRadius: borderRadius }}>
      <i className="ri-add-line align-bottom me-1"></i> {text}
    </button>
  );
};

export const SearchButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick} type="submit" className="btn btn-success add-btn" style={{ borderRadius: borderRadius }}> 
      <i className="ri-search-line align-bottom me-1"></i> {text}
    </button>
  );
};

export const CloseButton = ({ onClick }) => {
  return (
    <button className="btn btn-soft-danger" type="button" onClick={onClick} style={{ borderRadius: borderRadius }}>
      <i className="ri-close-line me-1 align-middle"></i> Close
    </button>
  );
};

export const CloseButtonSuccess = ({ onClick, label }) => {
  return (
    <button className="btn btn-soft-success" type="button" onClick={onClick} style={{ borderRadius: borderRadius }}>
      <i className="ri-check-line me-1 align-middle"></i> {label}
    </button>
  );
};

export const SaveButton = ({ isSaving = false, disabled = false, onClick, isShowButton = true, color = "primary", type = "submit", form }) => {
  if (!isShowButton) return <></>;
  return (
    <button type={type} form={form} className={`btn btn-${color}`} disabled={isSaving || disabled} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isSaving ? <Spinner size="sm" className="me-1" /> : <i className="ri-save-3-line align-bottom me-1"></i>}
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
};

export const SubmitButton = ({ isSubmitting = false, disabled = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-success " disabled={isSubmitting || disabled} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isSubmitting ? <Spinner size="sm" className="me-1" /> : <i className="ri-send-plane-fill align-bottom me-1"></i>}
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};

export const UpdateButton = ({ isUpdating = false, disabled = false, onClick, isShowButton = true, ...restProps }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-info " disabled={isUpdating || disabled} onClick={onClick} {...restProps} style={{ borderRadius: borderRadius }}>
      {isUpdating ? <Spinner size="sm" className="me-1" /> : <i className="ri-add-line me-1 align-bottom"></i>}
      {isUpdating ? "Updating..." : " Update"}
    </button>
  );
};

export const ExportButton = ({ isExporting = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="button" className="btn btn-info" onClick={onClick} disabled={isExporting} style={{ borderRadius: borderRadius }}>
      {isExporting ? <Spinner size="sm" className="me-1" /> : <i className="ri-file-download-line align-bottom me-1"></i>}
      {isMobile ? "" : isExporting ? "Exporting..." : "Export"}
    </button>
  );
};

export const ReturnButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-info" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-arrow-left-right-fill align-bottom me-1" />}
      {isProcessing ? "Returning..." : "Return"}
    </button>
  );
};

export const ApproveButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-success" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-thumb-up-fill align-bottom me-1" />}
      {isProcessing ? "Approving..." : "Approve"}
    </button>
  );
};

export const ReceiveButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-success" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-truck-fill align-bottom me-1" />}
      {isProcessing ? "Receiving..." : "Set as Received"}
    </button>
  );
};

export const RejectButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-danger" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-thumb-down-fill align-bottom me-1" />}
      {isProcessing ? "Rejecting..." : "Reject"}
    </button>
  );
};

export const CancelButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-danger material-shadow-none " disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-forbid-2-fill align-bottom me-1" />}
      {isProcessing ? "Cancelling..." : "Cancel"}
    </button>
  );
};

export const RevertButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-warning material-shadow-none" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-arrow-go-back-fill align-bottom me-1" />}
      {isProcessing ? "Reverting..." : "Revert"}
    </button>
  );
};

export const AcceptButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-success material-shadow-none" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-check-fill align-bottom me-1" />}
      {isProcessing ? "Accepting..." : "Accept"}
    </button>
  );
};

export const PrintButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-success" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-printer-fill align-bottom me-1" />}
      {isProcessing ? "Printing..." : "Print"}
    </button>
  );
};

export const PreviewButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-info" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-eye-line align-bottom me-1" />}
      {isProcessing ? "Previewing..." : "Preview"}
    </button>
  );
};

export const GenerateReportButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-success" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-printer-fill align-bottom me-1" />}
      {isProcessing ? "Generating..." : "Generate"}
    </button>
  );
};

export const ReviewButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-warning" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-eye-line align-bottom me-1" />}
      {isProcessing ? "Reviewing..." : "Review"}
    </button>
  );
};

export const FundButton = ({ isProcessing = false, onClick, isShowButton = true }) => {
  if (!isShowButton) return <></>;
  return (
    <button type="submit" className="btn btn-primary" disabled={isProcessing} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-wallet-line align-bottom me-1" />}
      {isProcessing ? "Funding..." : "Fund"}
    </button>
  );
};

export const UploadButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="btn btn-success add-btn" style={{ borderRadius: borderRadius }}>
      <i className="ri-upload-2-fill align-bottom me-1"></i> {text}
    </button>
  );
};

export const ViewAllButton = ({ text, onClick }) => {
  return (
    <button onClick={onClick} type="submit" className="btn btn-success add-btn" style={{ borderRadius: borderRadius }}>
      <i className="ri-search-line align-bottom me-1"></i> {text}
    </button>
  );
};

export const ContinueButton = ({ isProcessing = false, disabled = false, onClick, isShowButton = true, type = "button" }) => {
  if (!isShowButton) return <></>;

  return (
    <button type={type} className="btn btn-primary" disabled={isProcessing || disabled} onClick={onClick} style={{ borderRadius: borderRadius }}>
      {isProcessing ? <Spinner size="sm" className="me-1" /> : <i className="ri-arrow-right-line align-bottom me-1"></i>}
      {isProcessing ? "Processing..." : "Continue"}
    </button>
  );
};
