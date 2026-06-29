import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";

import BreadCrumb from "@/components/Common/BreadCrumb";
import TabbedStaticResourcePageTreeView from "@/components/Common/TabbedStaticResourcePageTreeView";
import TreeView from "@/components/Common/TreeView";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getProgramsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteFMSProgramsMutation,
  useExportFMSProgramsMutation,
  useGetFMSProgramsQuery,
  useListTreeFMSProgramsQuery,
} from "@/api/Endpoints/FMS/StaticData/Programs";

const Programs = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedTreeId, setselectedTreeId] = useState(null);
  const [listName, setListName] = useState("All Programs/Projects");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const { data: treeDataRaw } = useListTreeFMSProgramsQuery({ keyword: debouncedKeyword }, { refetchOnMountOrArgChange: true });

  const treeData = useMemo(() => {
    const transformTreeItems = (items = []) =>
      items.map((item) => ({
        ...item,
        id: item.programId,
        label: item.programName,
        children: transformTreeItems(item.children ?? []),
      }));
    return treeDataRaw?.returnData
      ? [
        {
          id: 0,
          label: "All Programs/Projects",
          programName: "All Programs/Projects",
          children: transformTreeItems(treeDataRaw.returnData),
        },
      ]
      : [];
  }, [treeDataRaw]);

  const handleClickItem = (item, itemObj) => {
    setselectedTreeId(item);
    setListName(itemObj.programName);
  };

  return (
    <div className={"page-content"}>
      <Container fluid>
        <BreadCrumb
          title={"Programs/Projects"}
          crumbs={[
            { title: "FMS", url: "/fms/dashboard" },
            { title: "Settings", url: "/fms/settings" },
          ]}
        />
        <Card>
          <CardBody>
            <TabbedStaticResourcePageTreeView
              title={"Programs/Projects"}
              moduleName={"Program/Project"}
              listName={listName}
              useGetQuery={useGetFMSProgramsQuery}
              useDeleteMutation={useDeleteFMSProgramsMutation}
              useExportMutation={useExportFMSProgramsMutation}
              getColumns={getProgramsColumns}
              columnKey="programId"
              codeField="programName"
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
              logType={FMS_LOG_TYPES.FMS_STATICDATA_PROGRAMS}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Programs;
