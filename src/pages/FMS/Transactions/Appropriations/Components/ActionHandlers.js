import { toast } from "react-toastify";

import { assertApiSuccess } from "@/helpers/api_helper";

import { ModalRegistry } from "./ModalRegistry";

export const useActionHandlers = ({
  deleteMutation,
  exportMutation,
  customFunction,
  notification,
  moduleName,
  columnKey,
}) => {
  const handleDeleteItem = async (id) => {
    if (!id || !deleteMutation) return;

    try {
      const res = await deleteMutation({ [columnKey]: id }).unwrap();
      assertApiSuccess(res);
      notification({
        type: "success",
        title: moduleName,
        message: `${moduleName} deleted successfully.`,
      });
    } catch (error) {
      notification({
        type: "error",
        title: moduleName,
        message: `Failed to delete ${moduleName}: ${error.message}`,
      });
    }

    customFunction.updateToggle("toggleDelete");
  };

  const handleExport = async (e, pageDetails) => {
    if (!exportMutation) {
      toast.error("Export function is not available.");
      return;
    }

    if (!e) return customFunction.updateToggle("toggleExport");

    try {
       await exportMutation(pageDetails);
      toast(`${moduleName} was successfully downloaded.`, {
        position: "top-right",
        className: "bg-success text-white",
      });
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    }

    customFunction.updateToggle("toggleExport");
  };

  const handleActions = (action, data) => {
    const toggleKey = ModalRegistry[action]?.toggleKey;
    if (toggleKey) customFunction.updateToggle(toggleKey, data);
  };

  const handleUpdateParentKey = (parentKey) => {
    customFunction.updateState({ parentKey });
  };

  return { handleDeleteItem, handleExport, handleActions, handleUpdateParentKey };
};
