import { useLookUpSystemsMutation } from '@/api/Endpoints/Core/App/Systems';
import { useLookUpUsersMutation } from '@/api/Endpoints/Core/Security/Users';
import { SearchButton } from '@/components/Common/Buttons';
import { AsyncSelect, DatePickerField } from '@/components/Common/Inputs';
import { formatLoadOptions } from '@/helpers/data_helper';
import { getCurrentUser } from '@/helpers/session_helper';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Form } from "reactstrap";

const AdvanceFilter = ({ pageDetails, updateState }) => {
    const [lookupUser] = useLookUpUsersMutation()
    const [lookupSystem] = useLookUpSystemsMutation()
    const user = getCurrentUser()

    const {
        handleSubmit,
        reset,
        control,
    } = useForm({

    });

    const onSubmit = (data) => {
        const payload = {
            pageDetails: {
                ...pageDetails,
                userId: data?.userId?.value || 0,
                system: data?.systemId?.value === 0 ? '' : (data?.systemId?.label || ''),
                dateFrom: data?.logDate?.[0] || '',
                dateTo: data?.logDate?.[1] || '',
                page: 1
            }
        }

        updateState(payload)
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
                            <Link to="#" className="text-decoration-underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    reset();
                                }}
                            >
                                Clear All
                            </Link>
                        </div>
                    </div>
                </CardHeader>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body ">
                        <AsyncSelect
                            isClearable
                            name="userId"
                            control={control}
                            label="Log By User"
                            loadOptions={formatLoadOptions(lookupUser)}
                            placeholder="Select log by user"
                            getOptionValue={(opt) => opt.userId || opt.value}
                            getOptionLabel={(opt) => opt.fullName || opt.label}
                        />

                        <AsyncSelect
                            isClearable
                            name="systemId"
                            control={control}
                            label="System"
                            loadOptions={formatLoadOptions(lookupSystem, { clid: user.clid })}
                            placeholder="Select a system"
                            getOptionValue={(opt) => opt.systemId || opt.value}
                            getOptionLabel={(opt) => opt.systemName || opt.label}
                            isLocal
                        />

                        <DatePickerField
                            control={control}
                            name="logDate"
                            label="Log Date"
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