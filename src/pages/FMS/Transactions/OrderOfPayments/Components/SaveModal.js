import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Form, Row } from "reactstrap";

import AsyncFileUpload from "@/components/Common/AsyncFileUpload";
import FileUpload from "@/components/Common/FileUpload";
import { AsyncSelect, DatePickerField, InputField, MobileInputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import ModernModal from "@/components/Common/Modals/ModernModal";
import Section from "@/components/Common/Section";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import './style.css';

import { useLookUpClientsMutation } from "@/api/Endpoints/FMS/StaticData/Clients";
import { useLookUpFeeTypesMutation } from "@/api/Endpoints/FMS/StaticData/FeeTypes";
import {
  useCancelOrderOfPaymentsMutation,
  useFilesDeleteOrderOfPaymentsMutation,
  useFilesUploadOrderOfPaymentsMutation,
  useFindOrderOfPaymentsQuery,
  useSaveOrderOfPaymentsMutation,
  useSubmitOrderOfPaymentsMutation,
} from "@/api/Endpoints/FMS/Transactions/OrderOfPayment/OrderOfPayments";

const MODULE_NAME = "Order Of Payment";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList, parentKey, onUpdateParentKey }) => {
  const [fileObj, setFiles] = useState([]);
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveOrderOfPaymentsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitOrderOfPaymentsMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelOrderOfPaymentsMutation();
  const [lookupClient] = useLookUpClientsMutation();
  const [lookupFeeType] = useLookUpFeeTypesMutation();

  const { data: transactionData, refetch } = useFindOrderOfPaymentsQuery(
    { orderOfPaymentId: data?.orderOfPaymentId },
    { skip: !data?.orderOfPaymentId, refetchOnMountOrArgChange: show },
  );

  const [uploadFiles, { isLoading: isUploading }] = useFilesUploadOrderOfPaymentsMutation();
  const [deleteFiles, { isLoading: isDeleting }] = useFilesDeleteOrderOfPaymentsMutation();

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_ORDEROFPAYMENTS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    orderOfPaymentId: data?.orderOfPaymentId || 0,
    referenceNo: data?.referenceNo || "",
    issueDate: data?.issueDate || null,
    dueDate: data?.dueDate || null,
    validityDate: data?.validityDate || null,
    feeTypeId: data?.feeTypeId || 0,
    feeTypeName: data?.feeTypeName || "",
    principalAmount: data?.principalAmount || 0,
    surcharge: data?.surcharge || 0,
    totalAmount: data?.totalAmount || 0,
    payorId: data?.payorId || 0,
    payorName: data?.payorName || "",
    payorTIN: data?.payorTIN || "",
    payorAddress: data?.payorAddress || "",
    payorContactNo: data?.payorContactNo || "",
    particulars: data?.particulars || "",
    files: data?.files || [],
  };

  const { handleSubmit, reset, control, setValue, watch } = useForm({ ...defaultValues });

  const principalAmount = watch("principalAmount");
  const surcharge = watch("surcharge");

  useEffect(() => {
    const principal = parseFloat(principalAmount) || 0;
    const sur = parseFloat(surcharge) || 0;
    setValue("totalAmount", (principal + sur).toFixed(2));
  }, [principalAmount, surcharge, setValue]);

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
      payorId: findData?.payorId
        ? {
          value: findData?.payorId,
          label: findData?.payorName,
          clientId: findData?.payorId,
          clientName: findData?.payorName,
        }
        : null,
      ...buildSelectPairs(["feeTypeId"], findData),
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      payorId: formData?.payorId?.clientId,
      payorName: formData?.payorId?.clientName,
      ...flattenSelectPairs(["feeTypeId"], formData),
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
        title={data?.orderOfPaymentId ? "Update Order Of Payment" : "New Order Of Payment"}
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

          <Section title="Revenue / Fee Details">
            <Row>
              <Col lg={6}>
                <DatePickerField
                  control={control}
                  label="Date of Issue"
                  name="issueDate"
                  rules={{ required: "Date of issue is required." }}
                />
              </Col>
              <Col lg={6}>
                <DatePickerField
                  control={control}
                  label="Due Date"
                  name="dueDate"
                  rules={{ required: "Due Date is required." }}
                />
              </Col>
              <Col lg={6}>
                <DatePickerField
                  control={control}
                  label="Validity Date"
                  name="validityDate"
                  rules={{ required: "Validity Date is required." }}
                />
              </Col>
              <Col lg={6}>
                <AsyncSelect
                  isClearable
                  name="feeTypeId"
                  control={control}
                  label="Fee Type / Nature of Collection"
                  loadOptions={formatLoadOptions(lookupFeeType, { parentUACS: "40" })}
                  rules={{ required: "Fee Type is required." }}
                  placeholder="Select Fee Type..."
                  getOptionValue={(opt) => opt.feeTypeId || opt.value}
                  getOptionLabel={(opt) => opt.feeTypeName || opt.label}
                  isDisabled={isViewerOnly}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Amount Computation">
            <Row>
              <Col lg={4}>
                <CurrencyInputField
                  control={control}
                  label="Principal Amount"
                  name="principalAmount"
                  placeholder="0.00"
                  rules={{
                    required: "Principal amount is required.",
                    validate: (value) => parseFloat(value) > 0 || "Principal amount should be greater than zero.",
                  }}
                />
              </Col>
              <Col lg={4}>
                <CurrencyInputField
                  control={control}
                  label="Surcharge / Penalty (if any)"
                  name="surcharge"
                  placeholder="0.00"
                  rules={{
                    validate: (value) => !value || parseFloat(value) >= 0 || "Amount must be zero or greater.",
                  }}
                />
              </Col>
              <Col lg={4}>
                <CurrencyInputField
                  disabled
                  control={control}
                  label="Total Amount Due"
                  name="totalAmount"
                  placeholder="0.00"
                  rules={{
                    required: "Total amount is required.",
                    validate: (value) => parseFloat(value) > 0 || "Total amount should be greater than zero.",
                  }}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Payor Information">
            <Row>
              <Col lg={6}>
                <AsyncSelect
                  name="payorId"
                  control={control}
                  label="Payor Name / Business Name"
                  loadOptions={formatLoadOptions(lookupClient)}
                  rules={{ required: "Payor is required." }}
                  placeholder="Select payor..."
                  getOptionValue={(opt) => opt.clientId || opt.value}
                  getOptionLabel={(opt) => opt.clientName || opt.label}
                  onChange={(selected) => {
                    setValue("payorId", selected);
                    setValue("payorTIN", selected?.tin);
                  }}
                />
              </Col>
              <Col lg={6}>
                <InputField
                  control={control}
                  name="payorTIN"
                  label="TIN"
                  placeholder="XXX-XXX-XXX-XXX"
                />
              </Col>
              <Col lg={6}>
                <InputField
                  label="Address"
                  name="payorAddress"
                  control={control}
                  placeholder="Business or residential address"
                />
              </Col>
              <Col lg={6}>
                <MobileInputField
                  label="Contact No."
                  name="payorContactNo"
                  control={control}
                  placeholder="+63 XXX XXX XXXX"
                />
              </Col>
            </Row>
          </Section>

          <Section title="Particulars / Basis of Assessment">
            <Row>
              <Col lg={12}>
                <InputField
                  name="particulars"
                  control={control}
                  type="textarea"
                  rows={2}
                  maxLength={500}
                  showCharCounter
                  placeholder="Enter Particulars / Basis of Assessment..."
                />
              </Col>
            </Row>
          </Section>

          <Section title="Files">
            <Row>
              <Col lg={12}>
                <div className="my-3">
                  {data?.orderOfPaymentId ? (
                    <AsyncFileUpload
                      disabled={isViewerOnly}
                      files={data?.files || []}
                      uploadPayload={{ orderOfPaymentId: data?.orderOfPaymentId || 0 }}
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
