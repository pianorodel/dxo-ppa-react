import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { DatePickerField, InputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import "./style.css";

import {
  useFindCheckDisbursementsQuery,
  useSaveCheckDisbursementsMutation,
  useSubmitCheckDisbursementsMutation,
} from "@/api/Endpoints/FMS/Transactions/CheckDisbursement/CheckDisbursements";

const MODULE_NAME = "Check Disbursement";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveCheckDisbursementsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitCheckDisbursementsMutation();
  const { data: transactionData, refetch } = useFindCheckDisbursementsQuery(
    { checkDisbursementId: data?.checkDisbursementId },
    { skip: !data?.checkDisbursementId, refetchOnMountOrArgChange: show }
  );
  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([FMS_ACCESS_RIGHTS.FMS_TRANSACTIONS_CHECKDISBURSEMENTS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    checkDisbursementId: 0,
    checkNo: "",
    payee: "",
    checkLabel: "",
    amount: null,
    checkDate: null,
    remarks: "",
  };

  const { handleSubmit, reset, control } = useForm({ ...defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
    };

    try {
      const response = actionType.current === "save" ? await save(payload).unwrap() : await submit(payload).unwrap();

      assertApiSuccess(response);

      notification({
        type: "success",
        title: response.returnData.referenceNo,
        header: `${actionType.current === "save" ? "Save" : "Submit"} ${MODULE_NAME}`,
        message: `${MODULE_NAME} was successfully ${actionType.current === "save" ? "saved" : "submitted"}.`,
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
        title={data?.checkDisbursementId ? "Update Check Disbursement Request" : "Add Check Disbursement Request"}
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
        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={12}>
              <InputField
                disabled={isViewerOnly}
                name="checkNo"
                control={control}
                label="Check No."
                type="text"
                rules={{
                  required: "Check No. is required",
                }}
                placeholder="Enter check no...."
              />
            </Col>
            <Col lg={6}>
              <InputField
                disabled={isViewerOnly}
                name="payee"
                control={control}
                label="Payee"
                type="text"
                rules={{
                  required: "Payee is required",
                }}
                placeholder="Enter payee...."
              />
            </Col>
            <Col lg={6}>
              <InputField
                disabled={isViewerOnly}
                name="checkLabel"
                control={control}
                label="Check Label"
                type="text"
                rules={{
                  required: "Check label is required",
                }}
                placeholder="Enter check label...."
              />
            </Col>
            <Col lg={6}>
              <CurrencyInputField
                disabled={isViewerOnly}
                name="amount"
                control={control}
                label="Amount"
                rules={{
                  required: "Payee is required",
                }}
                placeholder="Enter payee...."
              />
            </Col>
            <Col lg={6}>
              <DatePickerField
                disabled={isViewerOnly}
                control={control}
                name="checkDate"
                label="Check Date"
                options={{
                  maxDate: new Date(),
                }}
                rules={{
                  required: "Check date is required",
                }}
              />
            </Col>

            <Col lg={12}>
              <InputField
                disabled={isViewerOnly}
                rows={4}
                name="remarks"
                control={control}
                label="Remarks"
                type="textarea"
                maxLength={500}
                showCharCounter
                rules={{ required: "Remarks is required." }}
                placeholder="Enter remarks..."
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
