import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import helpFile from "@/assets/reports/User Manual.pdf";
import FileViewer from "@/components/Common/Modals/FileViewer";
import ChangePassword from "@/pages/Authentication/ChangePassword";
import { useLogoutAuthenticationMutation } from "@/api/Endpoints/Core/Authentication/Login";

import { useQueryParams } from "../Hooks/useQueryParams";
import { AvatarIcon } from "./AvatarIcon";


const ProfileDropdown = ({ onClickUserDetails = () => {} }) => {
  const navigate = useNavigate();
  const [openHelp, setOpenHelp] = useState(false);
  const { setParams } = useQueryParams();
   const [logoutAuthentication] = useLogoutAuthenticationMutation();

  const [toggleChangePassword, setToggleChangePassword] = useState(false);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [userData, setUserData] = useState({
    userId: 0,
    fullName: "Admin",
    firstName: "",
    middleName: "",
    lastName: "",
    clname: "",
    emailAddress: "",
    mobileNo: "",
    avatar: "",
  });

  useEffect(() => {
    const loadUserData = () => {
      const currentUser = sessionStorage.getItem("currentUser");
      if (currentUser) {
        try {
          const obj = JSON.parse(currentUser);
          setUserData({
            userId: obj?.userId || 0,
            fullName: obj?.fullName || `${obj?.firstName || ""} ${obj?.middleName || ""} ${obj?.lastName || ""}`.trim(),
            firstName: obj?.firstName || "",
            middleName: obj?.middleName || "",
            lastName: obj?.lastName || "",
            clname: obj?.clname || "",
            emailAddress: obj?.emailAddress || "",
            mobileNo: obj?.mobileNo || "",
            avatar: obj?.avatar || "",
            userName: obj?.userName || "",
          });
        } catch (err) {
          console.error("Failed to parse current user:", err);
        }
      }
    };

    // Load initial data
    loadUserData();

    // Listen for avatar updates
    const handleAvatarUpdate = () => {
      loadUserData();
    };

    window.addEventListener("CURRENTUSER_AVATAR_UPDATED", handleAvatarUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("CURRENTUSER_AVATAR_UPDATED", handleAvatarUpdate);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const handleOpenHelp = () => {
    setOpenHelp(!openHelp);
  };

const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutAuthentication({});
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/logout"); 
    }
  };

  return (
    <>
      <FileViewer data={helpFile} onCloseClick={handleOpenHelp} show={openHelp} moduleName={"User Manual"} />

      <ChangePassword show={toggleChangePassword} onCloseClick={() => setToggleChangePassword(false)} />

      <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <AvatarIcon name={userData.firstName} avatarImg={userData?.avatar} />
            <span className="text-start">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userData.firstName}</span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{userData.clcode}</span>
            </span>
          </span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userData.fullName}</h6>
          <DropdownItem className="p-0">
            <Link
              onClick={(e) => {
                e.preventDefault();
                onClickUserDetails(true);
              }}
              className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                setToggleChangePassword(true);
              }}>
              <i className="ri-lock-unlock-fill text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Change Password</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link
              // to="/socials/faq"
              onClick={(e) => {
                e.preventDefault();
                setOpenHelp(true);
              }}
              className="dropdown-item">
              <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Help</span>
            </Link>
          </DropdownItem>
          <div className="dropdown-divider"></div>
          <DropdownItem className="p-0">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setParams({ userData }, "/lockscreen");
              }}
              className="dropdown-item">
              <i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Lock screen</span>
            </Link>
          </DropdownItem>
          <DropdownItem className="p-0">
            <Link to="/logout" className="dropdown-item" onClick={handleLogout}>
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle" data-key="t-logout">
                Logout
              </span>
            </Link>
          </DropdownItem>
          {/* <div className="dropdown-divider"></div>
                    <div className="px-3 py-2 text-muted fs-12">
                        <div><strong>Email:</strong> <EmailLink email={userData.emailAddress} /></div>
                        <div><strong>Mobile:</strong> <i className="ri-phone-line text-muted" />{" "}{userData.mobileNo}</div>
                    </div> */}
          <div className="dropdown-divider"></div>
          <div className="px-3 py-2 text-muted fs-12">
            <div>
              <strong>EAS {process.env.REACT_APP_VERSION}</strong>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default ProfileDropdown;
