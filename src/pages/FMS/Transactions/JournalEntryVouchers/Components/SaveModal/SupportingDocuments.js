import { useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";

import { CreateButton } from "@/components/Common/Buttons";
import { UpdateAndDeleteColumn } from "@/components/Common/GridColumns";
import TableContainer from "@/components/Common/TableContainer";

import SupportingDocumentsSaveModal from "./SupportingDocumentsSaveModal";

const SupportingDocuments = ({ state, customFunction }) => {
  const columns = useMemo(
    () => [
      { header: "Code and Description", accessorKey: "codeDescription" },
      { header: "Document No.", accessorKey: "documentNo" },
      { header: "Date", accessorKey: "date" },
      {
        header: "Actions",
        cell: ({ row }) => <UpdateAndDeleteColumn handleUpdate={() => updateFunction(row)} handleDelete={() => handleDeleteRow(row)} />,
      },
    ],
    [],
  );

  const handleDeleteRow = (row) => {
    const updated = (state.supportingDocuments || []).filter((item) => item !== row.original);
    customFunction.updateState({ supportingDocuments: updated });
  };

  const updateFunction = (row) => {
    customFunction.updateToggle("toggleSaveModal", row.original);
  };

  const handleCrud = (bool, data) => {
    if (bool) {
      const existing = state?.supportingDocuments || [];
      const isUpdate = !!data?.supportingDocumentId;

      const updatedData = isUpdate
        ? existing.map((item) => (item.supportingDocumentId === data.supportingDocumentId ? data : item))
        : [...existing, { ...data, supportingDocumentId: Date.now() }];

      customFunction.updateState({ supportingDocuments: updatedData });
    }
    customFunction.updateToggle("toggleSaveModal");
  };

  return (
    <div>
      <div className="mb-2 d-flex justify-content-end">
        <CreateButton text="Add Supporting Documents" onClick={() => handleCrud(false)} />
      </div>
      <TableContainer
        columns={columns}
        data={state?.supportingDocuments || []}
        divClass="table-responsive mb-3"
        tableClass="align-middle table-borderless"
        theadClass="table-light"
        currentPage={1}
        pageSize={10}
        totalRecords={state?.supportingDocuments?.length || 0}
      />
      {state.toggle.toggleSaveModal && <SupportingDocumentsSaveModal data={state?.trxValue} show={true} onCloseClick={handleCrud} />}
    </div>
  );
};

export default SupportingDocuments;
