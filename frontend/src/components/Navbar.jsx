import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userEmail");

    setIsLoggedIn(false);

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">

      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-900"
        >

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            📈
          </span>

          SalesPredict

        </Link>


        {/* Navigation */}

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


        {/* Authentication */}

        <div className="flex items-center gap-3">

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
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

      </div>

    </header>
  );
}