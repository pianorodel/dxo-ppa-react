import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Offcanvas, OffcanvasBody, OffcanvasHeader, Spinner } from "reactstrap";
import { createSelector } from "reselect";
import SimpleBar from "simplebar-react";

import SwitchButton from "./SwitchButton";
import withRouter from "./withRouter";

import { useListFavoritesUserPagesQuery } from "@/api/Endpoints/Core/App/UserPages";

// ============================================================================
// Selectors (outside component to prevent recreation)
// ============================================================================
const selectLayoutState = (state) => state.Layout;
const selectLayoutProperties = createSelector(selectLayoutState, (layout) => ({
  layoutType: layout.layoutType,
  leftSidebarType: layout.leftSidebarType,
  layoutModeType: layout.layoutModeType,
  layoutWidthType: layout.layoutWidthType,
  layoutPositionType: layout.layoutPositionType,
  topbarThemeType: layout.topbarThemeType,
  leftsidbarSizeType: layout.leftsidbarSizeType,
  leftSidebarViewType: layout.leftSidebarViewType,
  leftSidebarImageType: layout.leftSidebarImageType,
  preloader: layout.preloader,
  sidebarVisibilitytype: layout.sidebarVisibilitytype,
}));

// ============================================================================
// Back to Top Button Component
// ============================================================================
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-danger btn-icon"
      id="back-to-top"
      aria-label="Scroll back to top"
      style={{
        position: "fixed",
        bottom: "45px",
        right: "80px",
        zIndex: 9999,
        display: isVisible ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        width: "37px",
        height: "37px",
      }}>
      <i className="ri-arrow-up-line"></i>
    </button>
  );
};

// ============================================================================
// Settings Toggle Button Component
// ============================================================================
const SettingsToggleButton = ({ onClick }) => (
  <div className="customizer-setting d-none d-md-block">
    <div
      onClick={onClick}
      className="btn-info rounded-pill shadow-lg btn btn-icon btn-lg p-2 rounded-pill"
      role="button"
      tabIndex="0"
      aria-label="Toggle application settings"
      style={{ cursor: "pointer" }}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}>
      <i className="mdi mdi-spin mdi-cog-outline fs-22"></i>
    </div>
  </div>
);

// ============================================================================
// Favorites List Component
// ============================================================================
const FavoritesList = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner size="sm" color="primary" />
        <span className="ms-2">Loading favorites...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted mb-0">
          <i className="ri-bookmark-line fs-20 d-block mb-2"></i>
          No favorite modules yet
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0 fw-semibold text-uppercase">Quick Links</h6>
          <p className="text-muted small mb-0">Frequently Visited Modules</p>
        </div>
        <Badge color="primary">{data.length}</Badge>
      </div>

      <div className="d-flex flex-column gap-3">
        {data.map((item, index) => (
          <FavoritesListItem key={`${item.id || index}-${item.url}`} item={item} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Individual Favorites List Item
// ============================================================================
const FavoritesListItem = ({ item }) => {
  const listItemStyle = `
        .favorites-item {
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .favorites-item:hover {
            background-color: rgba(0, 123, 255, 0.08) !important;
            border-color: #007bff !important;
            box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .favorites-item:hover {
                background-color: rgba(0, 123, 255, 0.12) !important;
                border-color: #0d6efd !important;
                box-shadow: 0 2px 8px rgba(13, 110, 253, 0.25);
            }
        }
    `;

  return (
    <>
      <style>{listItemStyle}</style>
      <Link to={item?.url} className="text-decoration-none" role="listitem">
        <div className="d-flex align-items-center p-2 rounded border border-light favorites-item">
          <div className="me-3">
            <i className={`${item?.icon || "ri-layout-grid-fill"} text-success fs-18`}></i>
          </div>
          <div className="flex-grow-1">
            <div className="fs-13 fw-500">{item?.title}</div>
            <Badge color="primary" pill className="mt-1">
              {item?.systemName}
            </Badge>
          </div>
          <i className="ri-arrow-right-s-line text-muted"></i>
        </div>
      </Link>
    </>
  );
};

// ============================================================================
// My Settings Component
// ============================================================================
const MySettings = ({ isLoading }) => {
  const { control } = useForm();

  if (isLoading) {
    return (
      <div className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner size="sm" color="primary" />
        <span className="ms-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0 fw-semibold text-uppercase">My Settings</h6>
          <p className="text-muted small mb-0">Application Settings to personalize your experience.</p>
        </div>
      </div>

      <div className="d-flex flex-column gap-1 pt-4">
        <div className="d-flex justify-content-between">
          <div className="me-3 mt-1">Always show My Application</div>
          <SwitchButton name="showApplication" control={control} label="" />
        </div>
        <div className="d-flex justify-content-between">
          <div className="me-3 mt-1">Toggle Dark Mode</div>
          <SwitchButton name="darkMode" control={control} label="" />
        </div>
        <div className="d-flex justify-content-between">
          <div className="me-3 mt-1">Play Notification Sounds</div>
          <SwitchButton name="notificationSound" control={control} label="" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Settings Offcanvas Component
// ============================================================================
const SettingsOffcanvas = ({ isOpen, toggle, data, isLoading }) => (
  <Offcanvas isOpen={isOpen} toggle={toggle} direction="end" style={{ width: "350px" }} backdrop={true}>
    <OffcanvasHeader className="d-flex align-items-center bg-primary bg-gradient p-3 offcanvas-header-dark" toggle={toggle}>
      <span className="m-0 me-2 text-white">
        <i className="ri-settings-4-line me-2"></i>
        My Application
      </span>
    </OffcanvasHeader>
    <OffcanvasBody className="p-0">
      <SimpleBar className="h-100">
        <FavoritesList data={data} isLoading={isLoading} />
        <MySettings />
      </SimpleBar>
    </OffcanvasBody>
  </Offcanvas>
);

// ============================================================================
// Main RightSidebar Component
// ============================================================================
const RightSidebar = (props) => {
  const dispatch = useDispatch();
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  // Fetch favorites data
  const { data, isLoading, refetch } = useListFavoritesUserPagesQuery({
    refetchOnMountOrArgChange: true,
  });
  const rowData = useMemo(() => data?.returnData || [], [data]);

  // Get layout properties
  const layoutProperties = useSelector(selectLayoutProperties);

  // Toggle offcanvas
  const handleToggleCanvas = useCallback(() => {
    setIsCanvasOpen((prev) => !prev);
  }, [dispatch]);

  // Refetch on open
  useEffect(() => {
    if (isCanvasOpen) {
      refetch();
    }
  }, [isCanvasOpen, refetch]);

  // Reset checkboxes when canvas opens
  useEffect(() => {
    if (isCanvasOpen) {
      const darkCheckbox = document.getElementById("sidebar-color-dark");
      const lightCheckbox = document.getElementById("sidebar-color-light");
      if (darkCheckbox) darkCheckbox.checked = false;
      if (lightCheckbox) lightCheckbox.checked = false;
    }
  }, [isCanvasOpen]);

  return (
    <React.Fragment>
      <BackToTopButton />
      <SettingsToggleButton onClick={handleToggleCanvas} />
      <SettingsOffcanvas isOpen={isCanvasOpen} toggle={handleToggleCanvas} data={rowData} isLoading={isLoading} />
    </React.Fragment>
  );
};

export default withRouter(RightSidebar);