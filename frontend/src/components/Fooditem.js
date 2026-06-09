import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Fooditem = ({ fooditem }) => {
  const iconSrc =
    fooditem.category === "Omnivorous"
      ? "/images/veg.jpg"
      : fooditem.category === "Carnivorous"
      ? "/images/non-veg.jpg"
      : null;

  return (
    <Card className="my-3 p-3 rounded" style={{ height: "354px" }}>
      <Link to={`/fooditem/${fooditem._id}`}>
        <Card.Img
          src={
            fooditem.image.startsWith("http") ||
            fooditem.image.startsWith("/uploads/") ||
            fooditem.image.startsWith("/images/")
              ? fooditem.image
              : `/uploads/${fooditem.image}`
          }
          variant="top"
          style={{ height: "145px" }}
        />
      </Link>

      <Card.Body>
        <Link to={`/fooditem/${fooditem._id}`}>
          <Card.Title
            as="div"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <strong>{fooditem.name}</strong>
            {iconSrc && (
              <img
                src={iconSrc}
                alt="category icon"
                style={{ width: "40px", height: "40px" }}
              />
            )}
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <small className="text-muted">
            Kitchen: {fooditem.user ? fooditem.user.kitchenName : "Unknown"}
          </small>
        </Card.Text>
        <Card.Text as="div">
          <Rating
            value={fooditem.rating}
            text={`${fooditem.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">₹{fooditem.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Fooditem;
