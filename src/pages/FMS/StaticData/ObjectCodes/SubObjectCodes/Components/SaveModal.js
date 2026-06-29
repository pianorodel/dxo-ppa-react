import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Row
} from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpObjectCodesMutation } from "@/api/Endpoints/FMS/StaticData/ObjectCodes";
import { useSaveSubObjectCodesMutation } from "@/api/Endpoints/FMS/StaticData/SubObjectCodes";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";

const MODULE_NAME = "Sub Object Code";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {

    const [saveSubObjectCode, { isLoading: isSaving }] = useSaveSubObjectCodesMutation();
    const [lookupObjectCodes] = useLookUpObjectCodesMutation();
    const { notification } = useNotificationModal();
    const isReadOnly = !hasWriteAccess(accessRights);
    const isUpdate = !!data?.subObjectCodeId
    const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`

    const defaultValues = {
        "subObjectCodeId": data?.subObjectCodeId || 0,
        "subObjectCodeName": data?.subObjectCodeName || '',
        "objectCodeId": data?.objectCodeId || '',
        "objectCodeName": data?.objectCodeName || ''
    }

    const {
        handleSubmit,
        reset,
        control,
    } = useForm({ defaultValues });

    useEffect(() => {
        if (!show) return;
        reset({
            ...defaultValues,
            ...buildSelectPairs(['objectCodeId'], data)
        });
    }, [show]);

    const onSubmit = async (data) => {
        const payload = {
            ...defaultValues,
            "subObjectCodeName": data?.subObjectCodeName || '',
            ...flattenSelectPairs(['objectCodeId'], data)
        }

        try {
            const response = await saveSubObjectCode(payload).unwrap();

            assertApiSuccess(response);

            notification({ type: 'success', title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` })

            onCloseClick();
        } catch (error) {
            notification({ type: 'error', title: MODULE_NAME, message: `${error.message || "Unknown error"}` })
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
                            <InputField
                                name="subObjectCodeName"
                                control={control}
                                label="Name"
                                type="text"
                                placeholder="Enter name..."
                                disabled={isReadOnly}
                                rules={{ required: "SubObjectCodeName is required." }}
                            />
                        </Col>
                        <Col lg={12}>
                            <AsyncSelect
                                isDisable={isReadOnly}
                                name="objectCodeId"
                                control={control}
                                label="Object Code"
                                loadOptions={formatLoadOptions(lookupObjectCodes)}
                                rules={{ required: "Object code is required." }}
                                placeholder="Select a object cde..."
                                getOptionValue={(opt) => opt.objectCodeId || opt.value}
                                getOptionLabel={(opt) => opt.objectCodeName || opt.label}
                            />
                        </Col>
                    </Row>
                </Form>
            </ModernModal>
        </React.Fragment>
    );
};

export default SaveModal;
