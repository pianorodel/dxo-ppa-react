export const TwoLinesColumn = ({ line1 = "", line2 = "", muteLine2 = true, onClick = () => {} }) => {
  return (
    <div className={`d-flex align-items-center ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <div className="flex-grow-1">
        <span>{line1}</span>
        <p className={`mb-0 ${muteLine2 ? "text-muted" : ""}`}>
          <span>{line2}</span>
        </p>
      </div>
    </div>

    // <div className="d-flex align-items-center" onClick={onClick}>
    //     <AvatarIcon name={employeeName} />
    //     <div className="flex-grow-1">
    //         <h5 className="fs-13 mb-1">
    //             <Link to="#"
    //                 onClick={onClick}>
    //                 {" "}{employeeName}
    //             </Link>
    //         </h5>

    //         {position ? <p className="mb-0">
    //             <span>
    //                 {" "}{position}
    //             </span>
    //         </p> : null}
    //     </div>
    // </div>
  );
};
