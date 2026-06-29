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

import { useLookupProgramTypesMutation } from "@/api/Endpoints/FMS/Enums/ProgramTypesLookup";
import { useLookUpFMSProgramsMutation, useSaveFMSProgramsMutation } from "@/api/Endpoints/FMS/StaticData/Programs";

const MODULE_NAME = "Program/Project";

const SaveModal = ({ data = null, show, onCloseClick, selectedTreeId, listName, accessRights }) => {
  const [saveProgram, { isLoading: isSaving }] = useSaveFMSProgramsMutation();
  const [lookUpPrograms] = useLookUpFMSProgramsMutation();
  const [lookupProgramTypes] = useLookupProgramTypesMutation();

  const { notification } = useNotificationModal();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.programId;
  const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    programId: data?.programId || 0,
    programName: data?.programName || "",
    parentId: data?.parentId || selectedTreeId || 0,
    parentName: data?.parentName || (selectedTreeId && selectedTreeId != 0 ? listName : "") || "",
    uacs: data?.uacs || "",
    ...buildSelectPairs(["programTypeId"], data),
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset({
      ...defaultValues,
      ...buildSelectPairs(["parentId", "programTypeId"], data),
    });
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      programName: data?.programName || "",
      uacs: data?.uacs || "",
      ...flattenSelectPairs(["parentId", "programTypeId"], data),
    };

    try {
      const response = await saveProgram(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
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
                loadOptions={formatLoadOptions(lookUpPrograms)}
                placeholder="Select a parent..."
                getOptionValue={(opt) => opt.parentId || opt.value}
                getOptionLabel={(opt) => opt.parentName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="programName"
                control={control}
                label="Name"
                type="text"
                placeholder="Enter name..."
                disabled={isReadOnly}
                rules={{ required: "ProgramName is required." }}
              />
            </Col>
            <Col lg={12}>
              <AsyncSelect
                name="programTypeId"
                control={control}
                label="Program Type"
                loadOptions={formatLoadOptions(lookupProgramTypes)}
                rules={{ required: "program type is required." }}
                placeholder="Select a program type"
                getOptionValue={(opt) => opt.programTypeId || opt.value}
                getOptionLabel={(opt) => opt.programTypeName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="uacs"
                control={control}
                label="UACS"
                type="text"
                placeholder="Enter UACS..."
                disabled={isReadOnly}
                rules={{ required: "UACS is required." }}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
