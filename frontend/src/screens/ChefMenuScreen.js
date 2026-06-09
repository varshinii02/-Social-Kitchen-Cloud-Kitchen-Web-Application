import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Image,
  Modal,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  listChefFooditems,
  createFooditem,
  updateFooditem,
  deleteFooditem,
} from "../actions/fooditemActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ChefMenuScreen = ({ history }) => {
  const dispatch = useDispatch();

  const fooditemChefList = useSelector((state) => state.fooditemChefList);
  const { loading, error, fooditems } = fooditemChefList;

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

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Form state for add/edit
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fooditemId, setFooditemId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login-chef");
    } else {
      dispatch(listChefFooditems());
    }
  }, [dispatch, history, userInfo, successCreate, successUpdate, successDelete]);

  const resetForm = () => {
    setFooditemId(null);
    setName("");
    setPrice("");
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
    if (!name || !price) {
      setUploadError("Name and price are required");
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
    formData.append("countInStock", available ? 1 : 0);
    if (image) {
      formData.append("image", image);
    }

    if (editMode) {
      dispatch(updateFooditem(fooditemId, formData));
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

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h1>Add New Food Item</h1>
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
            <th>Price ($)</th>
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
              <td>${fooditem.price.toFixed(2)}</td>
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
          <Modal.Title>{editMode ? "Edit Food Item" : "Add New Food Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadError && <Alert variant="danger">{uploadError}</Alert>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter dish name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="price" className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              <Form.Label>Upload Image</Form.Label>
              <div
                style={{
                  border: "2px dashed #007bff",
                  borderRadius: "5px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("imageFileInput").click()}
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
                id="imageFileInput"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              {editMode ? "Save Changes" : "Add Food Item"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChefMenuScreen;
