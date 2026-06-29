import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { DatePickerField, EmailInputField, InputField, MobileInputField, NameInputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { CORE_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildPayload } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import "./style.css";

import {
  useFindAccessRequestsQuery,
  useSaveAccessRequestsMutation,
  useSubmitAccessRequestsMutation,
} from "@/api/Endpoints/Core/Transactions/AccessRequest/AccessRequests";

const MODULE_NAME = "Access Request";

const SaveModal = ({ data = null, show, onCloseClick, accessRights, refetchParentList }) => {
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveAccessRequestsMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitAccessRequestsMutation();
  const { data: transactionData, refetch } = useFindAccessRequestsQuery(
    { accessRequestId: data?.accessRequestId },
    { skip: !data?.accessRequestId, refetchOnMountOrArgChange: show },
  );

  const findData = transactionData?.returnData;
  const isViewerOnly = hasWriteAccess([CORE_ACCESS_RIGHTS.CORE_TRANSACTIONS_ACCESSREQUESTS_VIEWER]) && !hasWriteAccess(accessRights);

  const actionType = useRef("save");

  const defaultValues = {
    accessRequestId: 0,
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    emailAddress: "",
    mobileNo: "",
    birthDate: null,
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
        title={data?.prescriptionRequestId ? "Update Access Request" : "New Access Request"}
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
            <Col lg={6}>
              <InputField
                name="userName"
                control={control}
                label="User Name"
                type="text"
                rules={{
                  required: "User name is required.",
                }}
                placeholder="Enter user name..."
                readOnly={isViewerOnly}
                maxLength={20}
              />
            </Col>
            <Col lg={6}>
              <EmailInputField
                name="emailAddress"
                control={control}
                label="Email Address"
                type="email"
                rules={{
                  required: "Email address is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                placeholder="Enter email address..."
                readOnly={isViewerOnly}
              />
            </Col>
            <Col lg={4}>
              <NameInputField
                name="firstName"
                control={control}
                label="First Name"
                type="text"
                rules={{
                  required: "First Name is required.",
                }}
                placeholder="Enter first name..."
                maxLength={50}
                readOnly={isViewerOnly}
                uppercase
              />
            </Col>
            <Col lg={3}>
              <NameInputField
                name="middleName"
                control={control}
                label="Middle Name"
                type="text"
                placeholder="Enter middle name..."
                maxLength={50}
                readOnly={isViewerOnly}
                uppercase
              />
            </Col>
            <Col lg={4}>
              <NameInputField
                name="lastName"
                control={control}
                label="Last Name"
                type="text"
                rules={{
                  required: "Last name is required.",
                }}
                placeholder="Enter last name..."
                maxLength={50}
                readOnly={isViewerOnly}
                uppercase
              />
            </Col>
            <Col lg={1}>
              <NameInputField
                name="suffix"
                control={control}
                label="Suffix"
                type="text"
                placeholder=""
                readOnly={isViewerOnly}
                maxLength={4}
                uppercase
              />
            </Col>
            <Col lg={4}>
              <DatePickerField
                control={control}
                name="birthDate"
                label="Date of Birth"
                readOnly={isViewerOnly}
                options={{
                  maxDate: new Date(),
                }}
                placeholder="Select birth date..."
              />
            </Col>
            <Col lg={3}>
              <MobileInputField
                name="mobileNo"
                control={control}
                label="Mobile No."
                type="text"
                rules={{
                  required: "Mobile No. is required.",
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Invalid mobile no.",
                  },
                }}
                placeholder="Enter mobile no..."
                readOnly={isViewerOnly}
              />
            </Col>
            <Col lg={12}>
              <InputField
                disabled={isViewerOnly}
                rows={4}
                name="remarks"
                control={control}
                label="Purpose"
                type="textarea"
                maxLength={500}
                showCharCounter
                placeholder="Enter short description of your role or purpose of the access request."
                rules={{ required: "Purpose is required." }}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
