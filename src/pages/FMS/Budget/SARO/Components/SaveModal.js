import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { DatePickerField, InputField } from "@/components/Common/Inputs";
import DxoModalComponent from "@/components/Common/Modals/DxoModalComponent";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveSAROsMutation } from "@/api/Endpoints/FMS/Budget/SAROs";

const MODULE_NAME = "SARO";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveSARO, { isLoading: isSaving }] = useSaveSAROsMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.saroId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    saroId: data?.saroId || 0,
    saroNo: data?.saroNo || "",
    amount: data?.amount || "",
    releasedDate: data?.releasedDate || "",
    department: data?.department || "",
    agency: data?.agency || "",
    operatingUnit: data?.operatingUnit || "",
    purpose: data?.purpose || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      saroNo: data?.saroNo || "",
      amount: data?.amount || "",
      releasedDate: data?.releasedDate || "",
      department: data?.department || "",
      agency: data?.agency || "",
      operatingUnit: data?.operatingUnit || "",
      purpose: data?.purpose || "",
    };

    try {
      const response = await saveSARO(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
    }
  };

  return (
    <React.Fragment>
      <DxoModalComponent title={modalName} isOpen={show} onClose={onCloseClick} defaultExpanded={false} defaultSize="md">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={12}>
              <InputField
                name="saroNo"
                control={control}
                label="SARO No."
                type="text"
                placeholder="Enter saro no...."
                disabled={isReadOnly}
                rules={{ required: "SARO No. is required." }}
              />
            </Col>
            <Col lg={6}>
              <InputField
                name="amount"
                control={control}
                label="Amount"
                disabled={isReadOnly}
                type="number"
                rules={{
                  required: "Amount is required.",
                  validate: (value) => parseFloat(value) > 0 || "Amount should be greater than zero.",
                }}
                placeholder="Enter amount..."
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Col>
            <Col lg={6}>
              <DatePickerField
                disabled={isReadOnly}
                name="releasedDate"
                control={control}
                label="Released Date"
                options={{
                  maxDate: new Date(),
                }}
                placeholder="Enter released date..."
                rules={{ required: "Released date is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="department"
                control={control}
                label="Department"
                type="text"
                placeholder="Enter department..."
                disabled={isReadOnly}
                rules={{ required: "Department is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="agency"
                control={control}
                label="Agency"
                type="text"
                placeholder="Enter agency..."
                disabled={isReadOnly}
                rules={{ required: "Agency is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="operatingUnit"
                control={control}
                label="Operating Unit"
                type="text"
                placeholder="Enter operating unit..."
                disabled={isReadOnly}
                rules={{ required: "Operating unit is required." }}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="purpose"
                control={control}
                label="Purpose"
                type="textarea"
                rows={4}
                maxLength={500}
                showCharCounter
                placeholder="Enter purpose...."
                disabled={isReadOnly}
                rules={{ required: "Purpose is required." }}
              />
            </Col>
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <CloseButton onClick={onCloseClick} />
                {hasWriteAccess(accessRights) && <SaveButton isSaving={isSaving} />}
              </div>
            </Col>
          </Row>
        </Form>
      </DxoModalComponent>
    </React.Fragment>
  );
};

export default SaveModal;
