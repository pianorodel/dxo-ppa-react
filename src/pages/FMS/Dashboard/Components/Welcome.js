import { format } from "date-fns";
import FeatherIcon from "feather-icons-react";
import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const Welcome = () => {

    return (
        <React.Fragment>
            <Row>

                <Col xs={12}>
                    <Card>
                        <CardBody className="bg-info-subtle">
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <FeatherIcon
                                        icon="calendar"
                                        className="text-info icon-dual-info"
                                    />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h6 className="fs-15">Welcome to the Financial Management System!</h6>
                                    <p className="text-muted mb-0">
                                        A digital platform that automates government financial recordkeeping, budget execution, and accounting reporting for transparent and efficient public fund management.
                                    </p>
                                    <br />
                                    <p className="mb-2">Today's Date: {format(new Date(), "MMM dd yyyy")}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Welcome;