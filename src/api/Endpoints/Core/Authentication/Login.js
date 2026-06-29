import createDynamicResourceAPI from "@/helpers/rtk_dynamic_resource_factory";
import getBuilders from "@/api/Utils/GetBuilders";
import { getCurrentUser } from "@/helpers/session_helper";

const baseURL = process.env.REACT_APP_CORE_API + '/authentication';

const getAuthHeaders = () => {
    const currentUser = getCurrentUser();

    return {
        "Content-Type": "application/json",
        ...(currentUser?.token && {
            Authorization: `Bearer ${currentUser.token}`,
        }),
    };
};

export const authenticationAPI = createDynamicResourceAPI({
    resource: "Authentication",
    tagTypes: ["Authentication"],
    endpoints: (builder, resource) => {
        const { query, mutation } = getBuilders(builder);

        return {
            [`login${resource}`]: mutation(`${baseURL}/login`, {
                headers: getAuthHeaders(),
            }),

            [`switchProgram${resource}`]: mutation(`${baseURL}/switch-program`, {
                headers: getAuthHeaders(),
            }),

            [`unlock${resource}`]: mutation(`${baseURL}/unlock`, {
                headers: getAuthHeaders(),
            }),

            [`logout${resource}`]: mutation(`${baseURL}/logout`, {
                headers: getAuthHeaders(),
            }),

            [`idle${resource}`]: mutation(`${baseURL}/idle`, {
                headers: getAuthHeaders(),
            }),
        };
    },
});

export const {
    useLoginAuthenticationMutation,
    useSwitchProgramAuthenticationMutation,
    useUnlockAuthenticationMutation,
    useLogoutAuthenticationMutation,
    useIdleAuthenticationMutation
} = authenticationAPI;