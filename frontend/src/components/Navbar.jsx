import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    setIsMenuOpen(false);

    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">

      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-4 md:px-6">

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div className="flex items-center gap-3">

          {/* Hamburger */}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>


          {/* Logo */}

          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              📈
            </span>

            SalesPredict
          </Link>

        </div>


        {/* ==================================================
            RIGHT SIDE - AUTHENTICATION
        ================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">

          {!isLoggedIn ? (
            <>
              {/* Login */}

              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4"
              >
                Login
              </Link>


              {/* Register */}

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:px-5"
              >
                <span className="hidden sm:inline">
                  Get Started
                </span>

                <span className="sm:hidden">
                  Register
                </span>
              </Link>
            </>
          ) : (

            /* Logout */

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-5"
            >
              Logout
            </button>

          )}

        </div>

      </div>


      {/* ==================================================
          SIMPLE NAVIGATION MENU
      ================================================== */}

      {isMenuOpen && (

        <div className="border-t border-slate-100 bg-white shadow-lg">

          <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">

            <nav className="flex flex-col">

              {/* Home */}

              <Link
                to="/"
                onClick={closeMenu}
                className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                🏠 Home
              </Link>


              {/* New Prediction */}

              <a
                href="/#predict"
                onClick={closeMenu}
                className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                🔮 New Prediction
              </a>


              {/* Dashboard */}

              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  📊 Dashboard
                </Link>
              )}


              {/* Prediction History */}

              {isLoggedIn && (
                <Link
                  to="/history"
                  onClick={closeMenu}
                  className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  📋 Prediction History
                </Link>
              )}


              {/* Model Comparison */}

              {isLoggedIn && (
                <Link
                  to="/model-comparison"
                  onClick={closeMenu}
                  className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  🏆 Model Comparison
                </Link>
              )}


              {/* Store & Department Performance */}

              {isLoggedIn && (
                <Link
                  to="/performance"
                  onClick={closeMenu}
                  className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  📈 Store & Department Performance
                </Link>
              )}


              {/* About */}

              <a
                href="/#about"
                onClick={closeMenu}
                className="px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                ℹ️ About
              </a>

            </nav>

          </div>

        </div>

      )}

    </header>
  );
}