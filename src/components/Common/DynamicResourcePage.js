import classnames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row } from "reactstrap";

import { createPageStateUpdater } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import BreadCrumb from "./BreadCrumb";
import { FilterButton } from "./Buttons";
import TableContainer from "./TableContainer";
import TableToolbar from "./TableToolbar";

const DynamicResourcePage = ({
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
  accessRights = null,
  isShowTabs = false,
  tabs = [],
  customToolbars,
  customToolbarsEnd,
  AdvanceFilterComponent,
  renderExpandedRow,
  ...props
}) => {
  const { state, customFunction } = props;

  const updatePageState = createPageStateUpdater(state, customFunction.updateState);

  const { data, isLoading, isFetching, refetch } = useGetQuery({ ...state.pageDetails }, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (state?.parentKey) {
      refetch();
    }
  }, [state?.parentKey]);

  const handleActions = (action, data) => {
    const modalConfig = modalRegistry[action];
    if (modalConfig?.toggleKey) {
      customFunction.updateToggle(modalConfig.toggleKey, data);
    }
  };

  const modalConfigs = Object.entries(modalRegistry).map(([key, { component: ModalComponent, getProps }]) => {
    const props = getProps({
      state,
      handlers: { ...handlers, handleActions },
      title,
      moduleName,
      codeField,
      columnKey,
      statusIds: state.pageDetails.statusIds || tabs?.[0]?.statusIds || [],
    });
    return <ModalComponent key={key} {...props} />;
  });

  const columns = useMemo((customFunction) => getColumns(handleActions, { ...customFunction }), [handleActions]);

  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key || "1");

  const handleTabChange = (tabKey, statusIds) => {
    if (activeTab !== tabKey) {
      setActiveTab(tabKey, "1");
      customFunction.updateState({
        pageDetails: {
          ...state.pageDetails,
          statusIds: statusIds,
        },
      });
    }
  };

  useEffect(() => {
    if (activeTab === "1") {
      customFunction.updateState({
        totalPending: data?.totalRecords,
      });
    }
    //eslint-disable-next-line
  }, [data?.totalRecords]);

  const handleToggleFilter = () => {
    customFunction.updateToggle("toggleFilter");
    if (state.toggle.toggleFilter === true) {
      customFunction.updateState({
        pageDetails: {
          page: 1,
          pageSize: 10,
          sortField: "",
          sortOrder: "",
          keyword: state.pageDetails?.keyword || "",
        },
      });
    }
  };

  return (
    <div className={isTableOnly ? "" : "page-content"}>
      {modalConfigs}

      <Container fluid className={`${isMobile && `px-0 mx-0`}`}>
        {!isTableOnly && <BreadCrumb title={title} crumbs={breadCrumbs} />}
        <Row>
          {state.toggle.toggleFilter && (
            <Col xl={3} lg={3}>
              <AdvanceFilterComponent pageDetails={state.pageDetails} updateState={customFunction.updateState} />
            </Col>
          )}
          <Col className={state.toggle.toggleFilter ? "col-xl-9 col-lg-9" : "col-xl-12 col-lg-12"}>
            <Card style={isMobile ? {} : { minHeight: "74vh" }}>
              <div className="card-body pt-0">
                <CardBody>
                  {isShowTabs && (
                    <Row className="mt-10 mb-3">
                      <Nav className="nav-tabs nav-tabs-custom nav-success" role="tablist">
                        {tabs.map((tab) =>
                          hasWriteAccess(tab.accessRights) ? (
                            <NavItem key={tab.key}>
                              <NavLink
                                className={classnames({ active: activeTab === tab.key }, "fw-medium")}
                                onClick={() => handleTabChange(tab.key, tab.statusIds)}
                                href="#">
                                {tab.icon && <i className={`${tab.icon} me-1 align-bottom`}></i>}
                                {tab.label}
                                {tab.key === "1" && state?.totalPending > 0 ? (
                                  <span className="badge bg-danger align-middle ms-1">{state?.totalPending}</span>
                                ) : null}
                              </NavLink>
                            </NavItem>
                          ) : null,
                        )}
                      </Nav>
                    </Row>
                  )}

                  <TableToolbar
                    handleFilter={AdvanceFilterComponent && <FilterButton onClick={handleToggleFilter} toggle={state.toggle.toggleFilter} />}
                    handleCreate={hasWriteAccess(accessRights) ? () => handleActions("update") : undefined}
                    handleExport={() => handleActions("export")}
                    handleSearch={(keyword) => updatePageState("search", keyword)}
                    buttonCreateName={`Add ${moduleName}`}
                    customToolbars={customToolbars}
                    customToolbarsEnd={customToolbarsEnd}
                  />
                </CardBody>
                <TableContainer
                  isLoading={isLoading || isFetching}
                  key={activeTab}
                  columns={columns}
                  data={data?.items || data?.returnData || []}
                  divClass="table-responsive mb-1"
                  tableClass="mb-0 align-top"
                  theadClass="table-light"
                  pageSize={state.pageDetails.pageSize}
                  totalRecords={data?.totalRecords || 0}
                  currentPage={state.pageDetails.page}
                  onPageChange={(page) => updatePageState("pageChange", page)}
                  onSortChange={(field, order) =>
                    updatePageState("sortChange", {
                      sortField: field,
                      sortOrder: order,
                    })
                  }
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

export default DynamicResourcePage;
