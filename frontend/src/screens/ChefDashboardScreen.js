import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Table,
  Image,
  Modal,
  Alert,
  Nav,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listChefFooditems,
  createFooditem,
  updateFooditem,
  deleteFooditem,
} from "../actions/fooditemActions";

const ChefDashboardScreen = ({ history }) => {
  const [section, setSection] = useState("overview");

  const dispatch = useDispatch();

  const chefLogin = useSelector((state) => state.chefLogin);
  const { chefInfo } = chefLogin;

  // Form state for add/edit food item
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fooditemId, setFooditemId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [calories, setCalories] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const fooditemChefList = useSelector((state) => state.fooditemChefList);
  const { loading, error, fooditems = [] } = fooditemChefList || {};
  console.log("Logged in chef ID:", chefInfo?._id ?? "No chef");
  console.log("Food items from Redux state:", fooditems);

  const fooditemCreate = useSelector((state) => state.fooditemCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = fooditemCreate;

  const fooditemUpdate = useSelector((state) => state.fooditemUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = fooditemUpdate;

  const fooditemDelete = useSelector((state) => state.fooditemDelete);
  const { success: successDelete } = fooditemDelete;

  // New state and handlers for orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    if (!chefInfo) {
      history.push("/login-chef");
    } else {
      dispatch(listChefFooditems());
      if (successDelete) {
        dispatch({ type: "FOODITEM_DELETE_RESET" });
      }
    }
  }, [dispatch, history, chefInfo, successCreate, successUpdate, successDelete]);

  useEffect(() => {
    if (section === "orders" && chefInfo) {
      fetchOrders();
    }
  }, [section, chefInfo]);

  const resetForm = () => {
    setFooditemId(null);
    setName("");
    setPrice("");
    setCalories("");
    setCategory("");
    setDescription("");
    setAvailable(true);
    setImage(null);
    setImagePreview(null);
    setUploadError(null);
  };

  const handleShowAdd = () => {
    resetForm();
    setEditMode(false);
    setShowModal(true);
  };

  const handleShowEdit = (fooditem) => {
    setFooditemId(fooditem._id);
    setName(fooditem.name);
    setPrice(fooditem.price);
    setCalories(fooditem.calories);
    setCategory(fooditem.category);
    setDescription(fooditem.description);
    setAvailable(fooditem.countInStock > 0);
    setImagePreview(fooditem.image);
    setEditMode(true);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed");
      return;
    }
    setUploadError(null);
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !price || !calories || !category || !description) {
      setUploadError(
        "Name, price, calories, category, and description are required"
      );
      return;
    }
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      setUploadError("Price must be a positive number");
      return;
    }
    // Prepare form data for image upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", priceNumber);
    formData.append("calories", calories);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("countInStock", available ? 1 : 0);
    if (image) {
      formData.append("image", image);
    }

    if (editMode) {
      dispatch(updateFooditem({ _id: fooditemId, formData }));
    } else {
      dispatch(createFooditem(formData));
    }
    setShowModal(false);
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      dispatch(deleteFooditem(id));
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch("/api/orders/chef", {
        headers: {
          Authorization: `Bearer ${chefInfo.token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
      setOrdersLoading(false);
    } catch (error) {
      setOrdersError(error.message);
      setOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId, itemId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/item/${itemId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chefInfo.token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              orderItems: order.orderItems.map((item) =>
                item._id === itemId ? { ...item, status } : item
              ),
            };
          }
          return order;
        })
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const [overviewData, setOverviewData] = useState({
    totalAvailableItems: 0,
    totalOrders: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);

  const [chefApplication, setChefApplication] = useState(null);
  const [chefApplicationLoading, setChefApplicationLoading] = useState(false);
  const [chefApplicationError, setChefApplicationError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      if (section === "overview" && chefInfo) {
        try {
          setOverviewLoading(true);
          setOverviewError(null);
          const response = await fetch("/api/chefs/overview", {
            headers: {
              Authorization: `Bearer ${chefInfo.token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch overview data");
          }
          const data = await response.json();
          setOverviewData(data);
          setOverviewLoading(false);
        } catch (error) {
          setOverviewError(error.message);
          setOverviewLoading(false);
        }
      }
    };
    fetchOverview();
  }, [section, chefInfo]);

  useEffect(() => {
    const fetchChefApplication = async () => {
      if (chefInfo && chefInfo.email) {
        try {
          setChefApplicationLoading(true);
          setChefApplicationError(null);
          const response = await fetch(`/api/chefs/application?email=${encodeURIComponent(chefInfo.email)}`, {
            headers: {
              Authorization: `Bearer ${chefInfo.token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch chef application data");
          }
          const data = await response.json();
          setChefApplication(data);
          setChefApplicationLoading(false);
        } catch (error) {
          setChefApplicationError(error.message);
          setChefApplicationLoading(false);
        }
      }
    };
    fetchChefApplication();
  }, [chefInfo]);

  const renderSectionContent = () => {
    switch (section) {
      case "overview":
        return (
          <div>
            <h2>Chef Dashboard Overview</h2>
            <p>Welcome, {chefInfo ? chefInfo.name : "Chef"}!</p>
            <p style={{ fontWeight: "600", color: "#000" }}>
              Address:{" "}
              {chefApplicationLoading
                ? "Loading..."
                : chefApplicationError
                ? "Error loading address"
                : chefApplication?.address || "N/A"}
            </p>
            {overviewLoading ? (
              <Loader />
            ) : overviewError ? (
              <Message variant="danger">{overviewError}</Message>
            ) : (
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ textAlign: "center", flex: "1 1 45%", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "#f9f9f9", color: "#000" }}>
              <h3 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{overviewData.totalAvailableItems}</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>Available Items</p>
            </div>
            <div style={{ textAlign: "center", flex: "1 1 45%", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "#f9f9f9", color: "#000" }}>
              <h3 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{overviewData.totalOrders}</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>Total Orders</p>
            </div>
            <div style={{ textAlign: "center", flex: "1 1 45%", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "#f9f9f9", color: "#000" }}>
              <h3 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>₹{overviewData.totalEarnings.toFixed(2)}</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>Total Earnings</p>
            </div>
            <div style={{ textAlign: "center", flex: "1 1 45%", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "#f9f9f9", color: "#000" }}>
              <h3 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{overviewData.averageRating}</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>Average Rating</p>
            </div>
          </div>
            )}
          </div>
        );
      case "fooditems":
        return (
          <>
            <Row className="align-items-center mb-3">
              <Col>
                <h2>Add New Food Item</h2>
              </Col>
              <Col className="text-right">
                <Button variant="primary" onClick={handleShowAdd}>
                  + Add Food Item
                </Button>
              </Col>
            </Row>

            {(loading || loadingCreate || loadingUpdate) && <Loader />}
            {(error || errorCreate || errorUpdate) && (
              <Message variant="danger">
                {error || errorCreate || errorUpdate}
              </Message>
            )}

            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price (₹)</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fooditems.map((fooditem) => (
                  <tr key={fooditem._id}>
                    <td>
                      <Image
                        src={fooditem.image}
                        alt={fooditem.name}
                        fluid
                        rounded
                        style={{ maxWidth: "80px", maxHeight: "80px" }}
                      />
                    </td>
                    <td>{fooditem.name}</td>
                    <td>₹{fooditem.price}</td>
                    <td>{fooditem.countInStock > 0 ? "Yes" : "No"}</td>
                    <td>
                      <Button
                        variant="info"
                        className="btn-sm mr-2"
                        onClick={() => handleShowEdit(fooditem)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(fooditem._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editMode ? "Edit Food Item" : "Add New Food Item"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {uploadError && <Alert variant="danger">{uploadError}</Alert>}
                <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    id="name"
                    type="text"
                    placeholder="Enter dish name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Calories</Form.Label>
                  <Form.Control
                    id="calories"
                    type="text"
                    placeholder="Enter calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    id="category"
                    type="text"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    id="description"
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="availability" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Available"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                  />
                </Form.Group>

                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <div
                    style={{
                      border: "2px dashed #007bff",
                      borderRadius: "5px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("foodItemImageInput").click()}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "150px" }}
                      />
                    ) : (
                      <>
                        <i
                          className="fas fa-cloud-upload-alt"
                          style={{ fontSize: "48px", color: "#007bff" }}
                        ></i>
                        <p>Upload image</p>
                        <p>(.jpg, .png, etc.)</p>
                      </>
                    )}
                  </div>
                  <Form.Control
                    type="file"
                    id="foodItemImageInput"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  {editMode ? "Save Changes" : "Add New Food Item"}
                </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </>
        );
      case "orders":
        return (
          <OrdersSection
            loading={loading}
            error={error}
            orders={orders}
            onStatusChange={handleStatusChange}
          />
        );
      case "payouts":
        return (
          <div>
            <h2>Payouts</h2>
            <p>Payouts information coming soon.</p>
          </div>
        );
      case "reviews":
        return <ChefReviewsSection chefId={chefInfo._id} />;
      default:
        return null;
    }
  };

  if (!chefInfo) {
    history.push("/login-chef");
    return null;
  }

  return (
    <>
      <Row>
        <Col md={3} style={{ paddingLeft: 0 }}>
          <Sidebar chefInfo={chefInfo} section={section} setSection={setSection} />
        </Col>
        <Col md={9}>{renderSectionContent()}</Col>
      </Row>
    </>
  );
};

export default ChefDashboardScreen;

const ChefReviewsSection = ({ chefId }) => {
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chefs/${chefId}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchReviews();
  }, [chefId]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <Message>No Reviews</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Item Image</th>
              <th>Item Name</th>
              <th>Customer Name</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>
                  {review.foodItemImage ? (
                    <img
                      src={review.foodItemImage}
                      alt={review.foodItem}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{review.foodItem || "N/A"}</td>
                <td>{review.user ? review.user.name : "Anonymous"}</td>
                <td>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < review.rating ? "#ffc107" : "#e4e5e9" }}>
                      &#9733;
                    </span>
                  ))}
                </td>
                <td>{review.comment}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

const OrdersSection = ({ loading, error, orders, onStatusChange }) => {
  return (
    <div>
      <h2>Orders</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Item Image</th>
              <th>Order Name</th>
              <th>Order Date</th>
              <th>Order Time</th>
              <th>Customer Address</th>
              <th style={{ width: "200px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.orderItems.map((item) => (
                <tr key={item._id}>
                  <td>{order.user.name}</td>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                  <td>
                    {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </td>
                  <td style={{ width: "200px" }}>
                    <Form.Control
                      as="select"
                      value={item.status}
                      onChange={(e) => onStatusChange(order._id, item._id, e.target.value)}
                      style={{ color: "#000", backgroundColor: "#fff" }}
                    >
                      <option value="preparing">Preparing</option>
                      <option value="cooking">Cooking</option>
                      <option value="packing">Packing</option>
                      <option value="on the way">On the way</option>
                      <option value="delivered">Delivered</option>
                      <option value="paid">Paid</option>
                    </Form.Control>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

const Sidebar = ({ chefInfo, section, setSection }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      {chefInfo && chefInfo.profilePic ? (
        <Image
          src={
            chefInfo.profilePic.startsWith("http")
              ? chefInfo.profilePic
              : chefInfo.profilePic.startsWith("/uploads/")
              ? chefInfo.profilePic
              : `/uploads/${chefInfo.profilePic}`
          }
          alt={chefInfo.name}
          roundedCircle
          fluid
          style={{ width: "160px", height: "160px", boxShadow: "0 4px 8px rgba(0,0,0,0.3)", marginRight: "10px" }}
        />
      ) : (
        <div
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            backgroundColor: "#ddd",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            marginRight: "10px",
            display: "inline-block",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="160"
            height="160"
            fill="#aaa"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M12 14c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z" />
          </svg>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <h5>{chefInfo ? chefInfo.name : "Chef"}</h5>
        <Nav
          className="flex-column"
          variant="pills"
          activeKey={section}
          onSelect={(selectedKey) => setSection(selectedKey)}
        >
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="fooditems">Food Items</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders">Orders</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="payouts">Payouts</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reviews">Reviews</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};
