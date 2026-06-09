import React, { useState, useEffect } from 'react';
import { Table, Container, Form, Button } from 'react-bootstrap';

const FAQScreen = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq');
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        const data = await response.json();
        setFaqs(data);
        // Initialize answers state with existing answers
        const initialAnswers = {};
        data.forEach(faq => {
          initialAnswers[faq._id] = faq.answer || '';
        });
        setAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveAnswer = async (id) => {
    try {
      const response = await fetch(`/api/faq/${id}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answers[id] }),
      });
      if (!response.ok) {
        throw new Error('Failed to save answer');
      }
      const updatedFAQ = await response.json();
      setFaqs(prevFaqs =>
        prevFaqs.map(faq => (faq._id === id ? updatedFAQ : faq))
      );
      alert('Answer saved successfully');
    } catch (err) {
      alert(`Error saving answer: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ comment?')) {
      try {
        const response = await fetch(`/api/faq/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete FAQ');
        }
        setFaqs(prevFaqs => prevFaqs.filter(faq => faq._id !== id));
        alert('FAQ deleted successfully');
      } catch (err) {
        alert(`Error deleting FAQ: ${err.message}`);
      }
    }
  };

  return (
    <Container>
      <h1>FAQ List</h1>
      {loading ? (
        <p>Loading FAQs...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : faqs.length === 0 ? (
        <p>No FAQs found.</p>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Comment</th>
              <th>Answer</th>
              <th>Date Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq._id}>
                <td>{faq.name}</td>
                <td>{faq.email}</td>
                <td>{faq.comment}</td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={answers[faq._id]}
                    onChange={(e) => handleAnswerChange(faq._id, e.target.value)}
                  />
                </td>
                <td>{new Date(faq.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSaveAnswer(faq._id)}
                    style={{ marginRight: '5px' }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(faq._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default FAQScreen;
