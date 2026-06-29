import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAccessUsersQuery } from "../api/Endpoints/Core/Security/Users";
import { getCurrentUser, hasAccess } from "../helpers/session_helper";

import { coreMenuItems } from "./Components/CoreMenuItems";

// ─── Per-system menu slices ───────────────────────────────────────────────────
import { buildFmsMenuItems } from "./Components/FMSMenuItems";

const Navdata = () => {
  const history = useNavigate();
  const location = useLocation();

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  const shouldFetch = getCurrentUser();
  const { data, refetch } = useGetAccessUsersQuery({}, { skip: !shouldFetch });
  const accessRights = data?.returnData?.map(({ permissionTypeId, allowRead, allowWrite, allowDelete }) => ({
    permissionTypeId, allowRead, allowWrite, allowDelete,
  }));

  useEffect(() => { refetch(); }, [location.pathname]);
  useEffect(() => {
    if (accessRights) sessionStorage.setItem("accessRights", JSON.stringify(accessRights));
  }, [accessRights]);

  // ── Top-level collapse states ───────────────────────────────────────────
  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [isFMS, setIsFMS] = useState(false);

  // ── FMS sub-collapse ────────────────────────────────────────────────────
  const [isFMSAccounting, setIsFMSAccounting] = useState(false);
  const [isFMSBudget, setIsFMSBudget] = useState(false);
  const [isFMSCollection, setIsFMSCollection] = useState(false);
  const [isFMSDisbursement, setIsFMSDisbursement] = useState(false);

  // ── Auto-collapse on section change ────────────────────────────────────
  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    if (iscurrentState !== "Apps") setIsApps(false);
    if (iscurrentState !== "Auth") setIsAuth(false);
    if (iscurrentState !== "Pages") setIsPages(false);
    if (iscurrentState !== "Dashboard") setIsDashboard(false);

    // FMS — collapse all sub-groups when leaving the FMS section
    if (!iscurrentState.startsWith("FMS")) {
      setIsFMS(false);
      setIsFMSAccounting(false);
      setIsFMSBudget(false);
      setIsFMSCollection(false);
      setIsFMSDisbursement(false);
    }
  }, [history, iscurrentState]);

  // ── Build FMS items ─────────────────────────────────────────────────────
  const fmsMenuItems = buildFmsMenuItems({
    isFMSAccounting, setIsFMSAccounting,
    isFMSBudget, setIsFMSBudget,
    isFMSCollection, setIsFMSCollection,
    isFMSDisbursement, setIsFMSDisbursement,
    setIscurrentState,
  });

  // ── withToggle — wires outer accordion state onto top-level menu items ──
  function withToggle(items, stateVar, setter, stateKey) {
    return items.map(function (item) {
      if (!item.subItems && !item.childItems) return item;
      return Object.assign({}, item, {
        stateVariables: stateVar,
        click: function (e) {
          e.preventDefault();
          setter(!stateVar);
          setIscurrentState(stateKey);
        },
      });
    });
  }

  // ── Assemble full menu ──────────────────────────────────────────────────
  const SYSTEMS_HEADER_IDX = 1;
  const beforeSystems = coreMenuItems.slice(0, SYSTEMS_HEADER_IDX + 1);
  const afterSystems = coreMenuItems.slice(SYSTEMS_HEADER_IDX + 1);

  const menuItems = [
    ...beforeSystems,
    ...fmsMenuItems,
    ...afterSystems,
  ];

  // ── Permission filter ───────────────────────────────────────────────────
  const filterMenu = (items) => {
    return items
      .map(item => {
        const newItem = { ...item };
        let isContainer = false;
        let hasVisibleChildren = false;

        if (item.subItems) {
          isContainer = true;
          newItem.subItems = filterMenu(item.subItems);
          if (newItem.subItems.length > 0) hasVisibleChildren = true;
        }
        if (item.childItems) {
          isContainer = true;
          newItem.childItems = filterMenu(item.childItems);
          if (newItem.childItems.length > 0) hasVisibleChildren = true;
        }

        // Container items survive only when they still have visible children
        if (isContainer) {
          return hasVisibleChildren ? newItem : null;
        }

        // Leaf items are filtered by their own permission
        return hasAccess(item.permissionTypeId, accessRights) ? newItem : null;
      })
      .filter(Boolean);
  };

  return <React.Fragment>{filterMenu(menuItems)}</React.Fragment>;
};

export default Navdata;