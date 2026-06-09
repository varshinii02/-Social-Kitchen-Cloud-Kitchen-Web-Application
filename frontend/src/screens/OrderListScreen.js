import React, { useEffect, useState } from "react";
import { Table, Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listMyOrders } from "../actions/orderActions";
import ReviewForm from "../components/ReviewForm";
import { createReview } from "../actions/reviewActions";
import { REVIEW_CREATE_RESET } from "../constants/reviewConstants";

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [reviewingItemId, setReviewingItemId] = useState(null);

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading, error, orders } = orderListMy;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const reviewCreate = useSelector((state) => state.reviewCreate);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = reviewCreate;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      dispatch(listMyOrders());
    }
  }, [dispatch, history, userInfo]);

  useEffect(() => {
    if (successReview) {
      dispatch({ type: REVIEW_CREATE_RESET });
      dispatch(listMyOrders());
    }
  }, [dispatch, successReview]);

  const handleWriteReviewClick = (itemId) => {
    if (reviewingItemId === itemId) {
      setReviewingItemId(null);
    } else {
      setReviewingItemId(itemId);
    }
  };

  const handleReviewSubmit = (orderId, orderItemId, review) => {
    dispatch(createReview(orderId, orderItemId, review));
    setReviewingItemId(null);
  };

  // Filter orders to only those with at least one delivered or paid item
  const filteredOrders = orders
    ? orders.filter((order) =>
        order.orderItems.some((item) => item.status === "delivered" || item.status === "paid")
      )
    : [];

  return (
    <>
      <h1>Delivered and Paid Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : filteredOrders.length === 0 ? (
        <Message>No delivered or paid orders found</Message>
      ) : (
        <>
          {loadingReview && <Loader />}
          {errorReview && <Message variant="danger">{errorReview}</Message>}
          {successReview && (
            <Message variant="success">Review submitted successfully</Message>
          )}
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
                <th>Status</th>
                <th>Write Review</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) =>
                order.orderItems
                  .filter((item) => item.status === "delivered" || item.status === "paid")
                  .map((item) => (
                    <tr key={item._id}>
                      <td>{order._id}</td>
                      <td>
                        <Image
                          src={
                            item.image &&
                            (item.image.startsWith("http") ||
                            item.image.startsWith("/uploads/"))
                              ? item.image
                              : `/uploads/${item.image}`
                          }
                          alt={item.name}
                          fluid
                          rounded
                          style={{ maxWidth: "75px" }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{item.kitchenName || "N/A"}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{item.status}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleWriteReviewClick(item._id)}
                        >
                          {reviewingItemId === item._id ? "Cancel" : "Write Review"}
                        </Button>
                        {reviewingItemId === item._id && (
                          <ReviewForm
                            orderId={order._id}
                            orderItemId={item._id}
                            onSubmit={handleReviewSubmit}
                          />
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default OrderListScreen;
