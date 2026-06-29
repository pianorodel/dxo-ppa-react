import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Row
} from "reactstrap";

import { InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSavePrepaidTypesMutation } from "@/api/Endpoints/FMS/StaticData/PrepaidTypes";

const MODULE_NAME = "Prepaid Type";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {

    const [savePrepaidType, { isLoading: isSaving }] = useSavePrepaidTypesMutation();
    const { notification } = useNotificationModal();
    const isReadOnly = !hasWriteAccess(accessRights);
    const isUpdate = !!data?.prepaidTypeId
    const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`

    const defaultValues = {
        "prepaidTypeId": data?.prepaidTypeId || 0,
        "prepaidTypeName": data?.prepaidTypeName || ''
    }

    const {
        handleSubmit,
        reset,
        control,
    } = useForm({ defaultValues });

    useEffect(() => {
        if (!show) return;
        reset(defaultValues);
    }, [show]);

    const onSubmit = async (data) => {
        const payload = {
            ...defaultValues,
            "prepaidTypeName": data?.prepaidTypeName || '',
        }

        try {
            const response = await savePrepaidType(payload).unwrap();

            assertApiSuccess(response);

            notification({ type: 'success', title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` })

            onCloseClick();
        } catch (error) {
            notification({ type: 'error', title: MODULE_NAME, message: `${error.message || "Unknown error"}` })
        }
    };

    return (
        <React.Fragment>
             <ModernModal title={modalName} isOpen={show} onClose={onCloseClick} width="650px" isSaving={isSaving} modifiedDate={data?.modifiedDate} canSave={hasWriteAccess(accessRights)} onSave={handleSubmit(onSubmit)}>
                   <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={12}>
                                <InputField
                                    name="prepaidTypeName"
                                    control={control}
                                    label="Name"
                                    type="text"
                                    placeholder="Enter name..."
                                    disabled={isReadOnly}
                                    rules={{ required: "PrepaidTypeName is required." }}
                                />
                            </Col>
                        </Row>
                    </Form>
            </ModernModal>
        </React.Fragment>
    );
};

export default SaveModal;
