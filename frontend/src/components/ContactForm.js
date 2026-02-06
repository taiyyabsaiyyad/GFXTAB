import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await axios.post(`${API}/contact`, formData);
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.response?.data?.detail || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="contact-modal-overlay" data-testid="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" data-testid="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="close-button" 
          data-testid="close-contact-form-btn"
          onClick={onClose}
        >
          ×
        </button>
        
        <h2 className="modal-heading">Get In Touch</h2>
        <p className="modal-subtext">Let's discuss your next project</p>

        <form onSubmit={handleSubmit} data-testid="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              data-testid="contact-name-input"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              data-testid="contact-email-input"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              data-testid="contact-message-input"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          {status === 'error' && (
            <div className="error-message" data-testid="error-message">
              {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div className="success-message" data-testid="success-message">
              Message sent successfully!
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            data-testid="contact-submit-btn"
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
