import React, { Fragment, useState } from 'react';
import './CSS/Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!name || !email || !comment) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, comment }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit query');
      }

      setMessage('Your query has been submitted successfully.');
      setName('');
      setEmail('');
      setComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Fragment>
      <section className="contact">
        <video className="videoTag" autoPlay loop muted>
          <source src="./images/contact.mp4" type="video/mp4" />
        </video>

        <div className="contact-heading">
          <h2>Contact Us</h2>
        </div>

        <div className="contact-container">
          <div className="row">
            <div className="column">
              <div className="contact-widget">
                <div className="contact-widget-item">
                  <div className="icon">
                    <i className="fas fa-phone" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="text">
                    <h5>Call Us</h5>
                    <p>+91 8097367927</p>
                  </div>
                </div>
              </div>

              <div className="contact-widget">
                <div className="contact-widget-item">
                  <div className="icon">
                    <i className="fas fa-envelope" style={{ fontSize: '36px' }}></i>
                  </div>
                  <div className="text">
                    <h5>EMAIL</h5>
                    <p>rukkurukmini1106@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-widget">
              <div className="contact-widget-item">
                <div className="icon">
                  <i className="fas fa-map-marker-alt" style={{ fontSize: '36px' }}></i>
                </div>
                <div className="text">
                  <h5>Address</h5>
                  <p>Uttarahalli, Bangalore, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="map-column">
              <div className="contact-map" style={{ marginTop: '40px' }}>
                <iframe
                  title="Google Map - Uttarahalli Bangalore"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.305140763969!2d77.52489297413268!3d12.904613887402155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3ff0f68d52c3%3A0xc55bd1b4b8a4827e!2sUttarahalli%2C%20Bengaluru%2C%20Karnataka%20560061!5e0!3m2!1sen!2sin!4v1713431584721!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="column" style={{ marginTop: '40px' }}>
              <form onSubmit={submitHandler}>
                <h4>Fill out for Any Queries</h4>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    aria-describedby="name"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    aria-describedby="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <textarea
                    className="form-control"
                    placeholder="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default Contact;
