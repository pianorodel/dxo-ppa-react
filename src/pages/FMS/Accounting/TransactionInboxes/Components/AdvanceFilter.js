import React from "react";
import { isMobile } from "react-device-detect";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Card, CardHeader, Form } from "reactstrap";

import { SearchButton } from "@/components/Common/Buttons";
import { DatePickerField } from "@/components/Common/Inputs";
import NormalSelect from "@/components/Common/Inputs/NormalSelect";

const AdvanceFilter = ({ pageDetails, updateState }) => {
  const { handleSubmit, reset, control } = useForm({});

  const onSubmit = (data) => {
    const payload = {
      pageDetails: {
        ...pageDetails,
        dateFrom: data?.logDate?.[0] || "",
        dateTo: data?.logDate?.[1] || "",
        page: 1,
      },
    };

    updateState(payload);
  };

  return (
    <React.Fragment>
      <Card style={isMobile ? {} : { minHeight: "74vh" }}>
        <CardHeader>
          <div className="d-flex mb-3">
            <div className="flex-grow-1">
              <h5 className="fs-16">Advance Filters</h5>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="#"
                className="text-decoration-underline"
                onClick={(e) => {
                  e.preventDefault();
                  reset();
                }}>
                Clear All
              </Link>
            </div>
          </div>
        </CardHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body ">
            <NormalSelect
              options={[
                { value: "All ", label: "All " },
                { value: "Regular Agency Fund", label: "Regular Agency Fund" },
                { value: "Special Agency Fund", label: "Special Agency Fund" },
                { value: "Trust Fund", label: "Trust Fund" },
              ]}
              control={control}
              name="fundingSource"
              label="Funding Source"
              placeholder="Select funding source..."
            />

            <NormalSelect
              options={[
                { value: "All ", label: "All " },
                { value: "Disbursement", label: "Disbursement" },
                { value: "Collections", label: "Collections" },
                { value: "Deposits", label: "Deposits" },
              ]}
              control={control}
              name="transactionType"
              label="Transaction type"
              placeholder="Select transaction type..."
            />

            <DatePickerField
              control={control}
              name="logDate"
              label="Transaction Date"
              options={{
                allowInput: false,
                mode: "range",
                maxDate: new Date(),
              }}
            />

            <div className="text-center">
              <br />
              <SearchButton text="Search" />
            </div>
          </div>
        </Form>
      </Card>
    </React.Fragment>
  );
};

export default AdvanceFilter;
