import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { loginChef as chefLogin } from "../actions/chefActions";

const ChefLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const chefLoginState = useSelector((state) => state.chefLogin);
  const { loading, error, chefInfo } = chefLoginState;

  useEffect(() => {
    if (chefInfo) {
      history.push("/chef/dashboard");
    }
  }, [history, chefInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(chefLogin(email, phone, password));
  };

  return (
    <FormContainer>
      <h1>Chef Login</h1>
      {error && <Message variant="danger">{error}</Message>}
      {/* Removed success message display */}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="phone" className="my-2">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="my-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3" disabled={loading}>
          Login
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Chef?{" "}
          <Link to="/signup-chef">
            Sign up
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ChefLoginScreen;
