import { AvatarIcon } from "@/components/Common/AvatarIcon";
import { Link } from "react-router-dom";

export const PersonColumn = ({ onClick, personName, avatarPath, position1, position2, width = 'auto' }) => {

  return (
    <>
      <div className={`d-flex align-items-center ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        style={{ width }}>
        <AvatarIcon name={personName} avatarImg={avatarPath} />
        <div className="flex-grow-2" >
          <h5 className="fs-13 mb-1">
            <div>
              {" "} {personName}
            </div>
          </h5>
          {position1 && <div className="small text-muted">{position1}</div>}
          {position2 && <div className="small text-muted">{position2}</div>}
        </div >
      </div >
    </>
  )
}
