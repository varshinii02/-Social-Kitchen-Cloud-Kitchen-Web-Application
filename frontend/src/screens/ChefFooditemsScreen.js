import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Fooditem from "../components/Fooditem";
import { listFooditemsByChef } from "../actions/fooditemActions";

const ChefFooditemsScreen = () => {
  const { id: chefId } = useParams();
  const dispatch = useDispatch();

  const fooditemListByChef = useSelector((state) => state.fooditemListByChef);
  const { loading, error, fooditems } = fooditemListByChef;

  useEffect(() => {
    dispatch(listFooditemsByChef(chefId));
  }, [dispatch, chefId]);

  return (
    <>
      <h1>Food Items by Chef</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : fooditems.length === 0 ? (
        <Message>No food items found for this chef.</Message>
      ) : (
        <Row>
          {fooditems.map((fooditem) => (
            <Col key={fooditem._id} sm={12} md={6} lg={4} xl={3}>
              <Fooditem fooditem={fooditem} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ChefFooditemsScreen;
