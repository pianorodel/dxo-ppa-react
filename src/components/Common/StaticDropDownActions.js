import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

import { hasDeleteAccess, hasWriteAccess } from "@/helpers/session_helper";

const StaticDropDownActions = ({
  accessRights = null,
  data,
  isShowEdit = true,
  viewDetails = false,
  isShowDelete = true,
  isShowAudtiLogs = true,
  handleActions,
  updateName = "update",
  customItems = [],
  containerBody = true,
}) => {
  const canWrite = hasWriteAccess(accessRights);
  const canDelete = hasDeleteAccess(accessRights);

  return (
    <UncontrolledDropdown>
      <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button" caret={false}>
        <i className="ri-menu-2-line" />
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end" container={containerBody ? "body" : ""}>
        {viewDetails && (
          <DropdownItem onClick={() => handleActions("viewDetails", data)}>
            <i className="ri-eye-fill align-bottom me-2 text-muted" />
            View Details
          </DropdownItem>
        )}

        {canWrite && isShowEdit && (
          <DropdownItem onClick={() => handleActions(updateName, data)}>
            <i className="ri-pencil-fill align-bottom me-2 text-muted" />
            Edit
          </DropdownItem>
        )}

        {canDelete && isShowDelete && (
          <DropdownItem onClick={() => handleActions("delete", data)}>
            <i className="ri-delete-bin-fill align-bottom me-2 text-muted" />
            Delete
          </DropdownItem>
        )}

        {(canWrite || canDelete) && (isShowAudtiLogs || customItems.length > 0) && <DropdownItem divider />}

        {isShowAudtiLogs && (
          <DropdownItem onClick={() => handleActions("logs", data)}>
            <i className="ri-list-check-2 align-bottom me-2 text-muted" />
            Audit Logs
          </DropdownItem>
        )}

        {customItems.length > 0 && (
          <>
            {customItems.map((item, idx) => (
              <DropdownItem
                key={idx}
                disabled={item.disabled}
                title={item.disabled ? item.disabledTip : undefined}
                onClick={() => {
                  if (!item.disabled) handleActions(item.action, data);
                }}>
                {item.icon && <i className={`${item.icon} align-bottom me-2 text-muted`} />}
                {item.label}
              </DropdownItem>
            ))}
          </>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default StaticDropDownActions;
