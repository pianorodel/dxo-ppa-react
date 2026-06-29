import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { InputField } from "@/components/Common/Inputs";
import DxoModalComponent from "@/components/Common/Modals/DxoModalComponent";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveRegionsMutation } from "@/api/Endpoints/Master/StaticData/Regions";

const MODULE_NAME = "Region";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {

    const [saveRegion, { isLoading: isSaving }] = useSaveRegionsMutation();
    const { notification } = useNotificationModal();
    const isReadOnly = !hasWriteAccess(accessRights);
    const isUpdate = !!data?.regionId
    const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`

    const defaultValues = {
        "regionId": data?.regionId || 0,
        "regionName": data?.regionName || ''
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
            "regionName": data?.regionName || '',
        }

        try {
            const response = await saveRegion(payload).unwrap();

            assertApiSuccess(response);

            notification({ type: 'success', title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` })

            onCloseClick();
        } catch (error) {
            notification({ type: 'error', title: MODULE_NAME, message: `${error.message || "Unknown error"}` })
        }
    };

    return (
        <React.Fragment>
             <DxoModalComponent title={modalName} isOpen={show} onClose={onCloseClick} defaultExpanded={false} defaultSize="md">
                   <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={12}>
                                <InputField
                                    name="regionName"
                                    control={control}
                                    label="Name"
                                    type="text"
                                    placeholder="Enter name..."
                                    disabled={isReadOnly}
                                    rules={{ required: "RegionName is required." }}
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
