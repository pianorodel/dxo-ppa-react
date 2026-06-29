import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpOfficesMutation, useSaveOfficesMutation } from "@/api/Endpoints/Master/StaticData/Offices";

const SaveModal = ({ data = null, show, onCloseClick, moduleName, selectedTreeId, listName, accessRights }) => {

  const [saveOffices, { isLoading: isSaving }] = useSaveOfficesMutation();
  const [lookUpOffices] = useLookUpOfficesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.officeId;
  const modalName = `${isUpdate ? "Update" : "New"} ${moduleName}`;

  const defaultValues = {
    officeId: data?.officeId || 0,
    parentId: data?.parentId || selectedTreeId || 0,
    parentName: data?.parentName || (selectedTreeId && selectedTreeId != 0 ? listName : "") || "",
    officeCode: data?.officeCode || "",
    officeName: data?.officeName || "",
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
      officeId: data?.officeId || 0,
      officeCode: data?.officeCode || "",
      officeName: data?.officeName || "",
      ...flattenSelectPairs(["parentId"], data),
    };

    try {
      const response = await saveOffices(payload).unwrap();
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
                loadOptions={formatLoadOptions(lookUpOffices)}
                placeholder="Select a parent..."
                getOptionValue={(opt) => opt.parentId || opt.value}
                getOptionLabel={(opt) => opt.parentName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="officeCode"
                control={control}
                label="Responsibility Center Code"
                type="text"
                rules={{
                  required: "Responsibility center code is required",
                }}
                placeholder="Enter Responsibility center code..."
                disabled={isReadOnly}
              />
            </Col>

            <Col lg={12}>
              <InputField
                name="officeName"
                control={control}
                label="Responsibility Center Name"
                type="text"
                rules={{
                  required: "Responsibility center name is required",
                }}
                placeholder="Enter Responsibility center name..."
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
