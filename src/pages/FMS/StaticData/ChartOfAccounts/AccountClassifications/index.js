import { useEffect, useMemo, useState } from "react";
import { Col, Input, Row } from "reactstrap";

import TabbedStaticResourcePageTreeView from "@/components/Common/TabbedStaticResourcePageTreeView";
import TreeView from "@/components/Common/TreeView";
import { FMS_ACCESS_RIGHTS } from "@/constants/AccessRights";
import { FMS_LOG_TYPES } from "@/constants/LogTypes";

import { getAccountClassificationsColumns } from "./Components/Columns";
import SaveModal from "./Components/SaveModal";

import {
  useDeleteAccountClassificationsMutation,
  useExportAccountClassificationsMutation,
  useGetAccountClassificationsQuery,
  useListTreeAccountClassificationsQuery,
} from "@/api/Endpoints/FMS/StaticData/AccountClassifications";

const AccountClassifications = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedTreeId, setselectedTreeId] = useState(null);
  const [listName, setListName] = useState("All Account Classifications");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const { data: treeDataRaw } = useListTreeAccountClassificationsQuery({ keyword: debouncedKeyword }, { refetchOnMountOrArgChange: true });

  const treeData = useMemo(() => {
    const transformTreeItems = (items = []) =>
      items.map((item) => ({
        ...item,
        id: item.accountClassificationId,
        label: item.accountClassificationName,
        children: transformTreeItems(item.children ?? []),
      }));
    return treeDataRaw?.returnData
      ? [
          {
            id: 0,
            label: "All Account Classifications",
            accountClassificationName: "All Account Classifications",
            children: transformTreeItems(treeDataRaw.returnData),
          },
        ]
      : [];
  }, [treeDataRaw]);

  const handleClickItem = (item, itemObj) => {
    setselectedTreeId(item);
    setListName(itemObj.accountClassificationName);
  };

  return (
    <TabbedStaticResourcePageTreeView
      title={"Account Classifications"}
      moduleName={"Account Classification"}
      listName={listName}
      useGetQuery={useGetAccountClassificationsQuery}
      useDeleteMutation={useDeleteAccountClassificationsMutation}
      useExportMutation={useExportAccountClassificationsMutation}
      getColumns={getAccountClassificationsColumns}
      columnKey="accountClassificationId"
      codeField="accountClassificationName"
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
      logType={FMS_LOG_TYPES.FMS_STATICDATA_ACCOUNTCLASSIFICATIONS}
      accessRights={FMS_ACCESS_RIGHTS.FMS_STATICDATA_ACCOUNTCLASSIFICATIONS}
    />
  );
};

export default AccountClassifications;
