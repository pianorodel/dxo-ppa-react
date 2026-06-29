import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row } from "reactstrap";

const Pagination = ({ totalRecords, currentPage, setCurrentPage, perPageData }) => {
    const totalPages = Math.ceil(totalRecords / perPageData);

    const handleClick = (page) => {
        setCurrentPage(page);
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

    useEffect(() => {
        if (totalPages && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage, setCurrentPage]);

    const getPageNumbers = () => {
        const pages = [];

        pages.push(1);

        if (totalPages > 1) {
            if (currentPage <= 3) {
                for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                    pages.push(i);
                }
                if (totalPages > 4) {
                    pages.push("...");
                }
            } else if (currentPage > 3 && currentPage < totalPages - 2) {
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
            } else {
                pages.push("...");
                for (let i = totalPages - 2; i < totalPages; i++) {
                    pages.push(i);
                }
            }

            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <Row className="g-0 justify-content-end mb-4">
            <div className="col-sm-auto">
                <ul className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
                    <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                        <Link to="#!" className="page-link" onClick={handlePrevPage}>
                            Previous
                        </Link>
                    </li>

                    {pageNumbers.map((item, index) => (
                        <li key={index} className={`page-item ${item === "..." ? "disabled" : ""}`}>
                            {item === "..." ? (
                                <span className="page-link">...</span>
                            ) : (
                                <Link
                                    to="#!"
                                    className={`page-link ${currentPage === item ? "active" : ""}`}
                                    onClick={() => handleClick(item)}
                                >
                                    {item}
                                </Link>
                            )}
                        </li>
                    ))}

                    <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                        <Link to="#!" className="page-link" onClick={handleNextPage}>
                            Next
                        </Link>
                    </li>
                </ul>
            </div>
        </Row>
    );
};

export default Pagination;
