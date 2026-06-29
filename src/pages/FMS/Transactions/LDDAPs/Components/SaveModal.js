import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";

import AsyncFileUpload from "@/components/Common/AsyncFileUpload";
import FileUpload from "@/components/Common/FileUpload";
import { AsyncSelect, DatePickerField, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpBankBranchesMutation } from "@/api/Endpoints/FMS/StaticData/BankBranches";
import { useLookUpFinancingSourcesMutation } from "@/api/Endpoints/FMS/StaticData/FinancingSources";
import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import {
  useCancelLDDAPsMutation,
  useFilesDeleteLDDAPsMutation,
  useFilesUploadLDDAPsMutation,
  useFindLDDAPsQuery,
  useSaveLDDAPsMutation,
  useSubmitLDDAPsMutation,
} from "@/api/Endpoints/FMS/Transactions/LDDAP/LDDAPs";

const MODULE_NAME = "LDDAP-ADA";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveLDDAPsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitLDDAPsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelLDDAPsMutation();
  const [lookupFundCluster] = useLookUpFundClustersMutation();
  const [lookupFinancingSource] = useLookUpFinancingSourcesMutation();
  const [lookupBankBranch] = useLookUpBankBranchesMutation();

  const { data: transactionData, refetch } = useFindLDDAPsQuery(
    { lddapId: data?.lddapId },
    { skip: !data?.lddapId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadLDDAPsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteLDDAPsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_LDDAPS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    lddapId: data?.lddapId || 0,
    referenceNo: data?.referenceNo || "",
    datePrepared: data?.datePrepared || null,
    mdsAccountNo: data?.mdsAccountNo || "",
    fundClusterId: data?.fundClusterId || 0,
    fundClusterName: data?.fundClusterName || "",
    financingSourceId: data?.financingSourceId || 0,
    financingSourceName: data?.financingSourceName || "",
    periodDateFrom: data?.periodDateFrom || null,
    periodDateTo: data?.periodDateTo || null,
    bankId: data?.bankId || 0,
    bankBranchId: data?.bankBranchId || 0,
    bankBranchName: data?.bankBranchName || "",
    dbmReferenceNo: data?.dbmReferenceNo || "",
    remarks: data?.remarks || "",
    files: data?.files || [],
  };

  const { handleSubmit, reset, control } = useForm({ ...defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      bankBranchId: findData?.bankBranchId
        ? {
          value: findData?.bankBranchId,
          label: findData?.bankBranchName,
          bankId: findData?.bankId,
        }
        : null,
      fundClusterId: findData?.fundClusterId ? { value: findData.fundClusterId, label: findData.fundClusterName, displayName: findData.fundClusterName } : null,
      financingSourceId: findData?.financingSourceId ? { value: findData.financingSourceId, label: findData.financingSourceName, displayName: findData.financingSourceName } : null,
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      bankBranchId: formData?.bankBranchId?.value,
      bankBranchName: formData?.bankBranchId?.label,
      bankId: formData?.bankBranchId?.bankId,
      fundClusterId: formData?.fundClusterId?.value,
      fundClusterName: formData?.fundClusterId?.displayName,
      financingSourceId: formData?.financingSourceId?.value,
      financingSourceName: formData?.financingSourceId?.displayName,
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
        title={data?.lddapId ? "Update LDDAP-ADA" : "New LDDAP-ADA"}
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

          <Section title="Request Details">
            <Row>
              <Col lg={6}>
                <DatePickerField
                  name="datePrepared"
                  control={control}
                  label="Date Prepared"
                  rules={{ required: "Date Prepared is required." }}
                />
              </Col>

              <Col lg={6}>
                <InputField
                  name="mdsAccountNo"
                  control={control}
                  label="MDS Account No."
                  placeholder="e.g. MDS-07-026001"
                  rules={{ required: "MDS Account No. is required." }}
                />
              </Col>

              <Col lg={6}>
                <AsyncSelect
                  disabled={isViewerOnly}
                  name="fundClusterId"
                  control={control}
                  label="Fund Cluster"
                  loadOptions={formatLoadOptions(lookupFundCluster)}
                  rules={{ required: "Fund Cluster is required" }}
                  placeholder="Select fund cluster"
                  getOptionValue={(opt) => opt.fundClusterId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                />
              </Col>

              <Col lg={6}>
                <AsyncSelect
                  disabled={isViewerOnly}
                  name="financingSourceId"
                  control={control}
                  label="Financing Source"
                  loadOptions={formatLoadOptions(lookupFinancingSource)}
                  rules={{ required: "Financing Source is required" }}
                  placeholder="Select Financing Source"
                  getOptionValue={(opt) => opt.financingSourceId || opt.value}
                  getOptionLabel={(opt) => opt.displayName || opt.label}
                />
              </Col>

              <Col lg={6}>
                <DatePickerField
                  name="periodDateFrom"
                  control={control}
                  label="Period Covered — From"
                  rules={{ required: "Period Covered From is required." }}
                />
              </Col>

              <Col lg={6}>
                <DatePickerField
                  name="periodDateTo"
                  control={control}
                  label="Period Covered — To"
                  rules={{ required: "Period Covered To is required." }}
                />
              </Col>

              <Col lg={6}>
                <AsyncSelect
                  disabled={isViewerOnly}
                  name="bankBranchId"
                  control={control}
                  label="Servicing Bank / Branch"
                  loadOptions={formatLoadOptions(lookupBankBranch)}
                  placeholder="Select Bank Branch"
                  getOptionValue={(opt) => opt.branchId || opt.value}
                  getOptionLabel={(opt) => opt.bankBranchName || opt.label}
                />
              </Col>

              <Col lg={6}>
                <InputField
                  name="dbmReferenceNo"
                  control={control}
                  label="DBM Reference / NCA No."
                  placeholder="e.g. NCA-BMB-A-25-0001234"
                />
              </Col>
            </Row>
          </Section>

          <Section title="Remarks / Special Instructions">
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
                  {data?.lddapId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ lddapId: data?.lddapId || 0 }}
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
