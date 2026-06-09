import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import {
  listFooditemDetails,
} from "../actions/fooditemActions";
import { FOODITEM_CREATE_REVIEW_RESET } from "../constants/fooditemConstants";
import { addToCart } from "../actions/cartActions";
import axios from "axios";

const FooditemScreen = ({ history, match }) => {
  const location = useLocation();
  const qtyInUrl = new URLSearchParams(location.search).get("qty");

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const cartItem = cartItems.find((item) => item.fooditem === match.params.id);
  const initialQty = cartItem ? cartItem.qty : (qtyInUrl && !isNaN(Number(qtyInUrl)) ? Number(qtyInUrl) : 1);

  const [qty, setQty] = useState(initialQty);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorReviews, setErrorReviews] = useState(null);

  const dispatch = useDispatch();

  const fooditemDetails = useSelector((state) => state.fooditemDetails);
  const { loading, error, fooditem } = fooditemDetails;

  useEffect(() => {
    if (!fooditem || !fooditem._id || fooditem._id !== match.params.id) {
      dispatch(listFooditemDetails(match.params.id));
      dispatch({ type: FOODITEM_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, fooditem]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const { data } = await axios.get(`/api/fooditems/${match.params.id}/reviews`);
        setReviews(data);
        setLoadingReviews(false);
      } catch (error) {
        setErrorReviews(error.response && error.response.data.message ? error.response.data.message : error.message);
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [match.params.id]);

  // Re-fetch fooditem details when reviews change to update rating and numReviews
  useEffect(() => {
    dispatch(listFooditemDetails(match.params.id));
  }, [reviews, dispatch, match.params.id]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    if (error === "Food item not found") {
      // Redirect to home page after showing warning message for 3 seconds
      setTimeout(() => {
        history.push("/");
      }, 3000);
      return <Message variant="warning">The requested food item does not exist. Redirecting to home page...</Message>;
    }
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Meta title={fooditem.name} />
      <Row>
        <Col md={6}>
          <Image
            src={
              fooditem.image &&
              (fooditem.image.startsWith("http")
                ? fooditem.image
                : `http://localhost:5001${fooditem.image}`)
            }
            alt={fooditem.name}
            fluid
            style={{ height: "500px", objectFit: "cover" }}
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{fooditem.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Status: {fooditem.countInStock > 0 ? "In Stock" : "Out Of Stock"}
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={fooditem.rating}
                text={`${fooditem.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ₹{fooditem.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: {fooditem.description}
            </ListGroup.Item>
            <ListGroup.Item>
              Chef: {fooditem.user && fooditem.user.name ? fooditem.user.name : "Unknown"}
            </ListGroup.Item>
            <ListGroup.Item>
              Kitchen: {fooditem.user && fooditem.user.kitchenName ? fooditem.user.kitchenName : "Unknown"}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>₹{fooditem.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          {fooditem.countInStock > 0 && (
            <Row style={{ marginTop: "10px", alignItems: "center" }}>
              <Col>Quantity:</Col>
              <Col style={{ display: "flex", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    const newQty = qty > 1 ? qty - 1 : 1;
                    setQty(newQty);
                    dispatch(addToCart(match.params.id, newQty));
                  }}
                  disabled={qty <= 1}
                  style={{
                    marginRight: "10px",
                    padding: "6px 12px",
                    border: "1px solid #0d6efd",
                    backgroundColor: "transparent",
                    color: "#0d6efd",
                    borderRadius: "4px",
                    cursor: qty <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  -
                </button>
                <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newQty = qty + 1;
                    setQty(newQty);
                    dispatch(addToCart(match.params.id, newQty));
                  }}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #0d6efd",
                    backgroundColor: "transparent",
                    color: "#0d6efd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </Col>
            </Row>
          )}
          <ListGroup.Item>
            <Button
              onClick={addToCartHandler}
              className="btn-block"
              type="button"
              disabled={fooditem.countInStock === 0}
            >
              Add To Cart
            </Button>
          </ListGroup.Item>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <h2>Reviews</h2>
          {loadingReviews ? (
            <Loader />
          ) : errorReviews ? (
            <Message variant="danger">{errorReviews}</Message>
          ) : reviews.length === 0 ? (
            <Message>No Reviews</Message>
          ) : (
            <ListGroup variant="flush">
              {reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>
                    {review.user && review.user.name ? review.user.name : "Anonymous"}{" "}
                    <span style={{ fontWeight: "normal", color: "#666", fontSize: "0.9em" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </strong>
                  <Rating value={review.rating} />
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </>
  );
};

export default FooditemScreen;
