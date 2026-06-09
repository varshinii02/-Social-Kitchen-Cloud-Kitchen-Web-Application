import React, { useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listChefApplications, approveChefApplication, rejectChefApplication } from '../../actions/adminActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AdminChefApplicationsScreen = () => {
  const dispatch = useDispatch();

  const chefApplicationsList = useSelector((state) => state.chefApplicationsList);
  const { loading, error, applications } = chefApplicationsList;

  const chefApplicationApprove = useSelector((state) => state.chefApplicationApprove);
  const { success: successApprove } = chefApplicationApprove;

  const chefApplicationReject = useSelector((state) => state.chefApplicationReject);
  const { success: successReject } = chefApplicationReject;

  useEffect(() => {
    dispatch(listChefApplications());
  }, [dispatch, successApprove, successReject]);

  const approveHandler = (id) => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      dispatch(approveChefApplication(id));
    }
  };

  const rejectHandler = (id) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      dispatch(rejectChefApplication(id));
    }
  };

  return (
    <Container>
      <h1>Chef Applications</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Kitchen Name</th>
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
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.kitchenName}</td>
                <td>{app.address}, {app.city}, {app.state} - {app.postalCode}</td>
                <td>
                  {app.sampleMenuFile ? (() => {
                    let path = app.sampleMenuFile;
                    while (path.startsWith("uploads/")) {
                      path = path.slice(8);
                    }
                    return <a href={`/uploads/${path}`} target="_blank" rel="noopener noreferrer">View</a>;
                  })() : "N/A"}
                </td>
                <td>
                  {app.governmentIdFile ? (() => {
                    let path = app.governmentIdFile;
                    while (path.startsWith("uploads/")) {
                      path = path.slice(8);
                    }
                    return <a href={`/uploads/${path}`} target="_blank" rel="noopener noreferrer">View</a>;
                  })() : "N/A"}
                </td>
                <td>{app.availabilityDaysCount}</td>
                <td>{app.availabilityDays ? app.availabilityDays.join(", ") : "N/A"}</td>
                <td>{app.availabilityStartTime} - {app.availabilityEndTime}</td>
                <td>{app.status}</td>
                <td>
                  {app.status === "Pending" && (
                    <>
                      <Button variant="success" size="sm" onClick={() => approveHandler(app._id)} className="me-2">
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => rejectHandler(app._id)}>
                        Reject
                      </Button>
                    </>
                  )}
                  {(app.status === "Approved" || app.status === "Rejected") && (
                    <span>{app.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminChefApplicationsScreen;
