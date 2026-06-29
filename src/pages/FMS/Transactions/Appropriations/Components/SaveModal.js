import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";

import AsyncFileUpload from "@/components/Common/AsyncFileUpload";
import FileUpload from "@/components/Common/FileUpload";
import { AsyncSelect, DatePickerField, InputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import NormalSelect from "@/components/Common/Inputs/NormalSelect";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpAuthorizationCodesMutation } from "@/api/Endpoints/FMS/StaticData/AuthorizationCodes";
import { useLookUpFinancingSourcesMutation } from "@/api/Endpoints/FMS/StaticData/FinancingSources";
import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import {
  useCancelAppropriationsMutation,
  useFilesDeleteAppropriationsMutation,
  useFilesUploadAppropriationsMutation,
  useFindAppropriationsQuery,
  useSaveAppropriationsMutation,
  useSubmitAppropriationsMutation,
} from "@/api/Endpoints/FMS/Transactions/Appropriation/Appropriations";

const MODULE_NAME = "Appropriation";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveAppropriationsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitAppropriationsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelAppropriationsMutation();
  const [lookupFundCluster] = useLookUpFundClustersMutation();
  const [lookupFinancingSource] = useLookUpFinancingSourcesMutation();
  const [lookupAuthorizationCode] = useLookUpAuthorizationCodesMutation();

  const { data: transactionData, refetch } = useFindAppropriationsQuery(
    { appropriationId: data?.appropriationId },
    { skip: !data?.appropriationId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadAppropriationsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteAppropriationsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_APPROPRIATIONS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    appropriationId: data?.appropriationId || 0,
    fundingType: data?.fundingType || "SARO",
    saroNo: data?.saroNo || "",
    gaaDescription: data?.gaaDescription || "",
    gaaPageItemNo: data?.gaaPageItemNo || "",
    fiscalYear: data?.fiscalYear || 0,
    saroDate: data?.saroDate || null,
    dateReceived: data?.dateReceived || null,
    appropriationType: data?.appropriationType || "",
    fundClusterId: data?.fundClusterId || 0,
    fundClusterName: data?.fundClusterName || "",
    financingSourceId: data?.financingSourceId || 0,
    financingSourceName: data?.financingSourceName || "",
    authorizationCodeId: data?.authorizationCodeId || 0,
    authorizationCodeName: data?.authorizationCodeName || "",
    psAmount: data?.psAmount || 0,
    mooeAmount: data?.mooeAmount || 0,
    coAmount: data?.coAmount || 0,
    remarks: data?.remarks || "",
    files: data?.files || [],
  };

  const { handleSubmit, setValue, reset, control, watch } = useForm({ ...defaultValues });

  const fundingType = watch("fundingType");

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      appropriationType: findData?.appropriationType ? { value: findData.appropriationType, label: findData.appropriationType } : null,
      fundClusterId: findData?.fundClusterId ? { value: findData.fundClusterId, label: findData.fundClusterName, displayName: findData.fundClusterName } : null,
      financingSourceId: findData?.financingSourceId ? { value: findData.financingSourceId, label: findData.financingSourceName, displayName: findData.financingSourceName } : null,
      authorizationCodeId: findData?.authorizationCodeId ? { value: findData.authorizationCodeId, label: findData.authorizationCodeName, displayName: findData.authorizationCodeName } : null,
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      ...flattenSelectPairs(["authorizationCodeId"], formData),
      appropriationType: formData?.appropriationType?.value,
      fundClusterId: formData?.fundClusterId?.value,
      fundClusterName: formData?.fundClusterId?.displayName,
      financingSourceId: formData?.financingSourceId?.value,
      financingSourceName: formData?.financingSourceId?.displayName,
      authorizationCodeId: formData?.authorizationCodeId?.value,
      authorizationCodeName: formData?.authorizationCodeId?.displayName,
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

  const financingSourceId = watch("financingSourceId")?.value || 0;

  return (
    <React.Fragment>
      <ModernModal
        isProcess={true}
        title={data?.appropriationId ? "Update Appropriation" : "New Appropriation"}
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

          <Section title="Funding Type">
            <Row style={{ marginBottom: "16px" }}>
              <Col lg={12}>
                <Controller
                  name="fundingType"
                  control={control}
                  rules={{ required: "Funding Type is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <div className="d-flex gap-3">
                        {[
                          {
                            value: "SARO",
                            label: "Special Allotment Release Order (SARO)",
                            sub: "Auth Code 01/02/03/05 — DBM issues SARO first",
                            icon: "bx bx-file",
                          },
                          {
                            value: "GAA",
                            label: "GAA Direct Appropriation",
                            sub: "Auth Code 04/06/07/08 — No SARO required",
                            icon: "bx bx-checkbox-square",
                          },
                        ].map((opt) => (
                          <div
                            key={opt.value}
                            onClick={() => field.onChange(opt.value)}
                            className={`funding-type-card ${field.value === opt.value ? "active" : ""}`}
                          >
                            <i className={`${opt.icon} me-2`} />
                            <span className="fw-semibold">{opt.label}</span>
                            <div className="text-muted small mt-1">{opt.sub}</div>
                          </div>
                        ))}
                      </div>
                      {fieldState.error && (
                        <div className="text-danger small mt-1">{fieldState.error.message}</div>
                      )}
                    </>
                  )}
                />
              </Col>
            </Row>
          </Section>

          {fundingType === "SARO" && (
            <Section title="SARO Reference Details">
              <Row>
                <Col lg={6}>
                  <InputField
                    name="saroNo"
                    control={control}
                    label="SARO No."
                    placeholder="e.g. SARO-BMB-C-25-0012345"
                    rules={{ required: "SARO No. is required." }}
                  />
                </Col>

                <Col lg={6}>
                  <InputField
                    name="gaaDescription"
                    control={control}
                    label="GAA Year / RA"
                    placeholder="e.g. RA 12116 (GAA 2025)"
                    rules={{ required: "GAA Year / RA is required." }}
                  />
                </Col>

                <Col lg={6}>
                  <DatePickerField
                    name="saroDate"
                    control={control}
                    label="Date of SARO"
                    rules={{ required: "Date of SARO is required." }}
                  />
                </Col>

                <Col lg={6}>
                  <DatePickerField
                    name="dateReceived"
                    control={control}
                    label="Date Received"
                    rules={{ required: "Date Received is required." }}
                  />
                </Col>

                <Col lg={6}>
                  <NormalSelect
                    options={[
                      { value: "Current Year", label: "Current Year" },
                      { value: "Continuing Appropriation", label: "Continuing Appropriation" },
                      { value: "Supplemental Appropriation", label: "Supplemental Appropriation" },
                    ]}
                    control={control}
                    name="appropriationType"
                    label="Type"
                    placeholder="Select type..."
                    rules={{ required: "Type is required." }}
                  />
                </Col>
              </Row>
            </Section>
          )}

          {fundingType === "GAA" && (
            <Section title="GAA / Authorization Details">
              <Row>
                <Col lg={4}>
                  <InputField
                    name="gaaDescription"
                    control={control}
                    label="GAA / RA No."
                    placeholder="e.g. RA 12116 (GAA 2025)"
                    rules={{ required: "GAA / RA No. is required." }}
                  />
                </Col>
                <Col lg={4}>
                  <InputField
                    name="fiscalYear"
                    control={control}
                    label="Fiscal Year"
                    placeholder="2025"
                    rules={{ required: "Fiscal Year is required." }}
                  />
                </Col>
                <Col lg={4}>
                  <InputField
                    name="gaaPageItemNo"
                    control={control}
                    label="GAA Page / Item No."
                    placeholder="e.g. A.I.a, p.247"
                    rules={{ required: "GAA Page / Item No. is required." }}
                  />
                </Col>
              </Row>
            </Section>
          )}

          <Section title="Funding Source">
            <Row>
              <Col lg={4}>
                <AsyncSelect
                  name="fundClusterId"
                  control={control}
                  label="Fund Cluster"
                  loadOptions={formatLoadOptions(lookupFundCluster)}
                  rules={{ required: "Fund Cluster is required." }}
                  placeholder="Select fund cluster..."
                  getOptionValue={(opt) => opt.fundClusterId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                />
              </Col>

              <Col lg={4}>
                <AsyncSelect
                  name="financingSourceId"
                  control={control}
                  label="Financing Source"
                  loadOptions={formatLoadOptions(lookupFinancingSource)}
                  rules={{ required: "Financing Source is required." }}
                  placeholder="Select financing source..."
                  getOptionValue={(opt) => opt.financingSourceId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                  onChange={(selected) => {
                    setValue("financingSourceId", selected);
                    setValue("authorizationCodeId", null);
                  }}
                />
              </Col>

              <Col lg={4}>
                <AsyncSelect
                  key={financingSourceId}
                  name="authorizationCodeId"
                  control={control}
                  label="Authorization Code"
                  loadOptions={formatLoadOptions(lookupAuthorizationCode, { financingSourceId: financingSourceId })}
                  rules={{ required: "Authorization Code is required." }}
                  placeholder="Select authorization code..."
                  getOptionValue={(opt) => opt.authorizationCodeId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                  onChange={(selected) => {
                    setValue("authorizationCodeId", selected);
                    if (selected?.financingSourceId) {
                      setValue("financingSourceId", { value: selected.financingSourceId, label: selected.financingSourceName, displayName: selected.financingSourceDisplayName });
                    }
                  }}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Amount Breakdown by Allotment Class">
            <Row>
              <Col lg={4}>
                <CurrencyInputField
                  name="psAmount"
                  control={control}
                  label="PS - Personnel Services"
                  placeholder="0.00"
                  rules={{
                    validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                  }}
                />
              </Col>

              <Col lg={4}>
                <CurrencyInputField
                  name="mooeAmount"
                  control={control}
                  label="MOOE - Maint. & Other Oper. Exp."
                  placeholder="0.00"
                  rules={{
                    validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                  }}
                />
              </Col>

              <Col lg={4}>
                <CurrencyInputField
                  name="coAmount"
                  control={control}
                  label="CO - Capital Outlay"
                  placeholder="0.00"
                  rules={{
                    validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                  }}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Particulars / Purpose">
            <Row>
              <Col lg={12}>
                <InputField
                  name="remarks"
                  control={control}
                  type="textarea"
                  rows={2}
                  maxLength={500}
                  showCharCounter
                  placeholder="Brief description of the appropriation purpose..."
                />
              </Col>
            </Row>
          </Section>

          <Section title="Files">
            <Row>
              <Col lg={12}>
                <div className="my-3">
                  {data?.appropriationId ? (
                    <AsyncFileUpload
                      compact={true}
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ appropriationId: data?.appropriationId || 0 }}
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
                    <FileUpload compact={true} onFilesChange={setFiles} />
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
