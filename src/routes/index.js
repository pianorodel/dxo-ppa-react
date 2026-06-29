import React from 'react';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

//Layouts
import NonAuthLayout from "../layouts/NonAuthLayout";
import VerticalLayout from "../layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./AllRoutes";
import { AuthProtected } from './AuthProtected';

import { useGetAccessUsersQuery } from "../api/Endpoints/Core/Security/Users";
import { getCurrentUser, hasAccess } from "../helpers/session_helper";

const Index = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const shouldFetch = getCurrentUser();
    const { data, refetch } = useGetAccessUsersQuery({}, { skip: !shouldFetch });

    const accessRights = data?.returnData?.map(({
        permissionTypeId,
        allowRead,
        allowWrite,
        allowDelete
    }) => ({
        permissionTypeId,
        allowRead,
        allowWrite,
        allowDelete
    }));

    const filteredRoutes = (items) => {
        return items
            .filter(item => hasAccess(item.permissionTypeId, accessRights))
            .map(item => {
                const newItem = { ...item };

                if (item.subItems) {
                    newItem.subItems = filterMenu(item.subItems);
                    if (newItem.subItems.length === 0) return null;
                }

                if (item.childItems) {
                    newItem.childItems = filterMenu(item.childItems);
                    if (newItem.childItems.length === 0) return null;
                }

                return newItem;
            })
            .filter(Boolean);
    };

    return (
        <React.Fragment>
            <Routes>

                {/* ── Existing public routes (NonAuthLayout) ── */}
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                {/* ── Existing protected routes (VerticalLayout) ── */}
                <Route>
                    {filteredRoutes(authProtectedRoutes).map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <VerticalLayout>{route.component}</VerticalLayout>
                                </AuthProtected>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;