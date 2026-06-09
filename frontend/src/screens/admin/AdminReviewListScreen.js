import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { listReviews } from "../../actions/reviewActions";

const AdminReviewListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const reviewList = useSelector((state) => state.reviewList);
  const { loading, error, reviews } = reviewList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listReviews());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  // Helper function to render colored stars dynamically based on rating
  const renderStars = (rating) => {
    const maxStars = 5;
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} style={{ color: "#ffc107", fontSize: "1.2rem" }}>
            &#9733;
          </span>
        );
      } else {
        stars.push(
          <span key={i} style={{ color: "#e5e6f0", fontSize: "1.2rem" }}>
            &#9733;
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <>
      <h1>Reviews</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Food Item</th>
              <th>Chef & Kitchen</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review._id}</td>
                <td>{review.customer}</td>
                <td>{review.foodItem}</td>
                <td>{review.chef} &amp; {review.kitchenName}</td>
                <td>{renderStars(review.rating)}</td>
                <td>{review.comment}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AdminReviewListScreen;
