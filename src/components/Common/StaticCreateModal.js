import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { InputField } from "@/components/Common/Inputs/InputField";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

const FIELD_COMPONENTS = {
  text: InputField,
  textarea: (props) => <InputField type="textarea" rows={3} {...props} />,
  switch: SwitchButton,
};

const StaticSaveModal = ({ data = {}, show, onCloseClick, fields, mutationHook, defaultValues, moduleName, accessRights }) => {
  const [saveMutation, { isLoading: isSaving }] = mutationHook();
  const { notification } = useNotificationModal();

  const isUpdate = !!data[Object.keys(defaultValues)[0]];
  const modalName = `${isUpdate ? "Update" : "New"} ${moduleName}`;

  const initialValues = {
    ...defaultValues,
    ...Object.fromEntries(Object.keys(defaultValues).map((key) => [key, data[key] ?? defaultValues[key]])),
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues: initialValues });

  useEffect(() => {
    if (show) reset(initialValues);
  }, [show]);

  const onSubmit = async (formData) => {
    try {
      const response = await saveMutation({ ...initialValues, ...formData }).unwrap();
      assertApiSuccess(response);

      notification({
        type: "success",
        title: moduleName,
        message: `${moduleName} was successfully ${isUpdate ? "updated" : "added"}.`,
      });

      onCloseClick();
    } catch (error) {
      notification({
        type: "error",
        title: moduleName,
        message: `${error.message || "Unknown error"}`,
      });
    }
  };

  return (
    <>
      <Modal modalClassName="flip" id="SaveModal" size="md" isOpen={show} toggle={onCloseClick} centered backdrop="static">
        <ModalHeader toggle={onCloseClick} className="p-3 bg-success-subtle">
          {modalName}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {fields.map((field, index) => {
                const Component = FIELD_COMPONENTS[field.type];
                if (!Component) return null;

                return (
                  <Col lg={12} key={index}>
                    <Component
                      name={field.name}
                      control={control}
                      label={field.label}
                      placeholder={field.placeholder}
                      rules={field.required ? { required: `${field.label} is required` } : undefined}
                    />
                  </Col>
                );
              })}
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
    </>
  );
};

export default StaticSaveModal;
