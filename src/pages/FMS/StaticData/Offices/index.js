import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";

import BreadCrumb from "@/components/Common/BreadCrumb";
import TabbedStaticResourcePageTreeView from "@/components/Common/TabbedStaticResourcePageTreeView";
import TreeView from "@/components/Common/TreeView";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getOfficesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteOfficesMutation,
  useExportOfficesMutation,
  useGetOfficesQuery,
  useListTreeOfficesQuery,
} from "@/api/Endpoints/Master/StaticData/Offices";

const Offices = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedTreeId, setselectedTreeId] = useState(null);
  const [listName, setListName] = useState("All Responsibility Centers");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const { data: treeDataRaw } = useListTreeOfficesQuery({ keyword: debouncedKeyword }, { refetchOnMountOrArgChange: true });

  const treeData = useMemo(() => {
    const transformTreeItems = (items = []) =>
      items.map((item) => ({
        ...item,
        id: item.officeId,
        label: item.officeName,
        children: transformTreeItems(item.children ?? []),
      }));
    return treeDataRaw?.returnData
      ? [
        {
          id: 0,
          label: "All Responsibility Centers",
          officeName: "All Responsibility Centers",
          children: transformTreeItems(treeDataRaw.returnData),
        },
      ]
      : [];
  }, [treeDataRaw]);

  const handleClickItem = (item, itemObj) => {
    setselectedTreeId(item);
    setListName(itemObj.officeName);
  };

  return (
    <div className={"page-content"}>
      <Container fluid>
        <BreadCrumb
          title={"Responsibility Centers"}
          crumbs={[
            { title: "FMS", url: "/fms/dashboard" },
            { title: "Settings", url: "/fms/settings" },
          ]}
        />
        <Card>
          <CardBody>
            <TabbedStaticResourcePageTreeView
              title={"Responsibility Centers"}
              moduleName={"Responsibility Center"}
              listName={listName}
              useGetQuery={useGetOfficesQuery}
              useDeleteMutation={useDeleteOfficesMutation}
              useExportMutation={useExportOfficesMutation}
              getColumns={getOfficesColumns}
              columnKey="officeId"
              codeField="officeName"
              SaveModalComponent={SaveModal}
              selectedTreeId={selectedTreeId}
              TreeViewComponent={
                <div>
                  <Row className="mt-10">
                    <Col sm={12}>
                      <div className="search-box me-2 mb-2 d-inline-block w-100">
                        <Input
                          className="form-control bg-light border-light"
                          placeholder="Search here..."
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                        <i className="bx bx-search-alt search-icon"></i>
                      </div>
                    </Col>
                  </Row>
                  <TreeView items={treeData} onItemClick={handleClickItem} expansionTrigger="iconContainer" />
                </div>
              }
              accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_RESPONSIBILITYCENTERS}
              logType={FMS_LOG_TYPES.FMS_STATICDATA_RESPONSIBILITYCENTERS}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Offices;
