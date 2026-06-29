import * as moment from "moment";
import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

const Banner = ({ title, description, icon }) => {

    return (
        <React.Fragment>
            <Card className="border-0 overflow-hidden mb-0"
                style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1e5f8a 45%, #0ab39c 100%)", minHeight: 156 }}>
                <CardBody className="p-0">
                    <Row className="g-0 align-items-center" style={{ minHeight: 156 }}>
                        <Col md={8} className="p-4">
                            <h3 className="text-white fw-bold mb-1" style={{ fontSize: "1.45rem" }}>
                                {title}
                            </h3>
                            <p className="mb-3" style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.88rem", maxWidth: 520 }}>
                                {description}
                            </p>
                            <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>
                                <i className="ri-calendar-line"></i>
                                <span>Today: {moment().format("MMMM DD, YYYY")}</span>
                                <span className="mx-1 opacity-50">|</span>
                                <i className="ri-map-pin-line"></i>
                                <span>{process.env.REACT_APP_CUSTOMER_FULL_NAME}</span>
                            </div>
                        </Col>
                        <Col md={4} className="d-none d-md-flex align-items-center justify-content-end pe-4" style={{ minHeight: 156 }}>
                            <div className="position-relative" style={{ width: 220, height: 130 }}>
                                {[
                                    { rotate: -5, left: 0, top: 25, bg: "rgba(255,255,255,0.08)", w: 130, h: 90 },
                                    { rotate: 2, left: 25, top: 12, bg: "rgba(255,255,255,0.13)", w: 130, h: 90 },
                                    { rotate: 0, left: 50, top: 0, bg: "rgba(255,255,255,0.22)", w: 130, h: 90 },
                                ].map((s, i) => (
                                    <div key={i} className="position-absolute rounded-3 d-flex align-items-center justify-content-center"
                                        style={{ transform: `rotate(${s.rotate}deg)`, left: s.left, top: s.top, background: s.bg, width: s.w, height: s.h, border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}>
                                        {i === 2 && (
                                            <div className="text-center text-white">
                                                <i className={icon} style={{ fontSize: "1.8rem", opacity: 0.9 }}></i>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default Banner;
