import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

const TrackOrderScreen = () => {
  const { id } = useParams();
  const history = useHistory();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const goBackHandler = () => {
    history.goBack();
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusProgress = (status) => {
    switch (status) {
      case "preparing":
        return 20;
      case "cooking":
        return 40;
      case "packing":
        return 60;
      case "on the way":
        return 80;
      case "delivered":
        return 100;
      case "paid":
        return 100;
      default:
        return 0;
    }
  };

  const renderTracker = () => {
    if (!order) return null;

    // Assuming all items have the same status for simplicity, or show the max progress
    const maxProgress = Math.max(...order.orderItems.map(item => getStatusProgress(item.status)));

    return (
      <div>
        <h2>Order Status Tracker</h2>
        <ProgressBar now={maxProgress} label={`${maxProgress}%`} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <span>Preparing</span>
          <span>Cooking</span>
          <span>Packing</span>
          <span>On the way</span>
          <span>Delivered</span>
          <span>Paid</span>
        </div>
      </div>
    );
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Row>
        <Col>
          <h1>Track Your Order</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : !order ? (
            <Loader />
          ) : (
            <>
              {renderTracker()}
              <div style={{ marginTop: "20px" }}>
                <h3>Order Items</h3>
                {order.orderItems.map((item) => (
                  <div key={item._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <p><strong>{item.name}</strong></p>
                    <p>Status: {item.status}</p>
                    <Button variant="primary" onClick={() => alert(`Tracking order item: ${item.name}`)}>
                      Track My Order
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" onClick={goBackHandler} style={{ marginTop: "20px" }}>
                Go Back
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TrackOrderScreen;
