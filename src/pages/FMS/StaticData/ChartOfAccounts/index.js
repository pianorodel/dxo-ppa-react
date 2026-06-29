import classnames from "classnames";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";

import BreadCrumb from "@/components/Common/BreadCrumb";

import AccountClassifications from "./AccountClassifications";
import GeneralLedgers from "./GeneralLedgers";
import SubsidiaryLedgers from "./SubsidiaryLedgers";

const ChartOfAccounts = () => {
  const [activeTab, setactiveTab] = useState("1");
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  return (
    <div className={"page-content"}>
      <Container fluid>
        <BreadCrumb
          title={"Chart of Accounts"}
          crumbs={[
            { title: "FMS", url: "/fms/dashboard" },
            { title: "Settings", url: "/fms/settings/" },
          ]}
        />
        <Row>
          <Col className={"col-xl-12 col-lg-12"}>
            <Card style={isMobile ? {} : { minHeight: "74vh" }}>
              <div className="card-body pt-0">
                <CardBody>
                  <Row className="mt-10">
                    <Nav pills className="nav nav-pills arrow-navtabs nav-success bg-light mb-3">
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() => {
                            toggle("1");
                          }}>
                          Account Classifications
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab === "2",
                          })}
                          onClick={() => {
                            toggle("2");
                          }}>
                          General Ledgers
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab === "3",
                          })}
                          onClick={() => {
                            toggle("3");
                          }}>
                          Subsidiary Ledgers
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Row>

                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">{activeTab === "1" && <AccountClassifications />}</TabPane>

                    <TabPane tabId="2">{activeTab === "2" && <GeneralLedgers />}</TabPane>

                    <TabPane tabId="3">{activeTab === "3" && <SubsidiaryLedgers />}</TabPane>
                  </TabContent>
                </CardBody>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChartOfAccounts;
