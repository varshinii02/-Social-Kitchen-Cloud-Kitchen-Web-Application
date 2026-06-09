import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { listMyOrders } from "../actions/orderActions";
import { LinkContainer } from "react-router-bootstrap";

const CartScreen = ({ match, location, history }) => {
  const fooditemId = match.params.id;

  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { orders } = orderListMy;

  useEffect(() => {
    if (fooditemId) {
      dispatch(addToCart(fooditemId, qty));
    }
    dispatch(listMyOrders());
  }, [dispatch, fooditemId, qty]);

  // Remove filtering of cart items by undelivered orders
  // Use all cartItems directly
  const filteredCartItems = cartItems;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <>
      <video className="videoTag" autoPlay loop muted>
        <source src="./images/shoppingcart.mp4" type="video/mp4" />
      </video>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>

          {/* Display all undelivered order items grouped by order */}
          {orders && orders.length > 0 && (
            <>
              <h2>Undelivered Orders</h2>
              {orders
                .filter(order =>
                  !order.isDelivered &&
                  order.orderItems.some(item =>
                    ["preparing", "cooking", "packing", "on the way"].includes(item.status)
                  )
                )
                .map(order => (
                  <div key={order._id} style={{ marginBottom: "2rem" }}>
                    <h4>Order ID: {order._id}</h4>
                    <ListGroup variant="flush">
                      {order.orderItems.map(item => (
                        <ListGroup.Item key={item._id} className="mb-3">
                          <Row className="align-items-center">
                            <Col md={2}>
                              <Image src={item.image} alt={item.name} fluid rounded />
                            </Col>
                            <Col md={6}>
                              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{item.name}</div>
                              <div style={{ marginTop: "5px" }}>
                                {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                              </div>
                            </Col>
                            <Col md={4} className="text-end">
                              <LinkContainer to={`/trackorder/${order._id}`}>
                                <Button variant="primary">
                                  Track My Order
                                </Button>
                              </LinkContainer>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                ))}
            </>
          )}

          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty{" "}
              <a
                href="/?scrollTo=latest-items"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/?scrollTo=latest-items");
                }}
                style={{ cursor: "pointer" }}
              >
                Go To Menu
              </a>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.fooditem}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/fooditem/${item.fooditem}`}>
                        {item.name}
                      </Link>{" "}
                      <span style={{ fontWeight: "bold" }}>x{item.qty}</span>
                    </Col>
                    <Col md={2}>₹{item.price}</Col>
                    <Col
                      md={2}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (item.qty > 1) {
                            dispatch(addToCart(item.fooditem, item.qty - 1));
                          }
                        }}
                        disabled={item.qty <= 1}
                        style={{
                          marginRight: "10px",
                          padding: "6px 12px",
                          border: "1px solid #0d6efd",
                          backgroundColor: "transparent",
                          color: "#0d6efd",
                          borderRadius: "4px",
                          cursor: item.qty <= 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        -
                      </button>
                      <span
                        style={{ marginRight: "10px", fontWeight: "bold" }}
                      >
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(addToCart(item.fooditem, item.qty + 1))
                        }
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
                    <Col md={2}>
                      {/* Delete button for removing item from cart */}
                      <Button
                        type="button"
                        variant="dark"
                        onClick={() => removeFromCartHandler(item.fooditem)}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal (
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  items
                </h2>
                ₹
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={filteredCartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
