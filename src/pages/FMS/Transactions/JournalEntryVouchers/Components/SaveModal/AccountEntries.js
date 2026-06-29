import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Input } from "reactstrap";

import { CreateButton } from "@/components/Common/Buttons";
import { AsyncSelect } from "@/components/Common/Inputs";
import TableContainer from "@/components/Common/TableContainer";
import { formatLoadOptions } from "@/helpers/data_helper";

import { useLookUpGeneralLedgersMutation } from "@/api/Endpoints/FMS/StaticData/GeneralLedgers";
import { useLookUpOfficesMutation } from "@/api/Endpoints/Master/StaticData/Offices";

const AccountEntries = ({ state, customFunction }) => {
  const [lookupOffice] = useLookUpOfficesMutation();
  const [lookupGeneralLedger] = useLookUpGeneralLedgersMutation();
  const subObjectOptions = [{ label: "SO1", value: "so1" }];

  const { control } = useForm({ defaultValues: {} });

  const handleSelectChange = (index, field, value) => {
    let newData = [...(state?.accountEntries || [])];
    newData[index][field] = value;
    customFunction.updateState({
      accountEntries: newData,
    });
  };

  const handleInputChange = (index, field, value) => {
    let newData = [...(state?.accountEntries || [])];
    newData[index] = { ...newData[index], [field]: value };
    customFunction.updateState({ accountEntries: newData });
  };

  const handleDeleteRow = (index) => {
    let newData = [...(state?.accountEntries || [])];
    newData.splice(index, 1);
    customFunction.updateState({
      accountEntries: newData,
    });
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      responsibilityCenter: null,
      accountTitle: "",
      accountCode: "",
      subObject: null,
      debit: "",
      credit: "",
    };
    customFunction.updateState({
      accountEntries: [...state.accountEntries, newRow],
    });
  };

  const generateColumns = (control) => [
    {
      header: "Responsibility Center",
      accessorKey: "responsibilityCenter",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <AsyncSelect
          key={row.original.id}
          name={`office-${row.original.id}`}
          control={control}
          label="Office"
          loadOptions={formatLoadOptions(lookupOffice)}
          placeholder="Select a office"
          value={row.original.responsibilityCenter}
          onChange={(value) => handleSelectChange(row.index, "responsibilityCenter", value)}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      ),
    },
    {
      header: "Account Title",
      accessorKey: "accountTitle",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <AsyncSelect
          key={row.original.id}
          name={`account-${row.original.id}`}
          control={control}
          label="Account"
          loadOptions={formatLoadOptions(lookupGeneralLedger)}
          placeholder="Select a account"
          value={row.original.accountTitle}
          menuPortalTarget={document.body}
          onChange={(value) => handleSelectChange(row.index, "accountTitle", value)}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      ),
    },
    {
      header: "Account Code",
      accessorKey: "accountCode",
      enableColumnFilter: false,
      cell: ({ row }) => {
        return <Input disabled type="text" className="form-control" value={row.original?.accountTitle?.accountCode} placeholder="Account Code" />;
      },
    },
    {
      header: "Sub Object",
      accessorKey: "subObject",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Select
          options={subObjectOptions}
          value={row.original.subObject}
          onChange={(selected) => handleSelectChange(row.index, "subObject", selected)}
          placeholder="Select"
        />
      ),
    },
    {
      header: "Debit",
      accessorKey: "debit",
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <Input
            type="number"
            className="form-control"
            defaultValue={row.original.debit}
            onBlur={(e) => handleInputChange(row.index, "debit", e.target.value)}
            placeholder="₱ 0.00"
          />
        );
      },
    },
    {
      header: "Credit",
      accessorKey: "credit",
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <Input
            type="number"
            className="form-control"
            defaultValue={row.original.credit}
            onBlur={(e) => handleInputChange(row.index, "credit", e.target.value)}
            placeholder="₱ 0.00"
          />
        );
      },
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => (
        <Link to="#" className="text-danger d-inline-block remove-item-btn mt-2" onClick={() => handleDeleteRow(row.index)}>
          <i className="ri-delete-bin-5-fill fs-16"></i>
        </Link>
      ),
    },
  ];

  const columns = useMemo(() => generateColumns(control), [control, state.accountEntries]);

  return (
    <div>
      <div className="mb-2 d-flex justify-content-end">
        <CreateButton text="Add Entry" onClick={handleAddRow} />
      </div>
      <div>
        <TableContainer
          columns={columns}
          data={state?.accountEntries || []}
          divClass="table-responsive mb-1"
          tableClass="mb-0 align-top table-borderless"
          theadClass="table-light"
          currentPage={1}
          pageSize={10}
          totalRecords={state?.accountEntries?.length || 0}
        />
      </div>
    </div>
  );
};

export default AccountEntries;
