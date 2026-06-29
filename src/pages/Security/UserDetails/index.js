import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";

import defaultUserProfile from "@/assets/images/dummy-user.jpg";
import "@/assets/scss/modern-modal.css";
import { AvatarIcon } from "@/components/Common/AvatarIcon";
import { DateTimeLabel } from "@/components/Common/DateTimeLabel";
import FileUploadInput from "@/components/Common/FileUploadInput";
import { StatusBadgeColumn } from "@/components/Common/GridColumns";
import HistoryList from "@/components/Common/HistoryList";
import InfoRow from "@/components/Common/Inforow";
import { PhotoViewer } from "@/components/Common/PhotoViewer";
import Section from "@/components/Common/Section";
import useUploadFileCover from "@/components/Hooks/useUploadFileCover";
import { formatDate } from "@/helpers/date_helper";
import { getCurrentUser } from "@/helpers/session_helper";

import { useGetUserDetailsSystemLogsQuery } from "@/api/Endpoints/Core/App/SystemLogs";
import { useFindUsersQuery, useUpdateAvatarMutation } from "@/api/Endpoints/Core/Security/Users";

const UserDetails = ({ data: userData, userId, show, onCloseClick }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const [updateAvatarPhoto] = useUpdateAvatarMutation();
  const userIdParam = userId || userData?.userId;
  const showAvatarInput = getCurrentUser()?.userId === userIdParam;

  const { data } = useFindUsersQuery(
    { userId: userIdParam },
    { skip: !userIdParam, refetchOnMountOrArgChange: true },
  );
  const userInfo = data?.returnData;

  const {
    renderPreview: renderAvatarPreview,
    setImageValue: setAvatar,
    handleImageError: handleAvatarError,
  } = useUploadFileCover(userInfo?.avatar, defaultUserProfile);

  const { control } = useForm();

  useEffect(() => {
    if (show) setFullscreen(false);
  }, [show]);

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    try {
      setAvatar(file);
      const uploaded = await updateAvatarPhoto({ userId: userIdParam, AvatarFile: file });
      if (uploaded?.data?.returnData?.avatar) {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
        if (currentUser.userId === userIdParam) {
          currentUser.avatar = uploaded.data.returnData.avatar;
          sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
          window.dispatchEvent(new Event("CURRENTUSER_AVATAR_UPDATED"));
        }
        toast("Avatar was successfully updated.", {
          position: "bottom-right",
          className: "bg-success text-white",
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleClose = () => {
    setFullscreen(false);
    onCloseClick?.();
  };

  if (!show) return null;

  return (
    <div className={`emd-overlay${fullscreen ? " emd-fs" : ""}`} >
      <div className={`emd-box${fullscreen ? " emd-fullscreen" : ""}`}>
        {/* Header */}
        <div className="emd-hdr">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
            {/* Avatar */}
            <div className="emd-avatar-wrap">
              <label htmlFor="avatarPhotoFile" style={{ cursor: showAvatarInput ? "pointer" : "default" }}>
                <PhotoViewer>
                  {renderAvatarPreview ? (
                    <img
                      src={renderAvatarPreview}
                      onError={handleAvatarError}
                      className="emd-avatar-img"
                      alt={userInfo?.fullName}
                    />
                  ) : (
                    <AvatarIcon name={userInfo?.fullName} avatarImg={userInfo?.avatar} width="80px" height="80px" fontSize="30px" />
                  )}
                </PhotoViewer>
                {showAvatarInput && (
                  <div className="emd-avatar-ovl">
                    <i className="ri-camera-line" />
                  </div>
                )}
              </label>
              {showAvatarInput && (
                <FileUploadInput name="avatarPhotoFile" control={control} onFileSelect={handleAvatarUpload} />
              )}
            </div>

            {/* Name & contact */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{userInfo?.fullName || "—"}</span>
                <StatusBadgeColumn statusName={userInfo?.statusName} />
                <StatusBadgeColumn statusName={userInfo?.onlineStatus} />
                <StatusBadgeColumn statusName={userInfo?.lockStatus} />
              </div>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                {[
                  { icon: "ri-mail-line", val: userInfo?.emailAddress },
                  { icon: "ri-phone-line", val: userInfo?.mobileNo },
                ].map(
                  (item, i) =>
                    item.val && (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.58)", fontSize: 12 }}>
                        <i className={item.icon} />
                        {item.val}
                      </div>
                    ),
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <button
                className="emd-icon-btn"
                onClick={() => setFullscreen((f) => !f)}
                title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <i className={fullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"} />
              </button>
              <button className="emd-icon-btn emd-close" onClick={handleClose} title="Close">
                <i className="ri-close-line" style={{ fontSize: 17 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="emd-body">
          <div style={{ minHeight: "560px" }}>
            <Row className="g-0">
              <Col lg={4} className="border-end pe-3">
                <Section title="User Information">
                  <Row>
                    <Col lg={12}>
                      <InfoRow icon="bx bx-user" label="Full Name" value={userInfo?.fullName} />
                    </Col>
                    <Col lg={12}>
                      <InfoRow icon="bx bx-rename" label="User Name" value={userInfo?.userName} />
                    </Col>
                    <Col lg={12}>
                      <InfoRow icon="bx bx-envelope" label="Email Address" value={userInfo?.emailAddress} />
                    </Col>
                    <Col lg={12}>
                      <InfoRow icon="bx bx-phone-call" label="Mobile No." value={userInfo?.mobileNo} />
                    </Col>
                    <Col lg={12}>
                      <InfoRow icon="bx bx-calendar" label="Member Since" value={formatDate(userInfo?.createdDate)} />
                    </Col>
                    <Col lg={12}>
                      <InfoRow icon="bx bx-calendar" label="Last Login" value={formatDate(userInfo?.lastLoginDate)} />
                    </Col>
                    <Col lg={12}>
                      <div className="info-row">
                        <div className="info-icon">
                          <i className="bx bx-toggle-left" />
                        </div>
                        <div>
                          <span className="info-label">{"Status"}</span>
                          <StatusBadgeColumn statusName={userInfo?.statusName} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Section>

                {userInfo?.roles?.length > 0 && (
                  <div className="d-flex flex-wrap gap-2">
                    {userInfo.roles.map((role, i) => (
                      <span key={i} className="badge bg-info-subtle text-info">
                        {role.roleName}
                      </span>
                    ))}
                  </div>
                )}
              </Col>

              <Col lg={8} className="ps-3">
                {userIdParam && <HistoryList
                  title="Activities"
                  transactionId={userIdParam}
                  idKey="userId"
                  startDate={userInfo?.createdDate}
                  useLogsQuery={useGetUserDetailsSystemLogsQuery}
                />}
              </Col>
            </Row>
          </div>
        </div>

        {/* Footer */}
        <div className="emd-ftr">
          <span style={{ fontSize: 12, fontWeight: 500 }}>
            Last updated: <DateTimeLabel value={userInfo?.modifiedDate} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;