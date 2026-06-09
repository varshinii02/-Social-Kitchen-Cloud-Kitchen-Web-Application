import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminStats } from '../../actions/adminActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AdminDashboardScreen = () => {
  const dispatch = useDispatch();

  const adminStats = useSelector((state) => state.adminStats || { loading: false, error: null, stats: {} });
  const { loading: loadingStats, error: errorStats, stats } = adminStats;

  useEffect(() => {
    dispatch(getAdminStats());
  }, [dispatch]);

  console.log("Admin stats:", stats);

  return (
    <Container>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Manage users, orders, and food items here.</p>
      {loadingStats ? (
        <Loader />
      ) : errorStats ? (
        <Message variant="danger">{errorStats}</Message>
      ) : (
        <Row className="my-4">
          <Col md={6} className="mb-3">
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              height: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f8f9fa"
            }}>
              <h3>Number of Chefs</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.chefsCount}</p>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              height: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f8f9fa"
            }}>
              <h3>Number of Delivery Partners</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.deliveryPartnersCount}</p>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              height: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f8f9fa"
            }}>
              <h3>Total Revenue</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                ₹{stats.totalRevenue ? stats.totalRevenue.toFixed(2) : "0.00"}
              </p>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              height: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f8f9fa"
            }}>
              <h3>Total Customers</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.customersCount}</p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminDashboardScreen;
