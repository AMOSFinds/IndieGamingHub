import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import CustomAlert from "./CustomAlert";

function Contact() {
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      message,
    };

    emailjs
      .send(
        "service_cwqrr5n",
        "template_ftlkwcd",
        templateParams,
        "xi4YvugXX_kcz5SpR"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setAlertMessage("Message sent successfully!");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            setMessage("");
          }, 3000); // Hide alert after 3 seconds
        },
        (error) => {
          console.log("FAILED...", error);
          setAlertMessage("Failed to send message.");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000); // Hide alert after 3 seconds
        }
      );
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-paragraph">
        For business inquiries or feedback/criticism about our app, please
        contact us using the form below. Your feedback is valuable to us and
        helps us improve.
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          required
          className="contact-input"
        />
        <button type="submit" className="contact-button">
          Send Message
        </button>
      </form>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default Contact;
