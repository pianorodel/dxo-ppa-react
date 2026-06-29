const Section = ({ title, children }) => {
  return (
    <div style={{ marginBottom: "8px" }}>
      <div className="section-title">{title}</div>
      {children}
    </div>
  );
};

export default Section;
