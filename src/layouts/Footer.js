import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
    return (
        <React.Fragment>
            <style>{`
                @keyframes heartbeat {
                    0%   { transform: scale(1); }
                    14%  { transform: scale(1.3); }
                    28%  { transform: scale(1); }
                    42%  { transform: scale(1.3); }
                    70%  { transform: scale(1); }
                }
                .heart-beat {
                    display: inline-block;
                    animation: heartbeat 1.3s ease-in-out infinite;
                }
            `}</style>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            {new Date().getFullYear()} © Enterprise Application Suite.
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-end d-none d-sm-block">
                                Crafted with <i className="mdi mdi-heart text-danger heart-beat"></i> by DXO IT & CyberSecurity Services
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;