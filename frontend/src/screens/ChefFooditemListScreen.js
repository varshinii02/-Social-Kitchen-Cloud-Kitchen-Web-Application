import React, { useEffect } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listChefFooditems, deleteFooditem } from "../actions/fooditemActions";
import { LinkContainer } from "react-router-bootstrap";

const ChefFooditemListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const fooditemChefList = useSelector((state) => state.fooditemChefList);
  const { loading, error, fooditems } = fooditemChefList;

  const fooditemDelete = useSelector((state) => state.fooditemDelete);
  const { success: successDelete } = fooditemDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login-chef");
    } else {
      dispatch(listChefFooditems());
    }
  }, [dispatch, history, userInfo, successDelete]);
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      dispatch(deleteFooditem(id));
    }
  };

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: "FOODITEM_DELETE_RESET" });
    }
  }, [dispatch, successDelete]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>My Food Items</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {fooditemDelete.error && (
            <Message variant="danger">{fooditemDelete.error}</Message>
          )}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE (₹)</th>
                <th>CATEGORY</th>
                <th>CALORIES</th>
                <th>QUANTITY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fooditems.map((fooditem) => (
                <tr key={fooditem._id}>
                  <td>{fooditem._id}</td>
                  <td>{fooditem.name}</td>
                  <td>₹{fooditem.price}</td>
                  <td>{fooditem.category}</td>
                  <td>{fooditem.calories}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => alert('Quantity button clicked for ' + fooditem.name)}
                    >
                      {fooditem.countInStock}
                    </Button>
                  </td>
                  <td>
                    <LinkContainer to={`/admin/fooditem/${fooditem._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(fooditem._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ChefFooditemListScreen;
