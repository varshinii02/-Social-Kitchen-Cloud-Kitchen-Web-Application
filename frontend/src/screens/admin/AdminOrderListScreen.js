import React, { useEffect } from "react";
import { Table, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { listOrders } from "../../actions/orderActions";

const AdminOrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Customer Name</th>
              <th>Chef & Kitchen</th>
              <th>Order Date</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.orderItems.map((item) => (
                <tr key={item._id}>
                  <td>{order._id}</td>
                  <td>
                    <Image
                      src={
                        item.image &&
                        (item.image.startsWith("http") ||
                          item.image.startsWith("/uploads/"))
                          ? item.image
                          : `/uploads/${item.image}`
                      }
                      alt={item.name}
                      fluid
                      rounded
                      style={{ maxWidth: "75px" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{order.user ? order.user.name : "N/A"}</td>
                  <td>
                    {item.chefName} — {item.kitchenName || "N/A"}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{item.qty}</td>
                  <td>₹{order.totalPrice.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AdminOrderListScreen;
