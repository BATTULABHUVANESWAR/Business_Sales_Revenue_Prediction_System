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

      {/* =========================
          MAIN NAVBAR
      ========================== */}

      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-4 md:px-6">

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


        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <nav className="hidden items-center gap-7 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Home
          </Link>

          <a
            href="/#predict"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Predict
          </a>

          <a
            href="/#about"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </a>

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                to="/history"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                History
              </Link>
            </>
          )}

        </nav>


        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="flex items-center gap-2">

          {/* Desktop Authentication */}

          <div className="hidden items-center gap-3 sm:flex">

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            )}

          </div>


          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>

        </div>

      </div>


      {/* =========================
          MOBILE NAVIGATION
      ========================== */}

      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-sm md:hidden">

          <nav className="flex flex-col gap-1">

            {/* Home */}

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Home
            </Link>


            {/* Predict */}

            <a
              href="/#predict"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Predict
            </a>


            {/* About */}

            <a
              href="/#about"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              About
            </a>


            {/* Dashboard + History */}

            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Dashboard
                </Link>

                <Link
                  to="/history"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  History
                </Link>
              </>
            )}


            {/* Mobile Authentication */}

            <div className="mt-3 border-t border-slate-100 pt-3">

              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    Get Started
                  </Link>

                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              )}

            </div>

          </nav>

        </div>
      )}

    </header>
  );
}