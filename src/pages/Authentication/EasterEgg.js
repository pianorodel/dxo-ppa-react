import { Col, Row } from "reactstrap";
import { useEffect, useState } from "react";
import dxoLogo from "@/assets/images/dxo/logo-3d.png";

export const EasterEgg = ({ handleClose }) => {

    const [cracked, setCracked] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setCracked(true), 400);
        const t2 = setTimeout(() => setShowContent(true), 1200);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const developers = [
        { name: "Roland Acuesta Jr", role: "Executive Commander", avatar: require('@/assets/images/eggs/roland.jpg'), initials: "RA", badgeBg: "#FAEEDA", badgeColor: "#633806", avatarFrom: "#FAC775", avatarTo: "#EF9F27", avatarText: "#412402" },
        { name: "Rodel Piano", role: "Code Commander", avatar: require('@/assets/images/eggs/rodel.jpg'), initials: "RP", badgeBg: "#E6F1FB", badgeColor: "#0C447C", avatarFrom: "#85B7EB", avatarTo: "#378ADD", avatarText: "#042C53" },
        { name: "Melo Ubay", role: "Technology Navigator", avatar: require('@/assets/images/eggs/melo.jpg'), initials: "MU", badgeBg: "#E1F5EE", badgeColor: "#085041", avatarFrom: "#5DCAA5", avatarTo: "#1D9E75", avatarText: "#04342C" },
        // { name: "Francis Eran", role: "Master of the Machine", avatar: require('@/assets/images/eggs/francis.jpg'), initials: "FE", badgeBg: "#EEEDFE", badgeColor: "#3C3489", avatarFrom: "#AFA9EC", avatarTo: "#7F77DD", avatarText: "#26215C" },
        // { name: "Geraldjek Torres", role: "Pixel Whisperer", avatar: require('@/assets/images/eggs/jek.jpg'), initials: "GT", badgeBg: "#FAECE7", badgeColor: "#712B13", avatarFrom: "#F0997B", avatarTo: "#D85A30", avatarText: "#4A1B0C" },
        // { name: "Ian Blas", role: "Code Artisan", avatar: require('@/assets/images/eggs/ian.jpg'), initials: "IB", badgeBg: "#FBEAF0", badgeColor: "#72243E", avatarFrom: "#ED93B1", avatarTo: "#D4537E", avatarText: "#4B1528" },
    ];

    return (
        <>
            <style>{`
                @keyframes eggShake {
                    0%   { transform: rotate(0deg) scale(1); }
                    15%  { transform: rotate(-8deg) scale(1.05); }
                    30%  { transform: rotate(8deg) scale(1.05); }
                    45%  { transform: rotate(-6deg) scale(1.08); }
                    60%  { transform: rotate(6deg) scale(1.08); }
                    75%  { transform: rotate(-4deg) scale(1.1); }
                    90%  { transform: rotate(4deg) scale(1.1); }
                    100% { transform: rotate(0deg) scale(1.1); }
                }
                @keyframes crackTop {
                    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-60px) rotate(-20deg); opacity: 0; }
                }
                @keyframes crackBottom {
                    0%   { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(40px); opacity: 0; }
                }
                @keyframes yolkPop {
                    0%   { transform: scale(0) translateY(10px); opacity: 0; }
                    60%  { transform: scale(1.2) translateY(-4px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes fadeSlideUp {
                    0%   { opacity: 0; transform: translateY(24px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes sparkle {
                    0%   { transform: scale(0) rotate(0deg); opacity: 1; }
                    100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
                }
                .egg-shake { animation: eggShake 0.4s ease-in-out; }
                .crack-top { animation: crackTop 0.5s ease-out forwards; }
                .crack-bottom { animation: crackBottom 0.5s ease-out forwards; }
                .yolk-pop { animation: yolkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s forwards; }
                .content-reveal { animation: fadeSlideUp 0.5s ease-out forwards; }
                .sparkle-1 { animation: sparkle 0.6s ease-out 0.1s forwards; }
                .sparkle-2 { animation: sparkle 0.6s ease-out 0.2s forwards; }
                .sparkle-3 { animation: sparkle 0.6s ease-out 0.15s forwards; }
                .sparkle-4 { animation: sparkle 0.6s ease-out 0.25s forwards; }
            `}</style>

            <Row className="justify-content-center" style={{ minHeight: "80vh", alignItems: "center" }}>
                <Col lg={8} md={8} sm={11} xs={12} style={{ width: "800px" }}>

                    {/* ── Egg animation stage ── */}
                    {!showContent && (
                        <div style={{ textAlign: "center", padding: "3rem 0" }}>
                            <div style={{ position: "relative", display: "inline-block", width: 100, height: 120 }}>

                                {!cracked ? (
                                    /* Whole egg — shaking */
                                    <div className="egg-shake">
                                        <svg width="100" height="120" viewBox="0 0 100 120">
                                            <ellipse cx="50" cy="62" rx="38" ry="48"
                                                fill="url(#eggGrad)" />
                                            <defs>
                                                <radialGradient id="eggGrad" cx="38%" cy="35%" r="60%">
                                                    <stop offset="0%" stopColor="#fff8f0" />
                                                    <stop offset="100%" stopColor="#e8d5b7" />
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                ) : (
                                    /* Cracked egg + yolk */
                                    <>
                                        {/* Sparkles */}
                                        <div className="sparkle-1" style={{ position: "absolute", top: 10, left: 5, fontSize: 18, opacity: 0 }}>✨</div>
                                        <div className="sparkle-2" style={{ position: "absolute", top: 0, right: 8, fontSize: 14, opacity: 0 }}>⭐</div>
                                        <div className="sparkle-3" style={{ position: "absolute", top: 20, right: 0, fontSize: 16, opacity: 0 }}>✨</div>
                                        <div className="sparkle-4" style={{ position: "absolute", top: 5, left: 20, fontSize: 12, opacity: 0 }}>💫</div>

                                        {/* Top shell */}
                                        <div className="crack-top" style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
                                            <svg width="100" height="70" viewBox="0 0 100 70">
                                                <defs>
                                                    <radialGradient id="eggGrad2" cx="38%" cy="35%" r="60%">
                                                        <stop offset="0%" stopColor="#fff8f0" />
                                                        <stop offset="100%" stopColor="#e8d5b7" />
                                                    </radialGradient>
                                                    <clipPath id="topClip">
                                                        <path d="M12,62 C12,30 88,30 88,62 Q72,56 62,60 L55,52 L45,62 L35,54 L25,62 Q18,58 12,62Z" />
                                                    </clipPath>
                                                </defs>
                                                <ellipse cx="50" cy="62" rx="38" ry="48" fill="url(#eggGrad2)" clipPath="url(#topClip)" />
                                                <path d="M12,62 Q18,58 25,62 L35,54 L45,62 L55,52 L62,60 Q72,56 88,62"
                                                    fill="none" stroke="#c9a96e" strokeWidth="1.5" />
                                            </svg>
                                        </div>

                                        {/* Bottom shell */}
                                        <div className="crack-bottom" style={{ position: "absolute", top: 50, left: 0, width: "100%" }}>
                                            <svg width="100" height="70" viewBox="0 0 100 70">
                                                <defs>
                                                    <radialGradient id="eggGrad3" cx="38%" cy="35%" r="60%">
                                                        <stop offset="0%" stopColor="#fff8f0" />
                                                        <stop offset="100%" stopColor="#e8d5b7" />
                                                    </radialGradient>
                                                    <clipPath id="bottomClip">
                                                        <path d="M12,0 Q18,4 25,0 L35,8 L45,0 L55,10 L62,2 Q72,6 88,0 C88,32 12,32 12,0Z" />
                                                    </clipPath>
                                                </defs>
                                                <ellipse cx="50" cy="0" rx="38" ry="48" fill="url(#eggGrad3)" clipPath="url(#bottomClip)" />
                                            </svg>
                                        </div>

                                        {/* Yolk */}
                                        <div className="yolk-pop" style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", opacity: 0 }}>
                                            <svg width="52" height="52" viewBox="0 0 52 52">
                                                <defs>
                                                    <radialGradient id="yolkGrad" cx="38%" cy="32%" r="60%">
                                                        <stop offset="0%" stopColor="#FFE57A" />
                                                        <stop offset="100%" stopColor="#F59E0B" />
                                                    </radialGradient>
                                                </defs>
                                                <circle cx="26" cy="26" r="24" fill="url(#yolkGrad)" />
                                                <ellipse cx="19" cy="19" rx="6" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-30 19 19)" />
                                            </svg>
                                        </div>
                                    </>
                                )}
                            </div>

                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 24 }}>
                                {cracked ? "You cracked it! 🎉" : "Something's hatching..."}
                            </p>
                        </div>
                    )}

                    {/* ── Main card — revealed after animation ── */}
                    {showContent && (
                        <div className="content-reveal" style={{
                            background: "#fff",
                            borderRadius: 20,
                            overflow: "hidden",
                            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                            position: "relative",
                        }}>
                            {/* Corner close button */}
                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="Close"
                                style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    zIndex: 2,
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "rgba(255,255,255,0.2)",
                                    color: "#fff",
                                    fontSize: 18,
                                    lineHeight: 1,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.35)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
                            >
                                ✕
                            </button>

                            {/* Hero */}
                            <div style={{
                                background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 45%, #0ab39c 100%)",
                                padding: "1rem 2rem 2rem",
                                textAlign: "center",
                            }}>
                                <div style={{ marginBottom: 6 }}>
                                    <img src={dxoLogo} width="280px" className="img-fluid" alt="user-pic" />
                                </div>
                                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: 0, marginTop: "-35px" }}>
                                    The minds behind this machine. Don't tell anyone.
                                </p>
                            </div>

                            {/* Developer cards */}
                            {(() => {
                                const perRow = developers.length > 3 ? Math.ceil(developers.length / 2) : developers.length;
                                const rows = [];
                                for (let i = 0; i < developers.length; i += perRow) {
                                    rows.push(developers.slice(i, i + perRow));
                                }
                                return (
                                    <div style={{
                                        borderTop: "1px solid #e9ecef",
                                        borderBottom: "1px solid #e9ecef",
                                    }}>
                                        {rows.map((rowDevs, rIdx) => (
                                            <div key={rIdx} style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                borderTop: rIdx > 0 ? "1px solid #e9ecef" : "none",
                                            }}>
                                                {rowDevs.map((dev, i) => (
                                                    <div key={i} style={{
                                                        flex: `0 0 ${100 / perRow}%`,
                                                        maxWidth: `${100 / perRow}%`,
                                                        padding: "1.75rem 1rem",
                                                        textAlign: "center",
                                                        borderRight: i < rowDevs.length - 1 ? "1px solid #e9ecef" : "none",
                                                        background: "#fff",
                                                    }}>
                                                        <img
                                                            src={dev.avatar}
                                                            alt={dev.name}
                                                            style={{
                                                                width: 72, height: 72,
                                                                borderRadius: "50%",
                                                                objectFit: "cover",
                                                                display: "block",
                                                                margin: "0 auto 12px",
                                                                border: "3px solid #fff",
                                                                outline: "2px solid #e9ecef",
                                                            }}
                                                            onError={e => {
                                                                e.target.style.display = "none";
                                                                e.target.nextSibling.style.display = "flex";
                                                            }}
                                                        />
                                                        <div style={{
                                                            width: 72, height: 72,
                                                            borderRadius: "50%",
                                                            background: `linear-gradient(135deg, ${dev.avatarFrom}, ${dev.avatarTo})`,
                                                            color: dev.avatarText,
                                                            fontSize: 22, fontWeight: 600,
                                                            display: "none",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            margin: "0 auto 12px",
                                                            border: "3px solid #fff",
                                                            outline: "2px solid #e9ecef",
                                                        }}>
                                                            {dev.initials}
                                                        </div>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: "#2b2b2b", margin: "0 0 6px", lineHeight: 1.3 }}>
                                                            {dev.name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* Footer */}
                            <div style={{ padding: "1.25rem 2rem 1.5rem", textAlign: "center", background: "#fff" }}>
                                <p className="text-muted" style={{ margin: 0 }}>
                                    Built with too much coffee and not enough sleep. &copy; DXO IT & CyberSecurity Services
                                </p>
                            </div>
                        </div>
                    )}

                </Col>
            </Row>
        </>
    );
};