import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const ReviewForm = ({ orderId, orderItemId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit(orderId, orderItemId, { rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="rating">
        <Form.Label>Rating</Form.Label>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#e4e5e9",
                fontSize: "1.5rem",
              }}
              onClick={() => setRating(star)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setRating(star);
              }}
              role="button"
              tabIndex={0}
              aria-label={`${star} Star`}
            >
              &#9733;
            </span>
          ))}
        </div>
      </Form.Group>
      <Form.Group controlId="comment" className="mt-3">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as="textarea"
          row="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here"
        />
      </Form.Group>
      {showError && (
        <p style={{ color: "red" }}>Please provide rating and comment</p>
      )}
      <Button type="submit" variant="primary" className="mt-3">
        Submit Review
      </Button>
    </Form>
  );
};

export default ReviewForm;
