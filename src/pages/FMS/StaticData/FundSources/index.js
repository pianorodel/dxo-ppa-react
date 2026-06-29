import classnames from "classnames";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { Card, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";

import BreadCrumb from "@/components/Common/BreadCrumb";
import AuthorizationCodes from "./AuthorizationCodes";
import FinancingSources from "./FinancingSources";
import FundCategories from "./FundCategories";
import FundSubCategories from "./FundSubCategories";
import FundClusters from "./FundClusters";

const TABS = [
  { id: "1", label: "Fund Clusters",      component: FundClusters },
  { id: "2", label: "Financing Sources",  component: FinancingSources },
  { id: "3", label: "Authorizations",     component: AuthorizationCodes },
  { id: "4", label: "Fund Categories",    component: FundCategories },
  { id: "5", label: "Fund Sub Categories",component: FundSubCategories },
];

const FundSources = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title="Fund Sources"
          crumbs={[
            { title: "FMS", url: "/fms/dashboard" },
            { title: "Settings", url: "/fms/settings/" },
          ]}
        />
        <Row>
          <Col xl={12}>
            <Card style={isMobile ? {} : { minHeight: "74vh" }}>
              <div className="card-body">
                <Nav pills className="nav-pills arrow-navtabs nav-success bg-light mb-3">
                  {TABS.map(({ id, label }) => (
                    <NavItem key={id}>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({ active: activeTab === id })}
                        onClick={() => setActiveTab(id)}>
                        {label}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>

                <TabContent activeTab={activeTab}>
                  {TABS.map(({ id, component: Component }) => (
                    <TabPane key={id} tabId={id}>
                      {activeTab === id && <Component />}
                    </TabPane>
                  ))}
                </TabContent>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FundSources;