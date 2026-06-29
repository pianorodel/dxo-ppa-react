import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { createSelector } from "reselect";

import FullScreenDropdown from "@/components/Common/FullScreenDropdown";
import LightDark from "@/components/Common/LightDark";
import NotificationDropdown from "@/components/Common/NotificationDropdown";

import ProfileDropdown from "@/components/Common/ProfileDropdown";
import SearchOption from "@/components/Common/SearchOption";
import UserDetails from "@/pages/Security/UserDetails";

import { changeSidebarVisibility } from "../slices/thunks";

const logoLight = require(`@/${process.env.REACT_APP_CUSTOMER_SIDEBAR_LOGO_LIGHT}`);
const logoDark = require(`@/${process.env.REACT_APP_CUSTOMER_SIDEBAR_LOGO_DARK}`);
const logoSm = require(`@/${process.env.REACT_APP_CUSTOMER_SIDEBAR_LOGO_SMALL}`);

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userId, setUserId] = useState(0);
  const currentUser = sessionStorage.getItem("currentUser");
  const userData = currentUser ? JSON.parse(currentUser) : {};
  const selectDashboardData = createSelector(
    (state) => state.Layout,
    (state) => ({
      sidebarVisibilitytype: state.sidebarVisibilitytype,
    }),
  );
  // Inside your component
  const { sidebarVisibilitytype } = useSelector(selectDashboardData);

  const [search, setSearch] = useState(false);
  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility("show"));

    if (windowSize > 767) document.querySelector(".hamburger-icon").classList.toggle("open");

    //For collapse horizontal menu
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
    }

    //For collapse vertical and semibox menu
    if (
      sidebarVisibilitytype === "show" &&
      (document.documentElement.getAttribute("data-layout") === "vertical" || document.documentElement.getAttribute("data-layout") === "semibox")
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.contains("twocolumn-panel")
        ? document.body.classList.remove("twocolumn-panel")
        : document.body.classList.add("twocolumn-panel");
    }
  };

  const handleViewUserDetails = (toggle, userId) => {
    setShowUserDetails(toggle);
    if (!toggle) return setUserId(0);

    setUserId(userId);
  };

  return (
    <React.Fragment>
      {/* <ToastContainer /> */}
      {showUserDetails && <UserDetails userId={userId || userData?.userId} show={showUserDetails} onCloseClick={() => handleViewUserDetails(false)} />}

      <header id="page-topbar" className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box horizontal-logo">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="17" />
                  </span>
                </Link>
              </div>

              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon">
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>

              <div className="d-none d-md-block">
                <SearchOption onClickUserDetails={handleViewUserDetails} />
              </div>
            </div>

            <div className="d-flex align-items-center">

              <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                  <i className="bx bx-search fs-22"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                  <SearchOption />
                </DropdownMenu>
              </Dropdown>

              {/* FullScreenDropdown */}
              <FullScreenDropdown />

              {/* Dark/Light Mode set */}
              <LightDark layoutMode={layoutModeType} onChangeLayoutMode={onChangeLayoutMode} />

              {/* NotificationDropdown */}
              <NotificationDropdown />

              {/* ProfileDropdown */}
              <ProfileDropdown onClickUserDetails={handleViewUserDetails} />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
