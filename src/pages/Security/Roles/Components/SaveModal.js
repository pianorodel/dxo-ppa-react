import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import { InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal"; 
import SwitchButton from "@/components/Common/SwitchButton";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveRolesMutation } from "@/api/Endpoints/Core/Security/Roles";

const MODULE_NAME = "Role";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveRoles, { isLoading: isSaving }] = useSaveRolesMutation();
  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.roleId;
  const modalName = `${isUpdate ? "Update" : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    roleId: data?.roleId || 0,
    roleName: data?.roleName || "",
    description: data?.description || "",
    isActive: data?.isActive,
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      roleName: data.roleName || "",
      description: data.description || "",
      isActive: data.isActive,
    };

    try {
      const response = await saveRoles(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
    }
  };

  return (
    <React.Fragment>
      <ModernModal title={modalName}
        isOpen={show}
        onClose={onCloseClick}
        width="680px"
        isSaving={isSaving}
        modifiedDate={data?.modifiedDate}
        canSave={hasWriteAccess(accessRights)}
        onSave={handleSubmit(onSubmit)}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={12}>
              <InputField
                name="roleName"
                control={control}
                label="Role Name"
                type="text"
                rules={{
                  required: "role name is required.",
                }}
                placeholder="Enter role name..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="description"
                control={control}
                label="Description"
                type="textarea"
                placeholder="Enter description..."
                rows={3}
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={6}>
              <SwitchButton name="isActive" control={control} label="Active" disabled={isReadOnly} />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
