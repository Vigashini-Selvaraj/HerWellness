// src/components/Home.jsx
// src/components/Home.jsx
import React from "react";
import "./Home.css"; // You can move your CSS from the HTML page here
import heroImg from "../assets/fin.jpg"; // Make sure this path is correct

export default function Home() {
  return (
    <section className="hero d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Side */}
          <div className="col-lg-6 text-lg-start text-center">
            <h5 className="highlight-text">HerWellness App: Tracking Your Cycle</h5>
            <h1 className="hero-title">
              Your cycle is so much more<br /> than your period
            </h1>
            <p className="hero-desc">
              It can affect everything — from your mood to your energy levels and sex drive. 
              The good news is that understanding the connection between your cycle and your life 
              is more straightforward than you might think.
            </p>
          </div>

          {/* Right Side */}
          <div className="col-lg-6 text-center">
            <img src={heroImg} alt="App Preview" className="img-fluid rounded shadow" />
          </div>

        </div>
      </div>
    </section>
  );
}



