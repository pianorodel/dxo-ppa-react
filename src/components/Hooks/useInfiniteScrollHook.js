import { useState, useCallback } from "react";

const useInfiniteScroll = () => {
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        keyword: "",
        pageSize: 10,
    });

    const [searchTerm, setSearchTerm] = useState("");

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            const keyword = searchTerm.trim();
            if (keyword !== pageDetails.keyword) {
                setPageDetails({
                    page: 1,
                    keyword,
                    pageSize: pageDetails.pageSize,
                });
            }
        }
    }, [searchTerm, pageDetails]);

    const fetchNext = useCallback((hasMore, isFetching) => {
        if (hasMore && !isFetching) {
            setPageDetails((prev) => ({
                ...prev,
                page: prev.page + 1,
            }));
        }
    }, []);

    return {
        pageDetails,
        setPageDetails,
        searchTerm,
        setSearchTerm,
        handleKeyDown,
        fetchNext,
    };
};

export default useInfiniteScroll;
