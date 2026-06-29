import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "reactstrap";
import SimpleBar from "simplebar-react";

import UserDetails from "@/pages/Security/UserDetails";

import { AvatarIcon } from "./AvatarIcon";

import { useAppSearchMutation } from "@/api/Endpoints/Core/App/Search";

const SearchOption = ({ onClickUserDetails = () => {} }) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState({});
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userDetailsState, setUserDetailsState] = useState({
    show: false,
    userId: null,
  });
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const hasData = !!data?.recentSearches?.length || !!data?.pages?.length || !!data?.users?.length;

  const [searchData] = useAppSearchMutation();

  const debouncedSearch = useRef(
    _.debounce(async (val) => {
      const response = await searchData({ keyword: val }).unwrap();
      if (response?.success) {
        setData(response.returnData);
      }
      setDropdownVisible(val.length > 0);
    }, 500),
  );

  useEffect(() => {
    if (value) {
      debouncedSearch.current(value);
    } else {
      setData({});
      setDropdownVisible(false);
    }
  }, [value]);

  const handleInputChange = async (e, fromClick) => {
    const val = fromClick ? e : e.target.value;
    setValue(val);
  };

  const handleClearSearch = () => {
    setValue("");
    setDropdownVisible(false);
    inputRef.current?.focus();
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target) && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClickMember = (e, userId) => {
    e.preventDefault();
    if (userId !== null && userId !== 0) {
      onClickUserDetails(true, userId);
    }
  };

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.style.setProperty("top", "100%", "important");
    }
  }, [isDropdownVisible]);

  return (
    <>
      <form className="app-search px-3">
        <div className="position-relative">
          <Input
            type="text"
            className="form-control bg-light border-light"
            placeholder="Search..."
            value={value}
            onChange={handleInputChange}
            onFocus={() => setDropdownVisible(value.length > 0)}
            innerRef={inputRef}
          />
          <span className="mdi mdi-magnify search-widget-icon"></span>
          {!!value && (
            <span
              className="mdi mdi-close-circle search-widget-icon search-widget-icon-close"
              onClick={handleClearSearch}
              role="button"
              aria-label="Clear search"></span>
          )}
        </div>

        {!!isDropdownVisible && !!hasData && (
          <div
            className="dropdown-menu dropdown-menu-lg show p-3 shadow-sm rounded border"
            ref={dropdownRef}
            style={{
              maxHeight: "80vh",
              overflow: "auto",
              position: "absolute",
              left: 0,
              zIndex: 1050,
            }}>
            <SimpleBar style={{ maxHeight: "100%" }}>
              {!!data?.recentSearches?.length && (
                <>
                  <div className="dropdown-header">
                    <h6 className="text-overflow text-muted mb-0 text-uppercase">Recent Searches</h6>
                  </div>
                  <div className="dropdown-item bg-transparent text-wrap">
                    {data.recentSearches.map((search, idx) => (
                      <Link
                        key={idx}
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          handleInputChange(search.keyword, true);
                        }}
                        className="btn btn-soft-secondary btn-sm rounded-pill mb-1 me-1">
                        {search.keyword} <i className="mdi mdi-magnify ms-1"></i>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {!!data?.pages?.length && (
                <>
                  {Object.entries(
                    data.pages.reduce((acc, page) => {
                      const system = page.system || "Other";
                      if (!acc[system]) acc[system] = [];
                      acc[system].push(page);
                      return acc;
                    }, {}),
                  ).map(([system, pages]) => (
                    <div key={system}>
                      <div className="dropdown-header">
                        <h6 className="text-overflow text-success mb-0 text-uppercase">{system}</h6>
                      </div>
                      {pages.map((page, idx) => (
                        <Link key={`${system}-${idx}`} to={page.url} onClick={() => setDropdownVisible(false)} className="dropdown-item notify-item">
                          <i className={`${page.icon} align-middle fs-18 text-muted me-2`}></i>
                          <span>{page.title}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {!!data?.users?.length && (
                <>
                  <div className="dropdown-header mt-2">
                    <h6 className="text-overflow mb-2 text-success text-uppercase">Users</h6>
                  </div>
                  <div className="notification-list">
                    {data.users.map((user, idx) => (
                      <Link key={idx} to="#" onClick={(e) => handleClickMember(e, user.userId)} className="dropdown-item notify-item py-2">
                        <div className="d-flex align-items-center">
                          <AvatarIcon name={user.fullName} avatarImg={user.avatar} width="32px" height="32px" />
                          <div className="flex-grow-1 ms-2">
                            <h6 className="m-0">{user.fullName}</h6>
                            <span className="fs-11 mb-0 text-muted">{user.position}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </SimpleBar>

            <div className="text-center pt-3 pb-1">
              {/* Optional: View All Results button */}
              {/* <Link to="/pages-search-results" className="btn btn-primary btn-sm">
      View All Results <i className="ri-arrow-right-line ms-1"></i>
    </Link> */}
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default SearchOption;
