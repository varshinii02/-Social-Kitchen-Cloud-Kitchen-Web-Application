import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

import { useHistory } from "react-router-dom";

const ChefApplicationScreen = () => {
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("");
  const [sampleMenuFile, setSampleMenuFile] = useState(null);
  const [governmentIdFile, setGovernmentIdFile] = useState(null);
  const [availabilityDaysCount, setAvailabilityDaysCount] = useState(0);
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [availabilityStartTime, setAvailabilityStartTime] = useState("");
  const [availabilityEndTime, setAvailabilityEndTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayChange = (day) => {
    if (availabilityDays.includes(day)) {
      setAvailabilityDays(availabilityDays.filter((d) => d !== day));
    } else {
      setAvailabilityDays([...availabilityDays, day]);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const errors = {};
    if (!name.trim()) errors.name = "Please fill the field";
    if (!email.trim()) errors.email = "Please fill the field";
    if (!phone.trim()) errors.phone = "Please fill the field";
    else if (!/^\d{10}$/.test(phone.trim())) errors.phone = "Please enter a valid 10-digit phone number";
    if (!address.trim()) errors.address = "Please fill the field";
    if (!city.trim()) errors.city = "Please fill the field";
    if (!postalCode.trim()) errors.postalCode = "Please fill the field";
    if (!state.trim()) errors.state = "Please fill the field";
    if (!sampleMenuFile) errors.sampleMenuFile = "Please fill the field";
    if (!governmentIdFile) errors.governmentIdFile = "Please fill the field";
    if (!availabilityDaysCount || availabilityDaysCount <= 0) errors.availabilityDaysCount = "Please fill the field";
    if (availabilityDays.length === 0) errors.availabilityDays = "Please fill the field";
    else if (Number(availabilityDaysCount) !== availabilityDays.length) errors.availabilityDays = `Please select exactly ${availabilityDaysCount} days`;
    if (!availabilityStartTime.trim()) errors.availabilityStartTime = "Please fill the field";
    if (!availabilityEndTime.trim()) errors.availabilityEndTime = "Please fill the field";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("postalCode", postalCode);
      formData.append("state", state);
      if (sampleMenuFile) {
        formData.append("sampleMenuFile", sampleMenuFile);
      }
      if (governmentIdFile) {
        formData.append("governmentIdFile", governmentIdFile);
      }
      formData.append("availabilityDaysCount", availabilityDaysCount);
      formData.append("availabilityDays", JSON.stringify(availabilityDays));
      formData.append("availabilityStartTime", availabilityStartTime);
      formData.append("availabilityEndTime", availabilityEndTime);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/chefs/application", formData, config);
      setSuccess(data.message);
      // Redirect to success page after successful submission
      history.replace("/chef-application-success");
      // Clear form fields if needed (optional)
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setPostalCode("");
      setState("");
      setSampleMenuFile(null);
      setGovernmentIdFile(null);
      setAvailabilityDaysCount(0);
      setAvailabilityDays([]);
      setAvailabilityStartTime("");
      setAvailabilityEndTime("");
      setFieldErrors({});
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  return (
    <Container style={{ maxWidth: "600px", marginTop: "20px" }}>
      <h2>Chef Application</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <Form onSubmit={submitHandler} encType="multipart/form-data">
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Full Name *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {fieldErrors.name && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.name}
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address *</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.email}
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="phone" className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {fieldErrors.phone && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.phone}
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {fieldErrors.address && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.address}
            </div>
          )}
        </Form.Group>

        <Row>
          <Col>
            <Form.Group controlId="city" className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {fieldErrors.city && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {fieldErrors.city}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="postalCode" className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              {fieldErrors.postalCode && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {fieldErrors.postalCode}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="state" className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              {fieldErrors.state && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {fieldErrors.state}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="sampleMenuFile" className="mb-3">
          <Form.Label>Sample Menu</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setSampleMenuFile(e.target.files[0])}
          />
          {fieldErrors.sampleMenuFile && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.sampleMenuFile}
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="governmentIdFile" className="mb-3">
          <Form.Label>Government ID Proof</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setGovernmentIdFile(e.target.files[0])}
          />
          {fieldErrors.governmentIdFile && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.governmentIdFile}
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="availabilityDaysCount" className="mb-3">
          <Form.Label>Number of Days Available in a Week</Form.Label>
          <Form.Control
            type="number"
            min="0"
            max="7"
            value={availabilityDaysCount}
            onChange={(e) => setAvailabilityDaysCount(e.target.value)}
          />
          {fieldErrors.availabilityDaysCount && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.availabilityDaysCount}
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="availabilityDays" className="mb-3">
          <Form.Label>Select Days Available</Form.Label>
          <div>
            {daysOfWeek.map((day) => (
              <Form.Check
                inline
                key={day}
                label={day}
                type="checkbox"
                id={`day-${day}`}
                checked={availabilityDays.includes(day)}
                onChange={() => handleDayChange(day)}
              />
            ))}
          </div>
          {fieldErrors.availabilityDays && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {fieldErrors.availabilityDays}
            </div>
          )}
        </Form.Group>

        <Row>
          <Col>
            <Form.Group controlId="availabilityStartTime" className="mb-3">
              <Form.Label>Availability Start Time</Form.Label>
              <Form.Control
                type="time"
                value={availabilityStartTime}
                onChange={(e) => setAvailabilityStartTime(e.target.value)}
              />
              {fieldErrors.availabilityStartTime && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {fieldErrors.availabilityStartTime}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="availabilityEndTime" className="mb-3">
              <Form.Label>Availability End Time</Form.Label>
              <Form.Control
                type="time"
                value={availabilityEndTime}
                onChange={(e) => setAvailabilityEndTime(e.target.value)}
              />
              {fieldErrors.availabilityEndTime && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {fieldErrors.availabilityEndTime}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary">
          Submit Application
        </Button>
      </Form>
    </Container>
  );
};

export default ChefApplicationScreen;
