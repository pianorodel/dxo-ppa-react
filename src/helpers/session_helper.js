export const getCurrentUser = () => {
    const user = sessionStorage.getItem("currentUser");
    if (!user) return null;
    return JSON.parse(user);
};

export const getAccessRights = () => {
    const accessRights = JSON.parse(sessionStorage.getItem("accessRights") || "[]");
    return accessRights || [];
};

export const hasAccess = (requiredPermissions = [], userPermissions = getAccessRights()) => {
    if (!Array.isArray(requiredPermissions) || requiredPermissions.length === 0) return true;
    if (!Array.isArray(userPermissions) || userPermissions.length === 0) return false;

    const userPermissionIds = userPermissions.map(p => p.permissionTypeId);

    return requiredPermissions.some(id => userPermissionIds.includes(id));
};

const getPermissionById = (permissionTypeId, userPermissions = getAccessRights()) => {
    if (permissionTypeId == null) return { allowRead: true, allowWrite: true, allowDelete: true };
    return userPermissions?.find(p => p.permissionTypeId === permissionTypeId) || null;
};

const normalizeToArray = (input) => Array.isArray(input) ? input : [input];``

export const hasReadAccess = (permissionTypeIds, userPermissions = getAccessRights()) => {
    return normalizeToArray(permissionTypeIds).some(id => {
        const perm = getPermissionById(id, userPermissions);
        return !!perm?.allowRead;
    });
};

export const hasWriteAccess = (permissionTypeIds, userPermissions = getAccessRights()) => {

    const permissionArray = normalizeToArray(permissionTypeIds);
    
    return permissionArray.some(id => {
        const perm = getPermissionById(id, userPermissions);
        return !!perm?.allowWrite;
    });
};

export const hasDeleteAccess = (permissionTypeIds, userPermissions = getAccessRights()) => {
    return normalizeToArray(permissionTypeIds).some(id => {
        const perm = getPermissionById(id, userPermissions);
        return !!perm?.allowDelete;
    });
};


