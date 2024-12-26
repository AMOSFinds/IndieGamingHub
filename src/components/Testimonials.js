import React from "react";
import "./Testimonials.css";

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Trojan Fox",
      title: "It’s very delicious!",
      rating: 5,
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet venenatis a vel id tincidunt volutpat faucibus scelerisque. Morbi eget turpis aliquet nunc, varius aliquam ipsum.",
      avatar: "https://via.placeholder.com/150", // Replace with actual image URLs
    },
    // Add more testimonials as needed
  ];

  return (
    <section className="testimonial-section">
      <h2 className="testsection-title">
        <span className="highlight">Testimonial</span>
        <br />
        What People Say
      </h2>
      <div className="testimonial-card">
        <img
          src={testimonials[0].avatar}
          alt={testimonials[0].name}
          className="testimonial-avatar"
        />
        <h3 className="testimonial-title">{testimonials[0].title}</h3>
        <div className="testimonial-rating">
          {"★".repeat(testimonials[0].rating)}
          {"☆".repeat(5 - testimonials[0].rating)}
        </div>
        <p className="testimonial-review">{testimonials[0].review}</p>
        <p className="testimonial-author">{testimonials[0].name}</p>
      </div>
      <div className="testimonial-pagination">
        <span className="pagination-dot active"></span>
        <span className="pagination-dot"></span>
        <span className="pagination-dot"></span>
      </div>
    </section>
  );
}

export default Testimonials;
