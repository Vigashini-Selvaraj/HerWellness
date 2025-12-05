import React, { useState } from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";

export default function Navbar({ currentUser, setCurrentUser }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [navbarOpen, setNavbarOpen] = useState(false); // track collapse state

  const resetLoginFields = () => {
    setLoginEmail("");
    setLoginPassword("");
  };

  const resetRegisterFields = () => {
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirmPassword("");
  };

  const toggleNavbar = () => setNavbarOpen(!navbarOpen);

  const closeNavbar = () => setNavbarOpen(false); // close when link clicked

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email: loginEmail, password: loginPassword });
      if (response.error) return alert(response.error);

      setCurrentUser(response.user);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      resetLoginFields();

      const modalEl = document.getElementById("loginModal");
      Modal.getInstance(modalEl)?.hide();
      alert(response.message);
    } catch {
      alert("Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) return alert("Passwords do not match!");

    const response = await registerUser({ name: regName, email: regEmail, password: regPassword });
    if (response.error) return alert(response.error);

    resetRegisterFields();

    const modalEl = document.getElementById("registerModal");
    Modal.getInstance(modalEl)?.hide();
    alert(response.message);
  };

  const openLoginModal = () => {
    resetLoginFields();
    resetRegisterFields();
    const modalEl = document.getElementById("loginModal");
    new Modal(modalEl, { backdrop: "static" }).show();
  };

  const openRegisterModal = () => {
    resetLoginFields();
    resetRegisterFields();
    const modalEl = document.getElementById("registerModal");
    new Modal(modalEl, { backdrop: "static" }).show();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-red-navbar fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">HerWellness</Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar} // manually toggle
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-2"><Link className="nav-link" to="/home" onClick={closeNavbar}>Home</Link></li>
              <li className="nav-item mx-2"><Link className="nav-link" to="/today" onClick={closeNavbar}>Today</Link></li>
              <li className="nav-item mx-2"><Link className="nav-link" to="/insights" onClick={closeNavbar}>Insights</Link></li>
              <li className="nav-item mx-2"><Link className="nav-link" to="/chat" onClick={closeNavbar}>Chat</Link></li>
              <li className="nav-item mx-2"><Link className="nav-link" to="/calendar" onClick={closeNavbar}>Calendar</Link></li>

              <li className="nav-item mx-2">
                {currentUser ? (
                  <button className="btn btn-red" onClick={() => {handleLogout(); closeNavbar();}}>Logout</button>
                ) : (
                  <button type="button" className="btn btn-red" onClick={() => {openLoginModal(); closeNavbar();}}>Log In</button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <div className="modal fade" id="loginModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title">Log In</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter email"
                    required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="Enter password"
                    required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-red">Login</button>
              </form>
            </div>

            <div className="modal-footer border-0 justify-content-center">
              <small>
                Don’t have an account?{" "}
                <a href="#" onClick={() => { Modal.getInstance(document.getElementById("loginModal"))?.hide(); openRegisterModal(); }}>Register</a>
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div className="modal fade" id="registerModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4 rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title">Register</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" placeholder="Enter name"
                    required value={regName} onChange={(e) => setRegName(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter email"
                    required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="Create password"
                    required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" placeholder="Confirm password"
                    required value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-red">Register</button>
              </form>
            </div>

            <div className="modal-footer border-0 justify-content-center">
              <small>
                Already have an account?{" "}
                <a href="#" onClick={() => { Modal.getInstance(document.getElementById("registerModal"))?.hide(); openLoginModal(); }}>Login</a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
