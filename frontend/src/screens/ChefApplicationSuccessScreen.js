import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

const AnimatedSuccessCircle = () => (
  <svg
    width="150"
    height="150"
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ margin: "20px auto", display: "block" }}
  >
    <circle
      cx="75"
      cy="75"
      r="70"
      stroke="#4CAF50"
      strokeWidth="10"
      fill="none"
      strokeDasharray="440"
      strokeDashoffset="440"
      style={{ animation: "dash 2s forwards ease-in-out" }}
    />
    <circle
      cx="75"
      cy="75"
      r="70"
      fill="#4CAF50"
      fillOpacity="0"
      style={{ animation: "fill 2s forwards ease-in-out 2s" }}
    />
    <path
      d="M50 75 L68 93 L100 60"
      stroke="white"
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="70"
      strokeDashoffset="70"
      style={{ animation: "checkmark 1s forwards ease-in-out 3.5s" }}
    />
    <style>
      {`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fill {
          to {
            fill-opacity: 1;
          }
        }
        @keyframes checkmark {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}
    </style>
  </svg>
);

const ChefApplicationSuccessScreen = () => {
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "admin") {
        history.push("/admin/dashboard");
        return;
      }
      // Redirect to home for non-chef users is commented out to allow showing success page
      // if (userInfo.role !== "chef") {
      //   history.push("/");
      //   return;
      // }
    }

    let intervalId;

    const fetchStatus = async () => {
      if (!userInfo) {
        setStatus("Pending");
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`/api/chefs/application?email=${encodeURIComponent(userInfo.email)}`);
        setStatus(data.status);
        setError(null);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    intervalId = setInterval(fetchStatus, 10000);

    return () => clearInterval(intervalId);
  }, [userInfo, history]);

  const handleSuccessClick = () => {
    history.push("/signup-chef");
  };

  const normalizedStatus = status ? status.toLowerCase() : "pending";

  return (
    <Container style={{ maxWidth: "600px", marginTop: "20px", textAlign: "center" }}>
      <h2>Application Submitted Successfully</h2>
      <AnimatedSuccessCircle />
      {loading ? (
        <Spinner animation="border" role="status" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div style={{ backgroundColor: "#f0f0f0", padding: "15px", marginTop: "20px", borderRadius: "8px", color: "#999" }}>
          <h4>Status: {status || "Pending"}</h4>
          {normalizedStatus === "pending" && <p>Your application is under review. Please wait for approval.</p>}
          {normalizedStatus === "approved" && (
            <>
              <p>Congratulations! Your application has been approved.</p>
              <Button variant="success" onClick={handleSuccessClick}>
                Proceed to Final Registration
              </Button>
            </>
          )}
          {normalizedStatus === "rejected" && <p>Sorry, your application has been rejected.</p>}
        </div>
      )}
    </Container>
  );
};

export default ChefApplicationSuccessScreen;
