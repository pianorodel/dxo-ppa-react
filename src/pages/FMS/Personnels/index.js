import React, { useMemo, useState } from "react";

import {
  Button,
  Card, CardBody, Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input, Row,
  UncontrolledDropdown
} from "reactstrap";

import BreadCrumb from "@/components/Common/BreadCrumb";
import Pagination from "@/components/Common/Pagination";

import Avatar1 from "@/assets/images/users/avatar-1.jpg";
import Avatar10 from "@/assets/images/users/avatar-10.jpg";
import Avatar2 from "@/assets/images/users/avatar-2.jpg";
import Avatar4 from "@/assets/images/users/avatar-4.jpg";
import Avatar5 from "@/assets/images/users/avatar-5.jpg";
import Avatar6 from "@/assets/images/users/avatar-6.jpg";
import Avatar7 from "@/assets/images/users/avatar-7.jpg";
import Avatar8 from "@/assets/images/users/avatar-8.jpg";
import Avatar9 from "@/assets/images/users/avatar-9.jpg";
import TableContainer from "@/components/Common/TableContainer";

const jobCandidates = [
  {
    id: 1,
    userImg: Avatar10,
    candidateName: "Tonya Noble",
    designation: "Web Designer",
    location: "Manila",
    type: "CHESS",
    rating: ["4.2", "2.2k Ratings"],
    bookmark: true,
  },
  {
    id: 2,
    userImg: Avatar1,
    candidateName: "Nicholas Ball",
    designation: "Assistant / Store Keeper",
    location: "Mandaluyong",
    type: "BOWLING",
    rating: ["4.1", "1.72k Ratings"],
    bookmark: true,
  },
  {
    id: 3,

    nickname: "ZM",
    candidateName: "Zynthia Marrow",
    designation: "Assistant / Store Keeper",
    location: "Manila",
    type: "BADMINTON",
    rating: ["4.0", "42.5k Ratings"],
    bookmark: false,
  },
  {
    id: 4,
    userImg: Avatar2,
    candidateName: "Philippa Santiago",
    designation: "Project Manager ",
    location: "Manila",
    type: "CHESS",
    rating: ["4.3", "15k Ratings"],
    bookmark: true,
  },
  {
    id: 5,
    userImg: Avatar4,
    candidateName: "Elizabeth Allen",
    designation: "Education Training ",
    location: "Manila",
    type: "BADMINTON",
    rating: ["3.5", "7.3k Ratings"],
    bookmark: false,
  },
  {
    id: 6,
    userImg: Avatar5,
    candidateName: "Cassian Jenning",
    designation: "Graphic Designer ",
    location: "Manila",
    type: "CHESS",
    rating: ["4.3", "13.2k Ratings"],
    bookmark: false,
  },
  {
    id: 7,
    userImg: Avatar6,
    candidateName: "Scott Holt",
    designation: "UI/UX Designer ",
    location: "Manila",
    type: "CHESS",
    rating: ["3.5", "7.3k Ratings"],
    bookmark: false,
  },
  {
    id: 8,

    nickname: "PS",
    candidateName: "Philbert Schwartz",
    designation: "React Developer ",
    location: "Manila",
    type: "BOWLING",
    rating: ["4.1", "1.74k Ratings"],
    bookmark: true,
  },
  {
    id: 9,

    nickname: "LV",
    candidateName: "Larry Villa",
    designation: "Assistant / Store Keeper",
    location: "Mandaluyong",
    type: "BOWLING",
    rating: ["4.0", "1.72k Ratings"],
    bookmark: false,
  },
  {
    id: 10,
    userImg: Avatar10,
    candidateName: "Harley Watkins",
    designation: "Project Manager ",
    location: "Manila",
    type: "BOWLING",
    rating: ["4.2", "3.21k Ratings"],
    bookmark: false,
  },
  {
    id: 11,
    userImg: Avatar2,
    candidateName: "Marie Stewart",
    designation: "Web Designer",
    location: "Manila",
    type: "CHESS",
    rating: ["4.2", "2.2k Ratings"],
    bookmark: true,
  },
  {
    id: 12,
    userImg: Avatar9,
    candidateName: "Hadley Leonard",
    designation: "Executive, HR Operations ",
    location: "Manila",
    type: "BOWLING",
    rating: ["4.0", "3.2k Ratings"],
    bookmark: false,
  },
  {
    id: 13,
    userImg: Avatar6,
    candidateName: "Zoderick Rodriquez",
    designation: "Full Stack Developer",
    location: "Muhtarqah, UAE",
    type: "BADMINTON",
    rating: ["3.9", "98.65k Ratings"],
    bookmark: false,
  },
  {
    id: 14,
    userImg: Avatar7,
    candidateName: "Nadia Harding",
    designation: "Web Designer",
    location: "Manila",
    type: "BADMINTON",
    rating: ["4.3", "2.93k Ratings"],
    bookmark: true,
  },
  {
    id: 15,
    userImg: Avatar4,
    candidateName: "Addison Black",
    designation: "UI/UX Designer",
    location: "Manila",
    type: "CHESS",
    rating: ["3.8", "10.32k Ratings"],
    bookmark: false,
  },
  {
    id: 16,

    nickname: "JW",
    candidateName: "Jems Wise",
    designation: "Executive, HR Operations",
    location: "Manila",
    type: "BOWLING",
    rating: ["4.0", "7.63k Ratings"],
    bookmark: false,
  },
  {
    id: 17,
    userImg: Avatar8,
    candidateName: "Lizzie Chandler",
    designation: "React Developer",
    location: "Maidaq, UAE",
    type: "CHESS",
    rating: ["3.9", "1.35k Ratings"],
    bookmark: false,
  },
  {
    id: 18,
    nickname: "JW",
    candidateName: "Jenson Watson",
    designation: "Graphic Designer",
    location: "Quesada, US",
    type: "BADMINTON",
    rating: ["4.2", "3.16k Ratings"],
    bookmark: false,
  },
  {
    id: 19,
    userImg: Avatar1,
    candidateName: "Jaylee Ward",
    designation: "Education Training",
    location: "Manila",
    type: "BOWLING",
    rating: ["4.0", "3.21k Ratings"],
    bookmark: true,
  },
  {
    id: 20,
    userImg: Avatar2,
    candidateName: "Trista Guerrero",
    designation: "Product Director",
    location: "Jereirah, UAE",
    type: "BOWLING",
    rating: ["4.1", "4.31k Ratings"],
    bookmark: false,
  },
  {
    id: 21,

    nickname: "JM",
    candidateName: "James Mike",
    designation: "Graphic Designer",
    location: "Quesada, US",
    type: "BADMINTON",
    rating: ["4.2", "3.16k Ratings"],
    bookmark: false,
  },
  {
    id: 22,

    nickname: "MJ",
    candidateName: "Mike Jems",
    designation: "Product Director",
    location: "Jereirah, UAE",
    type: "BOWLING",
    rating: ["4.1", "4.31k Ratings"],
    bookmark: false,
  },
  {
    id: 23,
    userImg: Avatar4,
    candidateName: "Mary Sak",
    designation: "Education Training",
    location: "Manila",
    type: "BOWLING",
    rating: ["4.0", "3.21k Ratings"],
    bookmark: true,
  },
  {
    id: 24,
    userImg: Avatar8,
    candidateName: "Roderick Jones",
    designation: "React Developer",
    location: "Maidaq, UAE",
    type: "CHESS",
    rating: ["3.9", "1.35k Ratings"],
    bookmark: false,
  },
];

