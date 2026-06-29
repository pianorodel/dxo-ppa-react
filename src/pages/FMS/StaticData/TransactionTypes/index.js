import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";

import BreadCrumb from "@/components/Common/BreadCrumb";
import TabbedStaticResourcePageTreeView from "@/components/Common/TabbedStaticResourcePageTreeView";
import TreeView from "@/components/Common/TreeView";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getTransactionTypesColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteTransactionTypesMutation,
  useExportTransactionTypesMutation,
  useGetTransactionTypesQuery,
  useListTreeTransactionTypesQuery,
} from "@/api/Endpoints/FMS/StaticData/TransactionTypes";

const TransactionTypes = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedTreeId, setselectedTreeId] = useState(null);
  const [listName, setListName] = useState("All Transaction Types");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const { data: treeDataRaw } = useListTreeTransactionTypesQuery({ keyword: debouncedKeyword }, { refetchOnMountOrArgChange: true });

  const treeData = useMemo(() => {
    const transformTreeItems = (items = []) =>
      items.map((item) => ({
        ...item,
        id: item.transactionTypeId,
        label: item.transactionTypeName,
        children: transformTreeItems(item.children ?? []),
      }));
    return treeDataRaw?.returnData
      ? [
        {
          id: 0,
          label: "All Transaction Types",
          transactionTypeName: "All Transaction Types",
          children: transformTreeItems(treeDataRaw.returnData),
        },
      ]
      : [];
  }, [treeDataRaw]);

  const handleClickItem = (item, itemObj) => {
    setselectedTreeId(item);
    setListName(itemObj.transactionTypeName);
  };

  return (
    <div className={"page-content"}>
      <Container fluid>
        <BreadCrumb
          title={"Transaction Types"}
          crumbs={[
            { title: "FMS", url: "/fms/dashboard" },
            { title: "Settings", url: "/fms/settings" },
          ]}
        />
        <Card>
          <CardBody>
            <TabbedStaticResourcePageTreeView
              // logType={FMS_LOG_TYPES.FMS_SETTINGS_TRANSACTION_TYPES}
              title={"Transaction Types"}
              moduleName={"Transaction Type"}
              listName={listName}
              useGetQuery={useGetTransactionTypesQuery}
              useDeleteMutation={useDeleteTransactionTypesMutation}
              useExportMutation={useExportTransactionTypesMutation}
              getColumns={getTransactionTypesColumns}
              columnKey="transactionTypeId"
              codeField="transactionTypeName"
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
              accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_TRANSACTIONTYPES}
              logType={FMS_LOG_TYPES.FMS_STATICDATA_TRANSACTIONTYPES}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default TransactionTypes;
