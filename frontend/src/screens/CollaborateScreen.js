import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const CollaborateScreen = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.userLogin);

  const handleApplyNowClick = async () => {
    if (!userInfo || !userInfo.email) {
      history.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        "/api/chefs/application?email=" + encodeURIComponent(userInfo.email)
      );

      if (response.data) {
        // If application exists
        history.push("/chef-application-success");
      } else {
        history.push("/chef-application");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        history.push("/chef-application");
      } else {
        console.error("Error checking application:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {"\
          @keyframes slideInRight {\
            0% {\
              opacity: 0;\
              transform: translateX(100%);\
            }\
            100% {\
              opacity: 1;\
              transform: translateX(0);\
            }\
          }\
\
          @keyframes slideInLeft {\
            0% {\
              opacity: 0;\
              transform: translateX(-100%);\
            }\
            100% {\
              opacity: 1;\
              transform: translateX(0);\
            }\
          }\
\
          .slide-in-right {\
            animation: slideInRight 1s ease forwards;\
          }\
\
          .slide-in-left {\
            animation: slideInLeft 1s ease forwards;\
          }\
\
          .fixed-image-size {\
            width: 350px;\
            height: 400px;\
            object-fit: cover;\
          }\
\
          .description-text {\
            font-size: 1.1rem;\
            color: #333;\
            padding: 0 15px;\
          }\
        "}
      </style>
      <Container className="py-5">
        {/* Chef Section */}
        <Row className="align-items-center mb-5">
          <Col md={3} className="order-md-1 order-2">
            <Button variant="primary" size="lg" onClick={handleApplyNowClick} disabled={loading}>
              Apply Now
            </Button>
          </Col>
          <Col md={6} className="order-md-2 order-3 description-text">
            Join our team of passionate chefs and showcase your culinary skills to a wide audience.
            Be part of a vibrant community that values creativity and quality.
          </Col>
          <Col md={3} className="order-md-3 order-1" style={{ marginLeft: "auto", maxWidth: "300px" }}>
            <img
              src="/images/chef.png"
              alt="Chef"
              className="img-fluid fixed-image-size slide-in-right"
            />
          </Col>
        </Row>

        {/* Delivery Partner Section */}
        <Row className="align-items-center">
          <Col md={3} style={{ marginRight: "auto", maxWidth: "300px" }}>
            <img
              src="/images/Deliverypartners.jpeg"
              alt="Delivery Partners"
              className="img-fluid fixed-image-size slide-in-left"
            />
          </Col>
          <Col md={6} className="description-text">
            Become a delivery partner and enjoy flexible working hours with competitive earnings.
            Help us deliver happiness to customers while growing your own business.
          </Col>
          <Col md={3} style={{ marginLeft: "auto", maxWidth: "fit-content" }}>
            <Button variant="primary" size="lg" onClick={handleApplyNowClick} disabled={loading}>
              Apply Now
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CollaborateScreen;
