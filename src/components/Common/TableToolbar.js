import { isMobile } from "react-device-detect";
import { Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, UncontrolledDropdown } from "reactstrap";

import useCustomHook from "../Hooks/useCustomHook";
import { CreateButton, ExportButton, PrintButton } from "./Buttons";

const TableToolbar = ({
  handleFilter,
  handleSearch,
  handleCreate,
  handleExport,
  buttonCreateName = "Add",
  handlePrint,
  customToolbars,
  customToolbarsEnd,
  customToolbarBottom,
}) => {
  const { state, customFunction } = useCustomHook();

  const handleChangeSearch = (e) => {
    customFunction.updateState({
      searchValue: e.target.value,
    });
  };

  const handleKeySearchDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(state?.searchValue);
    }

    if (e.key === " ") {
      const currentValue = state?.searchValue || "";
      const lastChar = currentValue[currentValue.length - 1];

      if (lastChar !== " ") {
        handleSearch(state?.searchValue);
      }
    }
  };

  const actions = [
    handleCreate && {
      key: "create",
      label: buttonCreateName,
      icon: "ri-add-line",
      onClick: handleCreate,
      component: <CreateButton text={buttonCreateName} onClick={handleCreate} />,
    },
    handleExport && {
      key: "export",
      label: "Export",
      icon: "ri-file-download-line",
      onClick: handleExport,
      component: <ExportButton onClick={handleExport} />,
    },
    handlePrint && {
      key: "print",
      label: "Print",
      icon: "ri-printer-fill",
      onClick: handlePrint,
      component: <PrintButton onClick={handlePrint} />,
    },
  ].filter(Boolean);

  return (
    <>
      {isMobile ? (
        <Row className={"mt-10 mb-3"}>
          {customToolbars}
          <Col xs={10} className="p-0">
            <div className="d-flex h-100">
              {handleFilter ? <div className="me-2">{handleFilter}</div> : ""}
              {handleSearch && (
                <div className={"search-box mb-0 mt-auto d-inline-block w-100"}>
                  <Input
                    className="form-control bg-light border-light"
                    placeholder={"Search here..."}
                    type="text"
                    onChange={handleChangeSearch}
                    onKeyDown={handleKeySearchDown}
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              )}
            </div>
          </Col>

          <Col className="px-0 mx-0">
            <div className="d-flex h-100 align-items-center justify-content-end">
              {actions.length === 1 && actions[0].component}

              {actions.length > 1 && (
                <UncontrolledDropdown>
                  <DropdownToggle className="btn btn-soft-secondary btn-md" tag="button" caret={false}>
                    <i className="ri-menu-2-line" />
                  </DropdownToggle>

                  <DropdownMenu className="dropdown-menu-end">
                    {actions.map((action) => (
                      <DropdownItem key={action.key} onClick={action.onClick}>
                        <i className={`${action.icon} align-bottom me-1`} />
                        {action.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </div>
          </Col>

          {customToolbarsEnd && <Col xs={12} className="mt-2">{customToolbarsEnd}</Col>}
        </Row>
      ) : (
        <Row className={"mt-10"}>
          {customToolbars}
          <Col sm={3} className="p-0">
            <div className="d-flex h-100">
              {handleFilter ? <div className="me-2">{handleFilter}</div> : ""}
              {handleSearch && (
                <div className={"search-box mb-0 mt-auto d-inline-block w-100"}>
                  <Input
                    className="form-control bg-light border-light"
                    placeholder={"Search here..."}
                    type="text"
                    onChange={handleChangeSearch}
                    onKeyDown={handleKeySearchDown}
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              )}
            </div>
          </Col>
          {customToolbarsEnd && (
            <Col sm="auto" className="d-flex align-items-end">
              {customToolbarsEnd}
            </Col>
          )}
          <div className="col-sm-auto ms-auto">
            <div className="d-flex h-100 align-items-end">
              {handleCreate ? <CreateButton text={buttonCreateName} onClick={handleCreate} /> : ""}
              &nbsp; {handleExport ? <ExportButton onClick={handleExport} /> : ""}
              &nbsp; {handlePrint ? <PrintButton onClick={handlePrint} /> : ""}
            </div>
          </div>
        </Row>
      )}

      {customToolbarBottom && (
        <Row className="mt-2">
          <Col xs={12}>{customToolbarBottom}</Col>
        </Row>
      )}
    </>
  );
};

export default TableToolbar;