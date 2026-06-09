import React, { useEffect } from "react";
import { Table, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import {
  listFooditems,
  deleteFooditem,
  createFooditem,
} from "../actions/fooditemActions";
import { FOODITEM_CREATE_RESET } from "../constants/fooditemConstants";

const FooditemListScreen = ({ history, match }) => {
  const keyword = match.params.keyword || "";
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const fooditemList = useSelector((state) => state.fooditemList);
  const { loading, error, fooditems, page, pages } = fooditemList;
  const fooditemDelete = useSelector((state) => state.fooditemDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = fooditemDelete;
  const fooditemCreate = useSelector((state) => state.fooditemCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    fooditem: createdFooditem,
  } = fooditemCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: FOODITEM_CREATE_RESET });
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
    if (successCreate) {
      history.push(`/admin/fooditem/${createdFooditem._id}/edit`);
    } else {
      dispatch(listFooditems(keyword, pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdFooditem,
    pageNumber,
    keyword,
  ]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Fooditems</h1>
        </Col>
        {/* Removed create fooditem button as per request */}
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>CHEF ID</th>
                <th>KITCHEN NAME</th>
                <th>IMAGE</th>
                <th>NAME</th>
                <th>PRICE (₹)</th>
                {/* Removed CATEGORY and CALORIES columns as per request */}
                {/* Removed QUANTITY and last action column as per request */}
              </tr>
            </thead>
            <tbody>
              {fooditems.map((fooditem) => (
                <tr key={fooditem._id}>
                  <td>{fooditem._id}</td>
                  <td>{fooditem.user ? fooditem.user._id : "N/A"}</td>
                  <td>{fooditem.user && fooditem.user.kitchenName ? fooditem.user.kitchenName : "N/A"}</td>
                  <td>
                    <img
                      src={
                        fooditem.image.startsWith("http")
                          ? fooditem.image
                          : fooditem.image.startsWith("/uploads/")
                          ? `http://localhost:5001${fooditem.image}`
                          : fooditem.image.startsWith("/images/")
                          ? fooditem.image
                          : `/uploads/${fooditem.image}`
                      }
                      alt={fooditem.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{fooditem.name}</td>
                  <td>₹{fooditem.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default FooditemListScreen;
