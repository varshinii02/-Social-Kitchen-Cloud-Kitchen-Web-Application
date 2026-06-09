import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ChefImagesCircle from "../components/ChefImagesCircle";
import Meta from "../components/Meta";

const ChefListScreen = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/chefs");
      const normalizedChefs = data.map(chef => {
        if (chef.profilePic && !chef.profilePic.startsWith("http") && !chef.profilePic.startsWith("/uploads/")) {
          chef.profilePic = "/uploads/" + chef.profilePic;
        }
        return chef;
      });
      setChefs(normalizedChefs);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch chefs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  return (
    <>
      <Meta title="All Chefs" />
      <h1>All Chefs</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col>
            <ChefImagesCircle chefs={chefs} />
          </Col>
        </Row>
      )}
    </>
  );
};

export default ChefListScreen;
