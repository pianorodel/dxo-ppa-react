import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row } from "reactstrap";

const Pagination = ({ totalRecords, currentPage, setCurrentPage, perPageData, isMobile }) => {
  const totalPages = Math.ceil(totalRecords / perPageData);

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  useEffect(() => {
    if (totalPages && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  if (totalRecords === 0 || totalPages <= 1) return null;

  return (
    <Row className="g-0 justify-content-start align-items-center mb-4">
      <div className="col-sm-auto">
        <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
          {!isMobile && (
            <li className={currentPage > 1 ? "page-item" : "page-item disabled"}>
              <Link
                to="#"
                className="page-link bg-info-subtle"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage !== 1) handleFirstPage();
                }}
              >
                First
              </Link>
            </li>
          )}

          <li className={currentPage > 1 ? "page-item" : "page-item disabled"}>
            <Link
              to="#"
              className="page-link bg-info-subtle"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePrevPage();
              }}
            >
              Previous
            </Link>
          </li>

          <li className="page-item">
            <div className="text-muted mt-2">
              &nbsp;Page <span className="fw-semibold ms-1">{currentPage}</span> of{" "}
              <span className="fw-semibold">{totalPages}</span>
            </div>
          </li>

          <li className={currentPage < totalPages ? "page-item" : "page-item disabled"}>
            <Link
              to="#"
              className="page-link bg-success-subtle"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handleNextPage();
              }}
            >
              Next
            </Link>
          </li>

          {!isMobile && (
            <li className={currentPage < totalPages ? "page-item" : "page-item disabled"}>
              <Link
                to="#"
                className="page-link bg-success-subtle"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handleLastPage();
                }}
              >
                Last
              </Link>
            </li>
          )}
        </ul>
      </div>
    </Row>
  );
};

export default Pagination;
