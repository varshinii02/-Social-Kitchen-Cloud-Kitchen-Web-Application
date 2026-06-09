import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import { registerChef } from "../actions/userActions";
import { registerChef as chefRegister } from "../actions/chefActions";

const ChefSignupScreen = () => {
  const [name, setName] = useState("");
  const [kitchenName, setKitchenName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const chefRegisterState = useSelector((state) => state.chefRegister);
  const { chefInfo } = chefRegisterState;

  useEffect(() => {
    if (chefInfo) {
      history.push("/chef/dashboard");
    }
  }, [history, chefInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Phone number validation (simple regex for 10 digit numbers)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage("Please enter a valid 10-digit phone number");
      return;
    }
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
      setMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      // Validate about field word count (max 50 words)
      const wordCount = about.trim().split(/\s+/).length;
      if (wordCount > 50) {
        setMessage("About field must be within 50 words");
        return;
      }
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("kitchenName", kitchenName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("about", about);
        if (image) {
          formData.append("profilePic", image);
        }
        await dispatch(chefRegister(formData));
        setLoading(false);
      } catch (error) {
        setMessage(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    }
  };

  return (
    <FormContainer>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", backgroundColor: "black", padding: "10px", borderRadius: "8px" }}>
        <h1 style={{ color: "white", marginRight: "20px" }}>Chef Signup</h1>
        <img
          src="/images/chef-spoons-rolling.gif"
          alt="Chef Spoons Spinning"
          style={{ width: "250px", height: "150px", display: "inline-block" }}
        />
      </div>
      {message && <Message variant="danger">{message}</Message>}
      {loading ? (
        <div className="chef-loader">
          <img
            src="/images/chef-spoons-rolling.gif"
            alt="Loading..."
            style={{ width: "100px", margin: "auto", display: "block" }}
          />
        </div>
      ) : (
        <>
          <Form onSubmit={submitHandler} encType="multipart/form-data">
            <Form.Group controlId="profilePic" className="mb-3">
              <Form.Label>Profile Pic</Form.Label>
              <div
                style={{
                  border: "2px dashed #007bff",
                  borderRadius: "5px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("profilePicInput").click()}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "150px" }}
                  />
                ) : (
                  <>
                    <i
                      className="fas fa-cloud-upload-alt"
                      style={{ fontSize: "48px", color: "#007bff" }}
                    ></i>
                    <p>Upload image</p>
                    <p>(.jpg, .png, etc.)</p>
                  </>
                )}
              </div>
              <Form.Control
                type="file"
                id="profilePicInput"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

        <Form.Group controlId="kitchenName" className="my-2">
          <Form.Label>Kitchen Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter kitchen name"
            value={kitchenName}
            onChange={(e) => setKitchenName(e.target.value)}
            required
          />
        </Form.Group>

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
                required
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

            <Form.Group controlId="confirmPassword" className="my-2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
          </Form.Group>

          <Form.Group controlId="about" className="my-2">
            <Form.Label>Tell us about yourself (max 50 words)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Tell us about yourself"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={300}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Signup
          </Button>
        </Form>
        <Row className="py-3" style={{ textAlign: "center" }}>
          <Col>
            Already have an account?{" "}
            <Link to="/login-chef" style={{ color: "black" }}>
              Login
            </Link>
          </Col>
        </Row>
      </>
    )}
  </FormContainer>
);
};

export default ChefSignupScreen;
