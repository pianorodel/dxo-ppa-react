import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

const BreadCrumb = ({ title, crumbs = [] }) => {

    {
        crumbs[0]?.title == process.env.REACT_APP_CUSTOMER_SHORT_NAME ?
            document.title = `${title} | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME}`
            :
            document.title = `${title} | ${process.env.REACT_APP_CUSTOMER_SHORT_NAME} - ${crumbs[0]?.title}`
    }

    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <h4 className="mb-sm-0">{title}</h4>

                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                {crumbs && crumbs.map((crumb, index) => (
                                    <li key={index} className="breadcrumb-item"><Link to={crumb.url}>{crumb.title}</Link></li>
                                ))}
                                {/* 
                                <li className="breadcrumb-item"><Link to="#">{pageTitle}</Link></li>
                                {parentTitle ? <li className="breadcrumb-item active"><Link to={parentUrl}>{parentTitle}</Link></li> : null} */}
                            </ol>
                        </div>

                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BreadCrumb;