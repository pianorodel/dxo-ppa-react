const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="info-row">
      <div className="info-icon">
        <i className={icon} />
      </div>
      <div>
        <span className="info-label">{label}</span>
        <span className="info-value">{value || "—"}</span>
      </div>
    </div>
  );
};

export default InfoRow;