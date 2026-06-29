import { AvatarIcon } from "../AvatarIcon";

export const LinkWithAvatarColumn = ({ onClick, name = '', subName = '', subName2 = '', subName3 = '', avatar = null }) => {
    return (
        <div className="d-flex align-items-center" onClick={onClick} style={{ cursor: "pointer" }}>
            <AvatarIcon name={name} avatarImg={avatar} />
            <div className="flex-grow-1">
                <div className="fs-13 ">
                    {" "}
                    {name}
                </div>
                <div className="small text-muted">{subName}</div>
                <div className="small text-muted">{subName2}</div>
                <div className="small text-muted">{subName3}</div>
            </div>
        </div>
    )
}
