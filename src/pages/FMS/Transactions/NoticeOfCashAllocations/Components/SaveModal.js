import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import {
  useCancelNoticeOfCashAllocationsMutation,
  useFilesDeleteNoticeOfCashAllocationsMutation,
  useFilesUploadNoticeOfCashAllocationsMutation,
  useFindNoticeOfCashAllocationsQuery,
  useSaveNoticeOfCashAllocationsMutation,
  useSubmitNoticeOfCashAllocationsMutation,
} from "@/api/Endpoints/FMS/Transactions/NoticeOfCashAllocation/NoticeOfCashAllocations";

const MODULE_NAME = "Notice Of Cash Allocation";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveNoticeOfCashAllocationsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitNoticeOfCashAllocationsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelNoticeOfCashAllocationsMutation();
  const [lookupFundCluster] = useLookUpFundClustersMutation();

  const { data: transactionData, refetch } = useFindNoticeOfCashAllocationsQuery(
    { noticeOfCashAllocationId: data?.noticeOfCashAllocationId },
    { skip: !data?.noticeOfCashAllocationId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadNoticeOfCashAllocationsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteNoticeOfCashAllocationsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_NOTICEOFCASHALLOCATIONS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    noticeOfCashAllocationId: data?.noticeOfCashAllocationId || 0,
    referenceNo: data?.referenceNo || "",
    ncaDate: data?.ncaDate || null,
    fundClusterId: data?.fundClusterId || 0,
    fundClusterName: data?.fundClusterName || "",
    mdsAccountNo: data?.mdsAccountNo || "",
    ncaAmount: data?.ncaAmount || 0,
    quarter: data?.quarter || "",
    remarks: data?.remarks || "",
    files: data?.files || [],
  };

  const { handleSubmit, reset, control } = useForm({ ...defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      quarter: findData?.quarter ? { value: findData.quarter, label: findData.quarter } : null,
      fundClusterId: findData?.fundClusterId ? { value: findData.fundClusterId, label: findData.fundClusterName, displayName: findData.fundClusterName } : null,

    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      quarter: formData?.quarter?.value,
      fundClusterId: formData?.fundClusterId?.value,
      fundClusterName: formData?.fundClusterId?.displayName,
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
        title={data?.noticeOfCashAllocationId ? "Update Notice Of Cash Allocation" : "New Notice Of Cash Allocation"}
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
                  disabled={isViewerOnly}
                  name="ncaDate"
                  control={control}
                  label="Date of NCA"
                  rules={{ required: "Date of NCA is required." }}
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
                <InputField
                  disabled={isViewerOnly}
                  name="mdsAccountNo"
                  control={control}
                  label="MDS Account No."
                  type="text"
                  placeholder="Enter MDS Account No...."
                  rules={{ required: "MDS Account No. is required." }}
                />
              </Col>

              <Col lg={6}>
                <CurrencyInputField
                  disabled={isViewerOnly}
                  name="ncaAmount"
                  control={control}
                  label="NCA Amount"
                  type="number"
                  rules={{
                    required: "NCA amount is required.",
                    validate: (value) => parseFloat(value) > 0 || "NCA amount should be greater than zero.",
                  }}
                  placeholder="Enter NCA amount..."
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Col>

              <Col lg={6}>
                <NormalSelect
                  isDisabled={isViewerOnly}
                  options={[
                    { value: "Q1 - Jan to Mar", label: "Q1 - Jan to Mar" },
                    { value: "Q2 - Apr to Jun", label: "Q2 - Apr to Jun" },
                    { value: "Q3 - Jul to Sep", label: "Q3 - Jul to Sep" },
                    { value: "Q4 - Oct to Dec", label: "Q4 - Oct to Dec" },
                  ]}
                  control={control}
                  name="quarter"
                  label="Quarter"
                  placeholder="Select quarter..."
                  rules={{ required: "Quarter is required." }}
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
                  {data?.noticeOfCashAllocationId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ noticeOfCashAllocationId: data?.noticeOfCashAllocationId || 0 }}
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