const DesktopView = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gridColumn, setGridColumn] = useState(false)

  //pagination
  const perPageData = 20;
  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;

  const filteredJobCandidates = jobCandidates.filter(item => {
    const term = searchTerm?.toLowerCase() || "";
    if (!term) return true;
    return (
      item?.candidateName?.toLowerCase().includes(term)
    );
  });

  const currentdata = useMemo(() => filteredJobCandidates?.slice(indexOfFirst, indexOfLast), [indexOfFirst, indexOfLast])

  const columns = useMemo(() => [
    {
      header: "Avatar",
      accessorKey: "nickname",
      enableColumnFilter: false,
      size: 80,
      cell: ({ row }) => {
        const item = row.original;
        return item.nickname ? (
          <div className="avatar-sm rounded">
            <div className="avatar-title border bg-light text-primary rounded text-uppercase fs-14">
              {item.nickname}
            </div>
          </div>
        ) : (
          <img
            src={item.userImg}
            alt={item.candidateName}
            className="avatar-sm rounded"
            style={{ height: "40px", width: "40px" }}
          />
        );
      }
    },
    {
      header: "Name",
      accessorKey: "candidateName",
      enableColumnFilter: false,
      size: 200,
    },
    {
      header: "Designation",
      accessorKey: "designation",
      enableColumnFilter: false,
      size: 200,
    },
    {
      header: "Location",
      accessorKey: "location",
      enableColumnFilter: false,
      size: 150,
    },
    {
      header: "Type",
      accessorKey: "type",
      enableColumnFilter: false,
      size: 120,
      cell: ({ row }) => {
        const { type } = row.original;
        return type === "CHESS" ? (
          <span className="badge bg-danger-subtle text-danger">{type}</span>
        ) : type === "BOWLING" ? (
          <span className="badge bg-success-subtle text-success">{type}</span>
        ) : (
          <span className="badge bg-info-subtle text-info">{type}</span>
        );
      },
    },
    {
      header: "Rating",
      accessorKey: "rating",
      enableColumnFilter: false,
      size: 120,
      cell: ({ row }) => {
        const [score, count] = row.original.rating || [];
        return (
          <span>
            ⭐ {score} ({count})
          </span>
        );
      }
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <UncontrolledDropdown>
            <DropdownToggle
              href="#"
              className="btn btn-soft-secondary btn-sm"
              tag="button"
            >
              <i className="ri-more-fill" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem href="#">
                <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                View
              </DropdownItem>
              <DropdownItem href="#">
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                Edit
              </DropdownItem>
              <DropdownItem divider />

              <DropdownItem>
                <i className="ri-printer-fill align-bottom me-2 text-muted"></i>{" "}
                Print
              </DropdownItem>
              <DropdownItem divider />

              <DropdownItem href="#">
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      }
    }
  ], []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <BreadCrumb title="Personnel Masterlist"
            crumbs={[
              { title: "FMS", url: "/fms/dashboard" },
            ]} />

          <Card>
            <CardBody>
              <Row className="g-2">
                <Col sm={4}>
                  <div className="search-box">
                    <Input type="text" className="form-control bg-light border-light" placeholder="Search for officer here..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <Col className="col-sm-auto ms-auto">
                  <div className="list-grid-nav hstack gap-1">

                    <Button color="info" id="grid-view-button" className={`btn btn-soft-info nav-link btn-icon fs-13 ${gridColumn ? ' ' : 'active'}  filter-button`} onClick={() => setGridColumn(false)}><i className="ri-grid-fill"></i></Button>
                    <Button color="info" id="list-view-button" className={`btn btn-soft-info nav-link ${gridColumn ? ' active' : ''}   btn-icon fs-13 filter-button`} onClick={() => setGridColumn(true)} ><i className="ri-list-unordered"></i></Button>
                    <Button color="success">
                      <i className="ri-add-fill me-1 align-bottom"></i> Add Personnel</Button>
                    {" "}
                    <button type="button" className="btn btn-info" onClick={() => setIsExportExcel(true)}>
                      <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                      Export
                    </button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {gridColumn ?
            <div>
              <Card >
                <div className="card-body ">
                  <TableContainer
                    columns={columns}
                    data={(filteredJobCandidates || [])}
                    currentPage={1}
                    pageSize={10}
                    divClass="table-responsive mb-1"
                    tableClass="mb-0 align-top table-borderless"
                    theadClass="table-light"
                    totalRecords={6}
                  />
                </div>
              </Card>
            </div>
            :
            <Row className="gy-2 mb-2" id="candidate-list">
              {(filteredJobCandidates || []).map((item, key) => (
                <Col xxl={3} md={6} key={key}>
                  <Card>
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          {item.nickname ? (
                            <div className="avatar-lg rounded">
                              <div className="avatar-title border bg-light text-primary rounded text-uppercase fs-24">
                                {item.nickname}
                              </div>
                            </div>
                          ) : (
                            <div className="avatar-lg rounded">
                              <img
                                src={item.userImg}
                                alt=""
                                className="member-img img-fluid d-block rounded"
                                style={{ "height": "96px", "width": "96px" }}
                              ></img>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <a href="/pages-profile">
                            <h5 className="fs-16 mb-1">{item.candidateName}</h5>
                          </a>
                          <div className="d-flex gap-4 mt-2 text-muted">
                            {/* <div>
                                                        <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                                                        {item.location}
                                                    </div> */}
                            <div>
                              <i className="ri-time-line text-primary me-1 align-bottom"></i>
                              {item.type === "CHESS" ?
                                <span className="badge bg-danger-subtle text-danger">{item.type}</span>
                                :
                                item.type === "BOWLING" ?
                                  <span className="badge bg-success-subtle text-success">{item.type}</span>
                                  :
                                  <span className="badge bg-info-subtle text-info">{item.type}</span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          }

          <Pagination
            className="g-0 justify-content-end mb-4"
            perPageData={perPageData}
            data={filteredJobCandidates}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

        </Container>
      </div>
    </React.Fragment>
  );
};

export default DesktopView;
