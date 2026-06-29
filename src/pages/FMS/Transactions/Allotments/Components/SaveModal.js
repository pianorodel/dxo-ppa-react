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
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { formatAmount } from "@/helpers/decimal_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpExpenseClassesMutation } from "@/api/Endpoints/FMS/StaticData/ExpenseClasses";
import { useLookUpObjectCodesMutation } from "@/api/Endpoints/FMS/StaticData/ObjectCodes";
import {
  useCancelAllotmentsMutation,
  useFilesDeleteAllotmentsMutation,
  useFilesUploadAllotmentsMutation,
  useFindAllotmentsQuery,
  useSaveAllotmentsMutation,
  useSubmitAllotmentsMutation,
} from "@/api/Endpoints/FMS/Transactions/Allotment/Allotments";
import { useLookUpForAllotmentAppropriationsMutation } from "@/api/Endpoints/FMS/Transactions/Appropriation/Appropriations";

const MODULE_NAME = "Allotment";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveAllotmentsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitAllotmentsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelAllotmentsMutation();
  const [lookupAppropriation] = useLookUpForAllotmentAppropriationsMutation();
  const [lookupExpenseClasses] = useLookUpExpenseClassesMutation();
  const [lookupObjectCode] = useLookUpObjectCodesMutation();

  const { data: transactionData, refetch } = useFindAllotmentsQuery(
    { allotmentId: data?.allotmentId },
    { skip: !data?.allotmentId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadAllotmentsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteAllotmentsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_ALLOTMENTS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    allotmentId: data?.allotmentId || 0,
    referenceNo: data?.referenceNo || "",
    appropriationId: data?.appropriationId || 0,
    appropriationNo: data?.appropriationNo || "",
    fundingType: data?.fundingType || "",
    appropriationSource: data?.appropriationSource || "",
    appropriationType: data?.appropriationType || "",
    fundClusterName: data?.fundClusterName || "",
    financingSourceName: data?.financingSourceName || "",
    authorizationCodeName: data?.authorizationCodeName || "",
    psAmount: data?.psAmount || 0,
    mooeAmount: data?.mooeAmount || 0,
    coAmount: data?.coAmount || 0,
    dateReleased: data?.dateReleased || null,
    abmNo: data?.abmNo || "",
    expenseClassId: data?.expenseClassId || 0,
    expenseClassName: data?.expenseClassName || "",
    objectCodeId: data?.objectCodeId || 0,
    objectCodeName: data?.objectCodeName || "",
    allotmentAmount: data?.allotmentAmount || 0,
    remarks: data?.remarks || "",
    files: data?.files || [],
  };

  const { handleSubmit, setValue, reset, control, watch } = useForm({ ...defaultValues });

  const appropriationData = watch("appropriationId");

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      appropriationId: findData?.appropriationId
        ? {
          value: findData?.appropriationId,
          label: findData?.appropriationNo,
          fundClusterName: findData?.fundClusterName,
          financingSourceName: findData?.financingSourceName,
          authorizationCodeName: findData?.authorizationCodeName,
          fundingType: findData?.fundingType,
          appropriationSource: findData?.appropriationSource,
          psAmount: findData?.psAmount,
          mooeAmount: findData?.mooeAmount,
          coAmount: findData?.coAmount,
        }
        : null,
      ...buildSelectPairs(["expenseClassId", "objectCodeId"], findData),

    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      ...flattenSelectPairs(["expenseClassId", "objectCodeId"], formData),
      appropriationId: formData?.appropriationId?.value,
      appropriationNo: formData?.appropriationId?.label,
      fundClusterName: formData?.appropriationId?.fundClusterName,
      financingSourceName: formData?.appropriationId?.financingSourceName,
      authorizationCodeName: formData?.appropriationId?.authorizationCodeName,
      fundingType: formData?.appropriationId?.fundingType,
      appropriationSource: formData?.appropriationId?.appropriationSource,
      psAmount: formData?.appropriationId?.psAmount,
      mooeAmount: formData?.appropriationId?.mooeAmount,
      coAmount: formData?.appropriationId?.coAmount,
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

  const expenseClassId = watch("expenseClassId")
  const expenseClassUACS = watch("expenseClassUACS")

  return (
    <React.Fragment>
      <ModernModal
        isProcess={true}
        title={data?.allotmentId ? "Update Allotment" : "New Allotment"}
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

          <Section title="Appropriation Details">
            <Row style={{ marginBottom: "16px" }}>
              <Col lg="12">
                <AsyncSelect
                  name="appropriationId"
                  control={control}
                  label="Appropriation No."
                  loadOptions={formatLoadOptions(lookupAppropriation)}
                  rules={{ required: "Appropriation No. is required." }}
                  getOptionValue={(opt) => opt.appropriationId || opt.value}
                  getOptionLabel={(opt) => opt.appropriationNo || opt.label}
                  formatOptionLabel={(opt) => (
                    <div>
                      <div>{opt.label}</div>
                      <div className="d-flex justify-content-between">
                        <small>{opt.appropriationSource} {"-"} {opt.fundClusterName} {">"} {opt.financingSourceName} {">"} {opt.authorizationCodeName}</small>
                        <small style={{ fontWeight: "bold", color: "#0ab39c" }}>
                          ₱{Number((opt.psAmount + opt.mooeAmount + opt.coAmount) || 0).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  )}
                  placeholder="Select appropriation..."
                />
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">PS</div>
                  <div className="text-primary fw-semibold">{formatAmount(appropriationData?.psAmount || findData?.psAmount || 0)}</div>
                </div>
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">MOOE</div>
                  <div className="text-warning fw-semibold">{formatAmount(appropriationData?.mooeAmount || findData?.mooeAmount || 0)}</div>
                </div>
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">CO</div>
                  <div className="text-success fw-semibold">{formatAmount(appropriationData?.coAmount || findData?.coAmount || 0)}</div>
                </div>
              </Col>

              <Col lg={3}>
                <div className="p-3 rounded" style={{ background: "var(--vz-input-bg)", border: "1px solid var(--vz-border-color)" }}>
                  <div className="text-muted small mb-1">Appropriation Source</div>
                  <div className="text-info fw-semibold">{appropriationData?.appropriationSource || findData?.appropriationSource || "--"}</div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={4}>
                <InputField
                  disabled
                  name="fundClusterName"
                  control={control}
                  label="Fund Cluster"
                  value={appropriationData?.fundClusterName || findData?.fundClusterName}
                />
              </Col>

              <Col lg={4}>
                <InputField
                  disabled
                  name="financingSourceName"
                  control={control}
                  label="Financing Source"
                  value={appropriationData?.financingSourceName || findData?.financingSourceName}
                />
              </Col>

              <Col lg={4}>
                <InputField
                  disabled
                  name="authorizationCodeName"
                  control={control}
                  label="Authorization Code"
                  value={appropriationData?.authorizationCodeName || findData?.authorizationCodeName}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Allotment Details">
            <Row>
              <Col lg={6}>
                <DatePickerField
                  name="dateReleased"
                  control={control}
                  label="Date of Release"
                  rules={{ required: "Date of Release is required." }}
                />
              </Col>

              <Col lg={6}>
                <InputField
                  name="abmNo"
                  control={control}
                  label="Allotment and Budget Matrix (ABM) No."
                  placeholder="e.g. ABM-2025-07-001"
                />
              </Col>

              <Col lg={6}>
                <CurrencyInputField
                  name="allotmentAmount"
                  control={control}
                  label="Allotment Amount"
                  placeholder="0.00"
                  rules={{
                    required: "Allotment amount is required.",
                    validate: (value) => parseFloat(value) > 0 || "Allotment amount should be greater than zero.",
                  }}
                />
              </Col>

              <Col lg={6}>
                <AsyncSelect
                  isClearable
                  name="expenseClassId"
                  control={control}
                  label="Expense Classification"
                  loadOptions={formatLoadOptions(lookupExpenseClasses)}
                  rules={{ required: "Classification is required." }}
                  placeholder="Select classification..."
                  getOptionValue={(opt) => opt.expenseClassId || opt.value}
                  getOptionLabel={(opt) => opt.expenseClassName || opt.label}
                  isDisabled={isViewerOnly}
                  onChange={(selected) => {
                    setValue("expenseClassId", selected);
                    setValue("expenseClassUACS", selected?.uacs);
                    setValue("objectCodeId", null);
                  }}
                />
              </Col>

              <Col lg={12}>
                <AsyncSelect
                  key={expenseClassUACS}
                  isClearable
                  name="objectCodeId"
                  control={control}
                  label="UACS Object Code"
                  loadOptions={formatLoadOptions(lookupObjectCode, { parentUACS: expenseClassUACS })}
                  rules={{ required: "Object Code is required." }}
                  placeholder="Select Object Code..."
                  getOptionValue={(opt) => opt.objectCodeId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                  isDisabled={isViewerOnly}
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
                  {data?.allotmentId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ allotmentId: data?.allotmentId || 0 }}
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
