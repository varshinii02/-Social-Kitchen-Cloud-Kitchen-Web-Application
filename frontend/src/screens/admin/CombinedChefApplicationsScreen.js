import React, { useEffect, useState } from "react";
import { Table, Button, Tab, Tabs, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  listChefs,
} from "../../actions/chefActions";
import {
  listChefApplications,
  approveChefApplication,
  rejectChefApplication,
} from "../../actions/adminActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const CombinedChefApplicationsScreen = () => {
  const dispatch = useDispatch();

  // Local state for search and pagination for applications
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;

  // Fetch chefs
  const chefList = useSelector((state) => state.chefList);
  const { loading: loadingChefs, error: errorChefs, chefs } = chefList;

  // Fetch chef applications
  const chefApplicationsList = useSelector((state) => state.chefApplicationsList);
  const { loading: loadingApps, error: errorApps, applications } = chefApplicationsList;

  // Approve/reject state
  const chefApplicationApprove = useSelector((state) => state.chefApplicationApprove);
  const { success: successApprove } = chefApplicationApprove;

  const chefApplicationReject = useSelector((state) => state.chefApplicationReject);
  const { success: successReject } = chefApplicationReject;

  useEffect(() => {
    dispatch(listChefs());
    dispatch(listChefApplications());

    // Reset approve and reject success flags after handling
    if (successApprove) {
      dispatch({ type: "CHEF_APPLICATION_APPROVE_RESET" });
    }
    if (successReject) {
      dispatch({ type: "CHEF_APPLICATION_REJECT_RESET" });
    }
  }, [dispatch, successApprove, successReject]);

  // Handlers for approve/reject
  const approveHandler = (id) => {
    if (window.confirm("Are you sure you want to approve this application?")) {
      dispatch(approveChefApplication(id));
    }
  };

  const rejectHandler = (id) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      dispatch(rejectChefApplication(id));
    }
  };

  // Filter and paginate applications
  console.log("Chef Applications data:", applications);

  const filteredApplications = applications
    ? applications.filter((app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApp, indexOfLastApp);

  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <h1>Admin: Chefs & Chef Applications</h1>
      <Tabs defaultActiveKey="chefs" id="chef-tabs" className="mb-3">
        <Tab eventKey="chefs" title="Chefs">
          {loadingChefs ? (
            <Loader />
          ) : errorChefs ? (
            <Message variant="danger">{errorChefs}</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>KITCHEN NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                </tr>
              </thead>
              <tbody>
                {chefs.map((chef) => (
                  <tr key={chef._id}>
                    <td>{chef._id}</td>
                    <td>{chef.name}</td>
                    <td>{chef.kitchenName || "N/A"}</td>
                    <td>
                      <a href={`mailto:${chef.email}`}>{chef.email}</a>
                    </td>
                    <td>{chef.phone || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        <Tab eventKey="applications" title="Chef Applications">
          <Form className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
            </Row>
          </Form>
          {loadingApps ? (
            <Loader />
          ) : errorApps ? (
            <Message variant="danger">{errorApps}</Message>
          ) : (
            <>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Sample Menu</th>
                    <th>ID Proof</th>
                    <th>Availability</th>
                    <th>Days</th>
                    <th>Timings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.map((app) => {
                    console.log("Application status:", app.status);
                    return (
                      <tr key={app._id}>
                        <td>{app.name}</td>
                        <td>{app.email}</td>
                        <td>{app.phone}</td>
                        <td>
                          {app.address}, {app.city}, {app.state} - {app.postalCode}
                        </td>
                        <td>
                          {app.sampleMenuFile ? (
                            <a
                              href={`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5001"}/uploads/${app.sampleMenuFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          {app.governmentIdFile ? (
                            <a
                              href={`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5001"}/uploads/${app.governmentIdFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>{app.availabilityDaysCount}</td>
                        <td>{app.availabilityDays ? app.availabilityDays.join(", ") : "N/A"}</td>
                        <td>
                          {app.availabilityStartTime} - {app.availabilityEndTime}
                        </td>
                        <td>{app.status}</td>
                        <td>
                          {app.status && app.status.trim().toLowerCase() === "pending" ? (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => approveHandler(app._id)}
                                className="me-2"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => rejectHandler(app._id)}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <span>{app.status}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {totalPages > 1 && (
                <div className="pagination">
                  {[...Array(totalPages).keys()].map((x) => (
                    <Button
                      key={x + 1}
                      variant={x + 1 === currentPage ? "primary" : "light"}
                      onClick={() => paginate(x + 1)}
                      className="me-1"
                    >
                      {x + 1}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </Tab>
      </Tabs>
    </>
  );
};

export default CombinedChefApplicationsScreen;
