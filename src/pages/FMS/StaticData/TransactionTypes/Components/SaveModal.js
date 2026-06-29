import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpTransactionTypesMutation, useSaveTransactionTypesMutation } from "@/api/Endpoints/FMS/StaticData/TransactionTypes";

const SaveModal = ({ data = null, show, onCloseClick, moduleName, selectedTreeId, listName, accessRights }) => {
  const [saveTransactionTypes, { isLoading: isSaving }] = useSaveTransactionTypesMutation();
  const [lookUpTransactionTypes] = useLookUpTransactionTypesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.transactionTypeId;
  const modalName = `${isUpdate ? "Update" : "New"} ${moduleName}`;

  const defaultValues = {
    transactionTypeId: data?.transactionTypeId || 0,
    parentId: data?.parentId || selectedTreeId || 0,
    parentName: data?.parentName || (selectedTreeId && selectedTreeId != 0 ? listName : "") || "",
    transactionTypeName: data?.transactionTypeName || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      ...buildSelectPairs(["parentId"], data),
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      transactionTypeId: data?.transactionTypeId || 0,
      transactionTypeName: data?.transactionTypeName || "",
      ...flattenSelectPairs(["parentId"], data),
    };

    try {
      const response = await saveTransactionTypes(payload).unwrap();
      assertApiSuccess(response);
      notification({ type: "success", title: moduleName, message: `${moduleName} was successfully ${isUpdate ? "updated" : "added"}.` });
      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: moduleName, message: `Error saving data: ${error.message || "Unknown error"}` });
    }
  };

  return (
    <React.Fragment>
      <ModernModal
        title={modalName}
        isOpen={show}
        width="680px"
        modifiedDate={data?.modifiedDate}
        isSaving={isSaving}
        canSave={hasWriteAccess(accessRights)}
        onSave={handleSubmit(onSubmit)}
        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={12}>
              <AsyncSelect
                isClearable
                name="parentId"
                control={control}
                label="Parent"
                loadOptions={formatLoadOptions(lookUpTransactionTypes)}
                placeholder="Select a parent..."
                getOptionValue={(opt) => opt.parentId || opt.value}
                getOptionLabel={(opt) => opt.parentName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="transactionTypeName"
                control={control}
                label="Transaction Type Name"
                type="text"
                rules={{
                  required: "transaction type name is required",
                }}
                placeholder="Enter transaction type name..."
                disabled={isReadOnly}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
