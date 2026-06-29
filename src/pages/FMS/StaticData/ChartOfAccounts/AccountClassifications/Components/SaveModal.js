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

import {
  useLookUpAccountClassificationsMutation,
  useSaveAccountClassificationsMutation,
} from "@/api/Endpoints/FMS/StaticData/AccountClassifications";

const SaveModal = ({ data = null, show, onCloseClick, moduleName, selectedTreeId, listName, accessRights }) => {
  const [saveAccountClassifications, { isLoading: isSaving }] = useSaveAccountClassificationsMutation();
  const [lookUpAccountClassifications] = useLookUpAccountClassificationsMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.accountClassificationId;
  const modalName = `${isUpdate ? "Update" : "New"} ${moduleName}`;

  const defaultValues = {
    accountClassificationId: data?.accountClassificationId || 0,
    parentId: data?.parentId || selectedTreeId || 0,
    parentName: data?.parentName || (selectedTreeId && selectedTreeId != 0 ? listName : "") || "",
    accountClassificationCode: data?.accountClassificationCode || "",
    accountClassificationName: data?.accountClassificationName || "",
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
      accountClassificationId: data?.accountClassificationId || 0,
      accountClassificationCode: data?.accountClassificationCode || "",
      accountClassificationName: data?.accountClassificationName || "",
      ...flattenSelectPairs(["parentId"], data),
    };

    try {
      const response = await saveAccountClassifications(payload).unwrap();
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
                loadOptions={formatLoadOptions(lookUpAccountClassifications)}
                placeholder="Select a parent..."
                getOptionValue={(opt) => opt.parentId || opt.value}
                getOptionLabel={(opt) => opt.parentName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="accountClassificationCode"
                control={control}
                label="Account Classification Code"
                type="text"
                rules={{
                  required: "Account classification code is required",
                }}
                placeholder="Enter account classification code..."
                disabled={isReadOnly}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="accountClassificationName"
                control={control}
                label="Account Classification Name"
                type="text"
                rules={{
                  required: "Account Classification name is required",
                }}
                placeholder="Enter account classification name..."
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
