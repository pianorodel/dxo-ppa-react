import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";

import AsyncFileUpload from "@/components/Common/AsyncFileUpload";
import FileUpload from "@/components/Common/FileUpload";
import { AsyncSelect, DatePickerField, InputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, formatLoadOptions } from "@/helpers/data_helper";
import { formatAmount } from "@/helpers/decimal_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpClientsMutation } from "@/api/Endpoints/FMS/StaticData/Clients";
import { useLookUpForObligationAllotmentsMutation } from "@/api/Endpoints/FMS/Transactions/Allotment/Allotments";
import {
  useCancelObligationsMutation,
  useFilesDeleteObligationsMutation,
  useFilesUploadObligationsMutation,
  useFindObligationsQuery,
  useSaveObligationsMutation,
  useSubmitObligationsMutation,
} from "@/api/Endpoints/FMS/Transactions/Obligation/Obligations";

const MODULE_NAME = "Obligation";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveObligationsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitObligationsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelObligationsMutation();
  const [lookupAllotment] = useLookUpForObligationAllotmentsMutation();
  const [lookupClient] = useLookUpClientsMutation();

  const { data: transactionData, refetch } = useFindObligationsQuery(
    { obligationId: data?.obligationId },
    { skip: !data?.obligationId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadObligationsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteObligationsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_OBLIGATIONS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    obligationId: data?.obligationId || 0,
    referenceNo: data?.referenceNo || "",
    appropriationId: data?.appropriationId || 0,
    appropriationNo: data?.appropriationNo || "",
    appropriationSource: data?.appropriationSource || "",
    allotmentId: data?.allotmentId || 0,
    allotmentNo: data?.allotmentNo || "",
    allotmentClass: data?.allotmentClass || "",
    allotmentAmount: data?.allotmentAmount || 0,
    fundClusterName: data?.fundClusterName || "",
    financingSourceName: data?.financingSourceName || "",
    authorizationCodeName: data?.authorizationCodeName || "",
    objectCodeName: data?.objectCodeName || "",
    obligatedAmount: data?.obligatedAmount || 0,
    payeeId: data?.payeeId || 0,
    payeeName: data?.payeeName || "",
    payeeTIN: data?.payeeTIN || "",
    particulars: data?.particulars || "",
    poNo: data?.poNo || "",
    contractNo: data?.contractNo || "",
    workOrderNo: data?.workOrderNo || "",
    poContractDate: data?.poContractDate || null,
    deliveryDate: data?.deliveryDate || null,
    remarks: data?.remarks || "",
    files: data?.files || [],
  };

  const { handleSubmit, reset, control, watch } = useForm({ ...defaultValues });

  const allotmentData = watch("allotmentId");

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      payeeId: findData?.payeeId
        ? {
          value: findData?.payeeId,
          label: findData?.payeeName,
          clientId: findData?.payeeId,
          clientName: findData?.payeeName,
          tin: findData?.payeeTIN,
        }
        : null,
      allotmentId: findData?.allotmentId
        ? {
          value: findData?.allotmentId,
          label: findData?.allotmentNo,
          allotmentId: findData?.allotmentId,
          referenceNo: findData?.allotmentNo,
          expenseClassName: findData?.allotmentClass,
          allotmentAmount: findData?.allotmentAmount,
          expenseClassName: findData?.allotmentClass,
          allotmentAmount: findData?.allotmentAmount,
          appropriationSource: findData?.appropriationSource,
          fundClusterName: findData?.fundClusterName,
          financingSourceName: findData?.financingSourceName,
          authorizationCodeName: findData?.authorizationCodeName,
          objectCodeName: findData?.objectCodeName,
        }
        : null,
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      allotmentId: formData?.allotmentId?.value,
      appropriationId: formData?.allotmentId?.appropriationId,
      appropriationNo: formData?.allotmentId?.appropriationNo,
      appropriationSource: formData?.allotmentId?.appropriationSource,
      allotmentNo: formData?.allotmentId?.referenceNo,
      allotmentClass: formData?.allotmentId?.expenseClassName,
      allotmentAmount: formData?.allotmentId?.allotmentAmount,
      fundClusterName: formData?.allotmentId?.fundClusterName,
      financingSourceName: formData?.allotmentId?.financingSourceName,
      authorizationCodeName: formData?.allotmentId?.authorizationCodeName,
      objectCodeName: formData?.allotmentId?.objectCodeName,
      payeeId: formData?.payeeId?.clientId,
      payeeName: formData?.payeeId?.clientName,
      payeeTIN: formData?.payeeId?.tin,
      files: fileObj || [],
    };

    try {
      const response = actionType.current === "save"
        ? await save(payload).unwrap()
        : actionType.current === "cancel"
          ? await cancel(payload).unwrap()
          : await submit(payload).unwrap();

      assertApiSuccess(response);

      notification({
        type: "success",
        title: response.returnData.referenceNo,
        header: `${actionType.current === "save" ? "Save" : actionType.current === "cancel" ? "Cancel" : "Submit"} ${MODULE_NAME}`,
        message: `${MODULE_NAME} was successfully ${actionType.current === "save" ? "saved" : actionType.current === "cancel" ? "cancelled" : "submitted"}.`,
      });

      setTimeout(() => {
        hideModal();
        onCloseClick();
      }, 2000);
    } catch (error) {
      notification({
        type: "error",
        title: MODULE_NAME,
        message: `${error?.message || "Unknown error"}`,
      });
    }
  };

  return (
    <React.Fragment>
      <ModernModal
        isProcess={true}
        title={data?.obligationId ? "Update Obligation" : "New Obligation"}
        isOpen={show}
        width="980px"
        modifiedDate={data?.modifiedDate}

        isSaving={isSaving}
        canSave={data?.actions?.save || true}
        onSave={() => {
          actionType.current = "save";
          handleSubmit(onSubmit)();
        }}

        isSubmitting={isSubmitting}
        canSubmit={data?.actions?.submit || true}
        onSubmit={() => {
          actionType.current = "submit";
          handleSubmit(onSubmit)();
        }}

        isCancelling={isCancelling}
        canCancel={data?.actions?.cancel || false}
        onCancel={() => {
          actionType.current = "cancel";
          handleSubmit(onSubmit)();
        }}

        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)}>

          <Section title="Allotment Details">
            <Row style={{ marginBottom: "16px" }}>
              <Col lg="12">
                <AsyncSelect
                  disabled={isViewerOnly}
                  name="allotmentId"
                  control={control}
                  label="Allotment"
                  loadOptions={formatLoadOptions(lookupAllotment)}
                  rules={{ required: "Allotment is required" }}
                  placeholder="Select allotment"
                  getOptionValue={(opt) => opt.allotmentId || opt.value}
                  getOptionLabel={(opt) => opt.referenceNo || opt.label}
                  formatOptionLabel={(opt) => (
                    <div>
                      <div>{opt.label}</div>
                      <div className="d-flex justify-content-between text-muted ">
                        <small>{opt.expenseClassName}</small>
                        <small style={{ fontWeight: "bold", color: "#0ab39c" }}>
                          ₱{Number(opt.allotmentAmount || 0).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  )}
                />
              </Col>

              <Col lg={4}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Appropriation Source</div>
                  <div className="text-primary fw-semibold">{allotmentData?.appropriationSource || "--"}</div>
                </div>
              </Col>

              <Col lg={5}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Allotment Class</div>
                  <div className="text-success fw-semibold">{allotmentData?.expenseClassName || "--"}</div>
                </div>
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Allotment Amount</div>
                  <div className="text-success fw-semibold">{formatAmount(allotmentData?.allotmentAmount || findData?.allotmentAmount || 0)}</div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <InputField
                  disabled
                  name="fundClusterName"
                  control={control}
                  label="Fund Cluster"
                  value={allotmentData?.fundClusterName || findData?.fundClusterName}
                />
              </Col>

              <Col lg={6}>
                <InputField
                  disabled
                  name="financingSourceName"
                  control={control}
                  label="Financing Source"
                  value={allotmentData?.financingSourceName || findData?.financingSourceName}
                />
              </Col>

              <Col lg={6}>
                <InputField
                  disabled
                  name="authorizationCodeName"
                  control={control}
                  label="Authorization Code"
                  value={allotmentData?.authorizationCodeName || findData?.authorizationCodeName}
                />
              </Col>

              <Col lg={6}>
                <InputField
                  disabled
                  name="objectCodeName"
                  control={control}
                  label="Object Code"
                  value={allotmentData?.objectCodeName || findData?.objectCodeName}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Payee / Supplier">
            <Row>
              <Col lg={6}>
                <AsyncSelect
                  name="payeeId"
                  control={control}
                  label="Payee"
                  loadOptions={formatLoadOptions(lookupClient)}
                  rules={{ required: "Payee is required." }}
                  placeholder="Select payee..."
                  getOptionValue={(opt) => opt.clientId || opt.value}
                  getOptionLabel={(opt) => opt.clientName || opt.label}
                />
              </Col>
              <Col lg={6}>
                <CurrencyInputField
                  name="obligatedAmount"
                  control={control}
                  label="Obligated Amount"
                  placeholder="0.00"
                  rules={{
                    required: "Obligated amount is required.",
                    validate: (value) => parseFloat(value) > 0 || "Obligated amount should be greater than zero.",
                  }}
                />
              </Col>
              <Col lg={12}>
                <InputField
                  name="particulars"
                  control={control}
                  type="textarea"
                  rows={2}
                  maxLength={500}
                  showCharCounter
                  label="Particulars / Description"
                  placeholder="Nature of obligation (goods, services, works)..."
                  rules={{ required: "Particulars is required." }}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Supporting Document Reference">
            <Row>
              <Col lg={4}>
                <InputField
                  name="poNo"
                  control={control}
                  label="Purchase Order (PO) No."
                  placeholder="e.g. PO-2025-07-001"
                />
              </Col>

              <Col lg={4}>
                <InputField
                  name="contractNo"
                  control={control}
                  label="Contract No."
                  placeholder="e.g. Contract-2025-07-001"
                />
              </Col>

              <Col lg={4}>
                <InputField
                  name="workOrderNo"
                  control={control}
                  label="Work Order No."
                  placeholder="e.g. WO-2025-07-001"
                />
              </Col>

              <Col lg={6}>
                <DatePickerField
                  name="poContractDate"
                  control={control}
                  label="PO / Contract Date"
                />
              </Col>

              <Col lg={6}>
                <DatePickerField
                  name="deliveryDate"
                  control={control}
                  label="Delivery / Completion Date"
                />
              </Col>
            </Row>
          </Section>

          <Section title="Remarks">
            <Row>
              <Col lg={12}>
                <InputField
                  name="remarks"
                  control={control}
                  type="textarea"
                  rows={3}
                  maxLength={500}
                  showCharCounter
                  placeholder="Enter remarks..."
                />
              </Col>
            </Row>
          </Section>

          <Section title="Files">
            <Row>
              <Col lg={12}>
                <div className="my-3">
                  {data?.obligationId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ obligationId: data?.obligationId || 0 }}
                      uploadService={uploadFiles}
                      isUploading={isUploading}
                      deleteService={deleteFiles}
                      isDeleting={isDeleting}
                      onUploadSuccess={() => {
                        toast("File was successfully uploaded.", {
                          position: "top-right",
                          hideProgressBar: false,
                          closeOnClick: true,
                          className: `bg-success text-white`,
                        });
                        refetchParentList();
                      }}
                      onDeleteSuccess={() => {
                        toast("File was successfully deleted.", {
                          position: "top-right",
                          hideProgressBar: false,
                          closeOnClick: true,
                          className: `bg-danger text-white`,
                        });
                        refetchParentList();
                      }}
                      onUploadError={(err) => console.log(err)}
                      onDeleteError={(err) => console.log(err)}
                    />
                  ) : (
                    <FileUpload onFilesChange={setFiles} />
                  )}
                </div>
              </Col>
            </Row>
          </Section>

        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
