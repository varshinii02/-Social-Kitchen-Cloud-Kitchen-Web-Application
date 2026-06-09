import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import Fooditem from "../components/Fooditem";
import Loader from "../components/Loader";
import Message from "../components/Message";

const RecommendedSection = ({ baseFooditemId }) => {
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/fooditems/recommended?fooditemId=${baseFooditemId}`);
        setRecommendedItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (baseFooditemId) {
      fetchRecommended();
    }
  }, [baseFooditemId]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (recommendedItems.length === 0) return null;

  const totalPages = Math.ceil(recommendedItems.length / itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const startIndex = currentPage * itemsPerPage;
  const currentItems = recommendedItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>You might also like</h2>
      <Row>
        {currentItems.map((item) => (
          <Col key={item._id} sm={12} md={6} lg={4} xl={3}>
            <Fooditem fooditem={item} />
          </Col>
        ))}
      </Row>
      {totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Button variant="light" onClick={handlePrev} style={{ marginRight: "10px" }}>
            &#8592;
          </Button>
          <Button variant="light" onClick={handleNext}>
            &#8594;
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendedSection;
