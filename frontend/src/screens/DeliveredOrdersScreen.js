import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Image, Form } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import ReviewForm from "../components/ReviewForm";
import axios from "axios";

const DeliveredOrdersScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewingItemId, setReviewingItemId] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await axios.get("/api/orders/myorders", config);
          // Filter orders with at least one delivered item
          const deliveredOrders = data.filter((order) =>
            order.orderItems.some((item) => item.status === "delivered")
          );
          setOrders(deliveredOrders);
          setLoading(false);
        } catch (err) {
          setError(
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message
          );
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [dispatch, history, userInfo]);

  const submitReviewHandler = async (orderId, orderItemId, review) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        "/api/reviews",
        {
          orderId,
          orderItemId,
          rating: review.rating,
          comment: review.comment,
        },
        config
      );
      alert("Review submitted successfully");
      setReviewingItemId(null);
    } catch (err) {
      alert(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  return (
    <>
      <h1>Delivered Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>No delivered orders found</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item Image</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Kitchen Name</th>
              <th>Date</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.orderItems
                .filter((item) => item.status === "delivered")
                .map((item) => (
                  <tr key={item._id}>
                    <td>{order._id}</td>
                    <td>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{item.chef.kitchenName || "N/A"}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>
                      {reviewingItemId === item._id ? (
                        <ReviewForm
                          onSubmit={(review) =>
                            submitReviewHandler(order._id, item._id, review)
                          }
                        />
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => setReviewingItemId(item._id)}
                        >
                          Write Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default DeliveredOrdersScreen;
