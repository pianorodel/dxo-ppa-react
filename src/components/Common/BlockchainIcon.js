const BlockchainIcon = ({ isValid, title, size = 24 }) => {
    const s = isValid ? "#0ab39c" : "#f06548";
    const faceLight = isValid ? "#0ab39c35" : "#f0654835";
    const faceDark = isValid ? "#0ab39c60" : "#f0654860";

    return (
        <div title={title} style={{ display: "inline-flex" }}>
            <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
                <polygon points="30,4 56,18 30,32 4,18" fill={faceDark} stroke={s} strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="4,18 30,32 30,56 4,42" fill={faceLight} stroke={s} strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="30,32 56,18 56,42 30,56" fill={faceLight} stroke={s} strokeWidth="2.5" strokeLinejoin="round" />
                {!isValid && (
                    <>
                        <line x1="20" y1="20" x2="40" y2="40" stroke={s} strokeWidth="3" strokeLinecap="round" />
                        <line x1="40" y1="20" x2="20" y2="40" stroke={s} strokeWidth="3" strokeLinecap="round" />
                    </>
                )}
            </svg>
        </div>
    );
};

export default BlockchainIcon;