// src/components/Navbar.jsx
import React from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";

export default function Navbar({ currentUser, setCurrentUser }) {
  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = e.target[0].value;
      const password = e.target[1].value;

      const response = await loginUser({ email, password });

      if (response.error) {
        alert(response.error);
        return;
      }

      const user = response.user; // { name, email, password, _id }

      // Hide modal
      const modalEl = document.getElementById("loginModal");
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
     

      // Update state
      setTimeout(() => {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert(response.message); // "Login successful"
      }, 100);
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const name = e.target[0].value;
      const email = e.target[1].value;
      const password = e.target[2].value;
      const confirmPassword = e.target[3].value;

      if (password !== confirmPassword) return alert("Passwords do not match");

      const response = await registerUser({ name, email, password });

      if (response.error) {
        alert(response.error);
        return;
      }

      // Hide modal
      const modalEl = document.getElementById("registerModal");
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
     

      setTimeout(() => {
        alert(response.message); // "User registered successfully"
      }, 100);
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-red-navbar fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            HerWellness
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/today">
                  Today
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/insights">
                  Insights
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/chat">
                  Chat
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/calendar">
                  Calendar
                </Link>
              </li>
              <li className="nav-item mx-2">
                {currentUser ? (
                  <button className="btn btn-red" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <button
                    className="btn btn-red"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                  >
                    Log In
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title">Log In</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-red">
                  Login
                </button>
              </form>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <small>
                Don’t have an account?{" "}
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#registerModal"
                  data-bs-dismiss="modal"
                >
                  Register
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div
        className="modal fade"
        id="registerModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title">Register</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-red">
                  Register
                </button>
              </form>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <small>
                Already have an account?{" "}
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                  data-bs-dismiss="modal"
                >
                  Login
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
