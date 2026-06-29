import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { InputField } from "@/components/Common/Inputs";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveTransactionInboxesMutation } from "@/api/Endpoints/FMS/Accounting/TransactionInboxes";

const MODULE_NAME = "Transaction Inbox";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveTransactionInbox, { isLoading: isSaving }] = useSaveTransactionInboxesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.transactionInboxId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    transactionInboxId: data?.transactionInboxId || 0,
    transactionInboxName: data?.transactionInboxName || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      transactionInboxName: data?.transactionInboxName || "",
    };

    try {
      const response = await saveTransactionInbox(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
    }
  };

  return (
    <React.Fragment>
      <Modal modalClassName="flip" id="SaveModal" size="md" isOpen={show} toggle={onCloseClick} centered backdrop="static">
        <ModalHeader toggle={onCloseClick} className="p-3 bg-success-subtle">
          {modalName}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col lg={12}>
                <InputField
                  name="transactionInboxName"
                  control={control}
                  label="Name"
                  type="text"
                  placeholder="Enter name..."
                  disabled={isReadOnly}
                  rules={{ required: "TransactionInboxName is required." }}
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
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default SaveModal;
