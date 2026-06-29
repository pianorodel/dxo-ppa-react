import React, { useEffect, useState } from "react";

import {
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from "reactstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import StaticResourcePage from "@/components/Common/StaticResourcePage";
import { formatLoadOptions } from "@/helpers/data_helper";
import { getCurrentUser } from "@/helpers/session_helper";

import { getPermissionsColumns } from "./Columns";

import { useExportPermissionsMutation, useGetPermissionsQuery, useToggleAllPermissionsMutation, useToggleDeletePermissionsMutation, useToggleReadPermissionsMutation, useToggleWritePermissionsMutation } from "@/api/Endpoints/Core/Security/RolePermissions";
import { useLookUpSystemsMutation } from "@/api/Endpoints/Core/App/Systems";

const MODULE_NAME = "Permission";

const PermissionsModal = ({ data = null, show, onCloseClick }) => {

    const [toggleRead] = useToggleReadPermissionsMutation();
    const [toggleWrite] = useToggleWritePermissionsMutation();
    const [toggleDelete] = useToggleDeletePermissionsMutation();
    const [toggleAll] = useToggleAllPermissionsMutation();
    const [lookupSystems] = useLookUpSystemsMutation()
    const [toggleExpand, setToggleExpand] = useState(false);

    const isUpdate = !!data?.roleId
    const roleId = data?.roleId
    const clid = getCurrentUser()?.clid
    const modalName = `${isUpdate ? "Update" : "New"} ${MODULE_NAME} ${data?.roleName ? `- ${data?.roleName}` : ""}`

    const defaultValues = {
        "roleId": data?.roleId || 0,
        "roleName": data?.roleName || "",
        "systemId": [{ label: "All Systems", value: 0 }],
        "permissionTypeId": 0,
    }

    const {
        reset,
        control,
        watch
    } = useForm({ defaultValues });

    const systemId = watch("systemId").value;

    useEffect(() => {
        if (!show) return;
        reset(defaultValues);
    }, [show]);

    const togglePermissions = async (toggle, data) => {
        const toggleMap = {
            allowRead: toggleRead,
            allowWrite: toggleWrite,
            allowDelete: toggleDelete,
            allowAll: toggleAll,
        };

        const isToggleAll = data.allowRead && data.allowWrite && data.allowDelete;

        const payload = {
            permissionTypeId: data.permissionTypeId,
            roleId, systemId: systemId ?? 0,
            [toggle]: toggle === "allowAll" ? !isToggleAll : !data[toggle],
        };

        if (!toggleMap[toggle]) return;

        try {
            await toggleMap[toggle](payload).unwrap();

            toast(`${MODULE_NAME} updated successfully.`, { position: "top-right", hideProgressBar: false, closeOnClick: true, className: "bg-success text-white", });
        } catch (error) {
            toast(`Error updating ${MODULE_NAME}: ${error.message || "Unknown error"}`, { position: "top-right", hideProgressBar: false, closeOnClick: true, className: "bg-danger text-white", });
        }
    };


    return (
        <React.Fragment>
            <ModernModal title={modalName}
                isOpen={show}
                onClose={onCloseClick}
                width="1180px"
                modifiedDate={data?.modifiedDate}>
                <Card>
                    <CardHeader className="mx-2 p-2 mb-3">
                        <Row>
                            <Col lg={4}>
                                <InputField
                                    disabled
                                    name="roleName"
                                    control={control}
                                    label="Role"
                                    type="text"
                                    rules={{
                                        required: "role is required.",
                                    }}
                                    placeholder="Enter role..."
                                />
                            </Col>
                            <Col lg={4}>
                                <AsyncSelect
                                    name="systemId"
                                    control={control}
                                    label="System"
                                    loadOptions={formatLoadOptions(lookupSystems, { clid })}
                                    rules={{
                                        required: "system is required.",
                                    }}
                                    placeholder="Select a system"
                                    getOptionValue={(opt) => opt.systemId || opt.value}
                                    getOptionLabel={(opt) => opt.systemName || opt.label}
                                />
                            </Col>
                        </Row>
                    </CardHeader>
                    <StaticResourcePage
                        key={systemId}
                        title="Permissions"
                        MODULE_NAME="Permission"
                        useGetQuery={useGetPermissionsQuery}
                        useExportMutation={useExportPermissionsMutation}
                        customListPayload={{ roleId, systemId: systemId ?? 0 }}
                        getColumns={(handleAction) => getPermissionsColumns(handleAction, { togglePermissions })}
                        columnKey="permissionTypeId"
                        codeField="permissionTypeName"
                        customInitialState={{ pageDetails: { pageSize: 999 } }}
                        isTableOnly
                        isReadOnly
                        isLocal
                    />
                </Card>
            </ModernModal>
        </React.Fragment>
    );
};

export default PermissionsModal;