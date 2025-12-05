// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import "./Home.css";
import finImg from "/assets/fin.jpg";
import finImgg from "/assets/girl.jpg";
import finImgg1 from "/assets/girl2.jpg";
import user1 from "/assets/1.jpeg";
import user2 from "/assets/2.jpeg";
import user3 from "/assets/3.jpeg";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = ({ currentUser, onGetStarted }) => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();

  const facts = [
    "The average menstrual cycle is 28 days long, but a healthy cycle can range from 21 to 35 days.",
    "Tracking your cycle can help you predict mood changes and energy levels.",
    "Stress can significantly impact your menstrual cycle.",
    "The follicular phase is when your energy levels are typically highest.",
    "Over 2 billion people worldwide menstruate, yet the topic is often surrounded by stigma."
  ];

  const testimonials = [
    {
      text: "HerWellness has changed my life! I finally understand my body and can predict my moods and energy levels.",
      name: "— Sarah M."
    },
    {
      text: "The personalized insights are amazing. The AI predictions are spot-on and help me prepare for my cycle.",
      name: "— Jessica L."
    },
    {
      text: "This app is more than a tracker; it's a wellness companion. The daily tips are so helpful.",
      name: "— Emily R."
    }
  ];

  const faqs = [
    {
      question: "How does the AI provide personalized insights?",
      answer: "Our AI analyzes your logged data to generate predictions unique to you."
    },
    {
      question: "Is my personal health data secure?",
      answer: "Yes, all information is encrypted and never shared with third parties."
    },
    {
      question: "Can I use this app if my cycles are irregular?",
      answer: "Absolutely. Our AI learns from your patterns, even with irregular cycles."
    },
    {
      question: "Is HerWellness free to use?",
      answer: "You can start with our free version, and upgrade to premium for more insights."
    }
  ];

  // Scroll animation effect
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div className="home-container mt-5 pt-5 md-0 pt-md-0">

      {/* Hero Section */}
      <section className="hero-section text-center">
        {currentUser && currentUser.name && (
          <div className="container mt-5 pt-3">
            <h5 className="text-danger fw-bold">Welcome, {currentUser.name}!</h5>
          </div>
        )}
        <h1 className="display-4 fw-bold text-danger animate-on-scroll">
          Your Personal Menstrual and Wellness Tracker
        </h1>
        <p className="lead mt-3 text-muted hero-paragraph mx-auto animate-on-scroll">
          HerWellness is more than a tracker — it’s your personal guide to understanding and embracing your body.
          Every day, it helps you tune into your cycle, track your moods, and discover insights tailored just for you.
          With HerWellness, menstrual health becomes empowerment, not confusion.
          Celebrate your rhythm, honor your body, and thrive with confidence, knowing that every phase of your cycle
          is an opportunity to nurture yourself and live your best life.
        </p>
        <button
        onClick={() => navigate("/calendar")}
        className="btn btn-lg btn-danger mt-4 shadow"
      >
        Get Started
      </button>
      </section>

      {/* About Section */}
      <section className="about-section my-5">
        <div className="row align-items-center g-4">
          <div className="col-md-4">
            <img
              src={finImgg1}
              alt="Wellness"
              className="img-fluid rounded-4 shadow w-100 hover-zoom animate-on-scroll"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold text-danger animate-on-scroll">Understand Your Body, Naturally.</h2>
            <p className="text-muted animate-on-scroll">
              Our cycle is not a burden, it’s a gift.
              It reminds you of the strength flowing within.
              Through every ache and challenge, you rise.
              Your body is powerful, resilient, and wise.
              Honor yourself, and let your confidence shine.
            </p>
            <p className="text-muted animate-on-scroll">
              Your period is a natural and beautiful part of your body’s cycle, a reminder that your body is strong and capable. It’s a perfect time to focus on self-care, listen to your needs, and nurture yourself. Each cycle brings a chance for renewal, reflection, and growth, helping you reconnect with your body and mind. Embrace this time as a symbol of resilience, empowerment, and the amazing rhythm of being a woman.</p>
          </div>
        </div>
      </section>

      {/* Facts Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center text-danger mb-4 animate-on-scroll">Interesting Facts</h2>
          <div className="row">
            {facts.map((fact, i) => (
              <div key={i} className="col-md-6 mb-4">
                <div className="p-4 border rounded-4 shadow-sm fact-card animate-on-scroll">
                  {fact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-5">
        <h2 className="fw-bold text-center text-danger mb-4 animate-on-scroll">What Our Users Say</h2>
        <div className="row">
          {testimonials.map((t, i) => {
            const images = [user1, user2, user3];
            const ratings = [5, 4, 5];
            return (
              <div key={i} className="col-md-4 mb-4">
                <div className="p-4 bg-light rounded-4 shadow-sm testimonial-card hover-fact animate-on-scroll">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={images[i]}
                      alt={t.name}
                      className="testimonial-img me-3 hover-zoom"
                    />
                    <div>
                      <h5 className="text-danger mb-0">{t.name}</h5>
                      <div className="rating">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={`star ${idx < ratings[i] ? "filled" : ""}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="fst-italic">"{t.text}"</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center text-danger mb-4 animate-on-scroll">FAQs</h2>
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, i) => (
              <div key={i} className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${openFAQ === i ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${openFAQ === i ? "show" : ""}`}
                >
                  <div className="accordion-body">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      

{/* Footer Section */}
<footer className="footer bg-danger text-white pt-5 pb-4 mt-5">
  <div className="container">
    <div className="row">

      {/* About */}
      <div className="col-md-4 mb-4">
        <h5 className="fw-bold">HerWellness</h5>
        <p>
          Empowering menstrual wellness with AI insights and personalized guidance.  
          Track, learn, and celebrate your body every day.
        </p>
      </div>

      {/* Quick Links */}
      <div className="col-md-4 mb-4">
        <h5 className="fw-bold">Quick Links</h5>
        <ul className="list-unstyled">
          <li><a href="#hero" className="text-white text-decoration-none">Home</a></li>
          <li><a href="#facts" className="text-white text-decoration-none">Facts</a></li>
          <li><a href="#testimonials" className="text-white text-decoration-none">Testimonials</a></li>
          <li><a href="#faqAccordion" className="text-white text-decoration-none">FAQs</a></li>
        </ul>
      </div>

      {/* Contact */}
      <div className="col-md-4 mb-4">
        <h5 className="fw-bold">Contact Us</h5>
        <p>Email: support@herwellness.com</p>
        <p>Phone: +91 123 456 7890</p>
        <div className="social-icons mt-2">
          <a href="#" className="text-white me-3"><FaTwitter /></a>
          <a href="#" className="text-white me-3"><FaFacebookF /></a>
          <a href="#" className="text-white"><FaInstagram /></a>
        </div>
      </div>

    </div>

    <hr className="border-top border-light" />

    <div className="text-center mt-3">
      <p className="mb-0">&copy; {new Date().getFullYear()} HerWellness. All rights reserved.</p>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Home;
