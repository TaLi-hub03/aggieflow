import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <Link to="/" className="landing-logo">
            <img src="/logoClear.png" alt="Aggie Flow" />
          </Link>
          <span className="landing-title">Aggie Flow</span>
        </div>

        <nav className="landing-nav">
          <Link to="#" className="landing-nav-link" hidden>
            Page
          </Link>
          <Link to="#" className="landing-nav-link" hidden>
            Page
          </Link>
          <button className="landing-login" onClick={() => navigate("/dashboard")}> 
            Log in
          </button>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-copy">
          <h1 className="landing-heading">
            Smart organization, built for Aggie&apos;s,
            <br /> designed to turn student projects into real impact.
          </h1>
          <p className="landing-subtitle">
            A collaborative project management platform designed specifically for North Carolina A&T students. The platform helps teams organize tasks, track deadlines, and manage responsibilities across class projects, research teams, and student organizations. By bringing planning, communication, and progress tracking into one place, Helping Aggie move from ideas to finished projects with clarity and accountability.
          </p>

          <div className="landing-actions">
            <button className="btn primary" onClick={() => navigate("/dashboard")}>
              Start organizing
            </button>
            <button className="btn secondary">Learn more</button>
          </div>
        </div>

        {/* <div className="landing-mockups">
          <div className="mockup mockup-dashboard">
            <div className="mockup-window">
              <div className="window-bar">
                <span className="window-circle window-circle-red" />
                <span className="window-circle window-circle-yellow" />
                <span className="window-circle window-circle-green" />
              </div>
              <div className="mockup-content">
                <img
                  src="/images/TaskPage.png"
                  alt="Task page mockup"
                  className="mockup-image"
                />
              </div>
            </div>
          </div>

          <div className="mockup mockup-calendar">
            <div className="mockup-window">
              <div className="window-bar">
                <span className="window-circle window-circle-red" />
                <span className="window-circle window-circle-yellow" />
                <span className="window-circle window-circle-green" />
              </div>
              <div className="mockup-content">
                <img
                  src="/images/Calander.png"
                  alt="Calendar mockup"
                  className="mockup-image"
                />
              </div>
            </div>
          </div>
        </div> */}
      </main>

      <section className="landing-transition-mockup">
        <div className="mockup mockup-transition">
          <div className="mockup-window">
            <div className="window-bar">
              <span className="window-circle window-circle-red" />
              <span className="window-circle window-circle-yellow" />
              <span className="window-circle window-circle-green" />
            </div>
            <div className="mockup-content">
              <img
                src="/images/TaskPage.png"
                alt="Task page mockup"
                className="mockup-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-next-section">
        <div className="landing-next-container">
          <h2 className="landing-next-heading">
            Everything Aggie teams need to stay organized
          </h2>

          <div className="landing-next-body">
            <div className="landing-next-copy">
            <div className="landing-next-item">
              <h3>Plan projects with clarity</h3>
              <p>
                Create projects, assign responsibilities, and organize tasks in
                one shared workspace.
              </p>
            </div>

            <div className="landing-next-item">
              <h3>Collaborate without confusion</h3>
              <p>
                Keep your team aligned with shared task lists, progress
                tracking, and member roles.
              </p>
            </div>

            <div className="landing-next-item">
              <h3>Track progress and stay accountable</h3>
              <p>
                Monitor deadlines, workloads, and project completion in real
                time.
              </p>
            </div>

            <div className="landing-next-actions">
              <button
                className="btn primary landing-next-btn-primary"
                onClick={() => navigate("/dashboard")}
              >
                Start organizing
              </button>
              <button className="btn secondary landing-next-btn-secondary">
                Learn more
              </button>
            </div>

            </div>

            <div
              className="landing-calendar-holder"
              aria-label="Calendar mockup"
            >
              <img
                src="/images/Calander.png"
                alt="Calendar mockup"
                className="landing-calendar-image"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} Aggie Flow</span>
      </footer>
    </div>
  );
}
