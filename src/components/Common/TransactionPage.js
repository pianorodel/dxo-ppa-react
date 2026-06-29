import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { isMobile } from "react-device-detect";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import { createPageStateUpdater } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import BreadCrumb from "./BreadCrumb";
import { FilterButton } from "./Buttons";
import { StatusChip } from "./StatusChip";
import TableContainer from "./TableContainer";
import TableToolbar from "./TableToolbar";

const TransactionPage = ({
  title,
  moduleName,
  useGetQuery,
  modalRegistry,
  handlers,
  getColumns,
  columnKey,
  codeField,
  breadCrumbs = [],
  isTableOnly = false,
  requestorAccessRights = null,
  isShowTabs = false,
  tabs = [],
  AdvanceFilterComponent,
  advFilterProps = {},
  renderExpandedRow,
  customListPayload = {},
  ...props
}) => {
  const { state, customFunction } = props;

  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key || "1");

  const updatePageState = createPageStateUpdater(state, customFunction.updateState);
  const tableContainerKey = `tableContainer-${activeTab}-${state?.tableParentKey || 1}`;

  const { data, isLoading, isFetching, refetch } = useGetQuery(
    {
      ...state.pageDetails,
      statusIds: !isShowTabs ? [] : state?.pageDetails?.statusIds || tabs?.[0]?.statusIds || [],
      ...customListPayload,
    },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (state?.parentKey) {
      refetch();
    }
  }, [state?.parentKey, refetch]);

  const handleActions = useCallback(
    (action, data) => {
      const modalConfig = modalRegistry[action];
      if (modalConfig?.toggleKey) {
        customFunction.updateToggle(modalConfig.toggleKey, data);
      }
    },
    [modalRegistry, customFunction],
  );

  const refetchParentList = useCallback(() => {
    refetch();
    customFunction.updateState({ tableParentKey: (state?.tableParentKey ?? 0) + 1 });
  }, [refetch, customFunction, state?.tableParentKey]);

  const columns = useMemo(() => getColumns(handleActions, { ...customFunction }), [handleActions, getColumns, customFunction]);

  const modalConfigs = useMemo(
    () =>
      Object.entries(modalRegistry).map(([key, { component: ModalComponent, getProps }]) => {
        const modalProps = getProps({
          state,
          handlers: { ...handlers, handleActions, refetchParentList },
          title,
          moduleName,
          codeField,
          columnKey,
          statusIds: state.pageDetails.statusIds || tabs?.[0]?.statusIds || [],
          customListPayload
        });
        return modalProps.show && <ModalComponent key={key} {...modalProps} />;
      }),
    [modalRegistry, state, handleActions, refetchParentList],
  );

  const handleTabChange = useCallback(
    (tabKey, statusIds) => {
      if (activeTab !== tabKey) {
        startTransition(() => {
          setActiveTab(tabKey);
          customFunction.updateState({
            pageDetails: {
              ...state.pageDetails,
              statusIds,
            },
          });
        });
      }
    },
    [activeTab, customFunction, state.pageDetails],
  );

  useEffect(() => {
    if (activeTab === "1") {
      customFunction.updateState({ totalPending: data?.totalRecords });
    }
  }, [data?.totalRecords]);

  const handleToggleFilter = useCallback(() => {
    startTransition(() => {
      customFunction.updateToggle("toggleFilter");
      if (state.toggle.toggleFilter === true) {
        customFunction.updateState({
          pageDetails: {
            page: 1,
            pageSize: 10,
            sortField: "",
            sortOrder: "",
            keyword: state.pageDetails?.keyword || "",
            statusIds: !isShowTabs ? [] : state?.pageDetails?.statusIds || tabs?.[0]?.statusIds || [],
          },
        });
      }
    });
  }, [customFunction, state.toggle.toggleFilter, state.pageDetails?.keyword]);

  const isTableLoading = isLoading || isFetching || isPending;

  const getChipColor = (tab) => {
    if (tab.badgeColor) return tab.badgeColor;
    const label = (tab.label || "").toLowerCase();
    if (label.includes("pending")) return "info";
    if (label.includes("complete")) return "success";
    if (label.includes("cancel")) return "danger";
    return "info";
  };

  const tabChips =
    isShowTabs && tabs?.length ? (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          if (!hasWriteAccess(tab.accessRights)) return null;
          const color = getChipColor(tab);
          return (
            <StatusChip key={tab.key} isActive={activeTab === tab.key} color={color} onClick={() => handleTabChange(tab.key, tab.statusIds)}>
              {tab.icon && <i className={`${tab.icon} align-bottom me-1`} />}
              {tab.label}
              {tab.key === "1" && state?.totalPending > 0 && (
                <span className={`badge rounded-pill ms-1 bg-${color}-subtle text-${color} fw-bold`}>
                  {state.totalPending}
                </span>
              )}
              {tab.totalCount > 0 && (
                <span className={`badge rounded-pill ms-1 bg-${color}-subtle text-${color} fw-bold`}>
                  {tab.totalCount}
                </span>
              )}
            </StatusChip>
          );
        })}
      </div>
    ) : null;

  return (
    <div className={isTableOnly ? "" : "page-content"}>
      {modalConfigs}

      <Container fluid className={`${isMobile && `px-0 mx-0`} transaction-page-container`}>
        {!isTableOnly && <BreadCrumb title={title} crumbs={breadCrumbs} />}
        <Row>
          {state.toggle.toggleFilter && (
            <Col xl={3} lg={3}>
              <AdvanceFilterComponent pageDetails={state.pageDetails} updateState={customFunction.updateState} {...advFilterProps} />
            </Col>
          )}
          <Col className={state.toggle.toggleFilter ? "col-xl-9 col-lg-9" : "col-xl-12 col-lg-12"}>
            <Card style={isMobile ? {} : { minHeight: "60vh" }}>
              <div className="card-body pt-0">
                <CardBody>
                  <TableToolbar
                    handleFilter={AdvanceFilterComponent && <FilterButton onClick={handleToggleFilter} toggle={state.toggle.toggleFilter} />}
                    handleCreate={hasWriteAccess(requestorAccessRights) ? () => handleActions("update") : undefined}
                    handleExport={() => handleActions("export")}
                    handleSearch={(keyword) => updatePageState("search", keyword)}
                    buttonCreateName={`New ${moduleName}`}
                    customToolbarsEnd={
                      <div className="col-auto p-0 d-flex align-items-center ms-2">
                        <div style={{ width: "0.5px", height: 20, background: "lightgray", marginRight: 12 }} />
                        {tabChips}
                      </div>
                    }
                  />
                </CardBody>
                <TableContainer
                  isLoading={isTableLoading}
                  key={tableContainerKey}
                  columns={columns}
                  data={data?.items || data?.returnData || []}
                  pageSize={state.pageDetails.pageSize}
                  totalRecords={data?.totalRecords || 0}
                  currentPage={state.pageDetails.page}
                  onPageChange={(page) => updatePageState("pageChange", page)}
                  onSortChange={(field, order) => updatePageState("sortChange", { sortField: field, sortOrder: order })}
                  onPageSizeChange={(pageSize) => updatePageState("pageSizeChange", pageSize)}
                  renderExpandedRow={renderExpandedRow}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TransactionPage;