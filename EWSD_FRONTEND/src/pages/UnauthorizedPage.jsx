import React from "react";
import { Link } from "react-router-dom";
import { LuLock, LuHouse, LuLogIn } from "react-icons/lu";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:wght@400;500&display=swap');

  .unauth-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #f8fafc;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .unauth-root::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: rgba(245,124,0,0.06);
    pointer-events: none;
  }

  .unauth-root::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: rgba(30,58,138,0.05);
    pointer-events: none;
  }

  .unauth-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .unauth-icon-wrap {
    width: 72px; height: 72px;
    background: rgba(245,124,0,0.08);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    border: 1.5px solid rgba(245,124,0,0.2);
  }

  .unauth-card h1 {
    font-family: 'Lora', serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 10px;
  }

  .unauth-card p {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.7;
    margin-bottom: 28px;
  }

  .unauth-divider {
    width: 40px;
    height: 3px;
    background: #f57c00;
    border-radius: 2px;
    margin: 0 auto 24px;
  }

  .unauth-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  @media (min-width: 480px) {
    .unauth-actions { flex-direction: row; justify-content: center; }
  }

  .unauth-btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 22px;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    transition: all 0.18s;
  }
  .unauth-btn-outline:hover {
    border-color: #1e3a8a;
    color: #1e3a8a;
  }

  .unauth-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 22px;
    border-radius: 8px;
    border: none;
    background: #1e3a8a;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    transition: background 0.18s;
  }
  .unauth-btn-primary:hover { background: #172554; }

  .unauth-footer {
    margin-top: 24px;
    font-size: 0.78rem;
    color: #9ca3af;
  }

  .unauth-footer a {
    color: #f57c00;
    text-decoration: none;
    font-weight: 500;
  }
  .unauth-footer a:hover { text-decoration: underline; }

  .unauth-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 32px;
    text-decoration: none;
  }

  .unauth-brand-icon {
    width: 26px; height: 26px;
    background: #1e3a8a;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }

  .unauth-brand-text {
    font-family: 'Lora', serif;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .unauth-brand-uni  { color: #1e3a8a; }
  .unauth-brand-mag  { color: #f57c00; }
`;

export default function UnauthorizedPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="unauth-root">
        <div className="unauth-card">

          {/* Brand */}
          <Link to="/" className="unauth-brand">
            <div className="unauth-brand-icon">
              <svg fill="none" height="14" viewBox="0 0 32 32" width="14">
                <path clipRule="evenodd" d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z" fill="white" fillRule="evenodd" />
              </svg>
            </div>
            <span className="unauth-brand-text">
              <span className="unauth-brand-uni">Uni</span>
              <span className="unauth-brand-mag">Magazine</span>
            </span>
          </Link>

          {/* Icon */}
          <div className="unauth-icon-wrap">
            <LuLock size={28} style={{ color: "#f57c00" }} />
          </div>

          <div className="unauth-divider" />

          <h1>Access Denied</h1>
          <p>
            You don't have permission to view this page. Please sign in with an
            account that has the required access level.
          </p>

          <div className="unauth-actions">
            <Link to="/" className="unauth-btn-outline">
              <LuHouse size={14} />
              Go to Home
            </Link>
            <Link to="/login" className="unauth-btn-primary">
              <LuLogIn size={14} />
              Sign In
            </Link>
          </div>

          <p className="unauth-footer">
            Think this is a mistake?{" "}
            <a href="mailto:support@university.edu">Contact support</a>
          </p>
        </div>
      </div>
    </>
  );
}