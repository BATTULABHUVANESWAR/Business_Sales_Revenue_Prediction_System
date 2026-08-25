import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPerformance } from "../services/api";

export default function Performance() {
  const navigate = useNavigate();

  const [performance, setPerformance] = useState({
    stores: [],
    departments: [],
  });

  const [activeTab, setActiveTab] = useState("stores");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // LOAD PERFORMANCE DATA
  // ==================================================

  useEffect(() => {
    const loadPerformance = async () => {
      const isLoggedIn =
        sessionStorage.getItem("isLoggedIn");

      const email =
        sessionStorage.getItem("userEmail");

      if (isLoggedIn !== "true" || !email) {
        setError(
          "Please login to view performance data."
        );

        setLoading(false);
        return;
      }

      try {
        const response =
          await getPerformance(email);

        if (response.success) {
          setPerformance({
            stores: response.stores || [],
            departments:
              response.departments || [],
          });
        } else {
          setError(
            response.message ||
              "Unable to load performance data."
          );
        }

      } catch (error) {
        console.error(
          "Performance loading error:",
          error
        );

        setError(
          "Unable to connect to the Flask server."
        );

      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, []);

  // ==================================================
  // ACTIVE DATA
  // ==================================================

  const activeData =
    activeTab === "stores"
      ? performance.stores
      : performance.departments;

  // ==================================================
  // TOP PERFORMER
  // ==================================================

  const topPerformer = useMemo(() => {
    if (activeData.length === 0) {
      return null;
    }

    return activeData[0];
  }, [activeData]);

  // ==================================================
  // TOTAL PREDICTED SALES
  // ==================================================

  const totalSales = useMemo(() => {
    return activeData.reduce(
      (total, item) =>
        total +
        Number(item.total_sales || 0),
      0
    );
  }, [activeData]);

  // ==================================================
  // FORMAT CURRENCY
  // ==================================================

  const formatCurrency = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading performance data...
          </p>

        </div>

      </main>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Performance Unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Login
          </button>

        </div>

      </main>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            PERFORMANCE ANALYSIS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Store & Department Performance
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Analyze predicted sales across stores
            and departments using your prediction
            history.
          </p>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              {activeTab === "stores"
                ? "Stores Analyzed"
                : "Departments Analyzed"}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {activeData.length}
            </p>

          </div>


          {/* TOP */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Top {activeTab === "stores"
                ? "Store"
                : "Department"}
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">

              {topPerformer
                ? activeTab === "stores"
                  ? `Store ${topPerformer.store}`
                  : `Dept ${topPerformer.department}`
                : "—"}

            </p>

          </div>


          {/* SALES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Predicted Sales
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(totalSales)}
            </p>

          </div>

        </div>


        {/* ==================================================
            TABS
        ================================================== */}

        <div className="mt-8 flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">

          <button
            type="button"
            onClick={() =>
              setActiveTab("stores")
            }
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "stores"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Store Performance
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("departments")
            }
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === "departments"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Department Performance
          </button>

        </div>


        {/* ==================================================
            PERFORMANCE TABLE
        ================================================== */}

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <h2 className="font-bold text-slate-900">
              {activeTab === "stores"
                ? "Store Performance"
                : "Department Performance"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Ranked by total predicted sales
            </p>

          </div>


          {activeData.length === 0 ? (

            <div className="p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                📊
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No performance data
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Make some predictions to see
                performance analysis here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Rank
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {activeTab === "stores"
                        ? "Store"
                        : "Department"}
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Predictions
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Average Sales
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Sales
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Highest
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {activeData.map(
                    (item, index) => (

                      <tr
                        key={
                          activeTab === "stores"
                            ? item.store
                            : item.department
                        }
                        className="transition hover:bg-slate-50"
                      >

                        {/* RANK */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {index + 1}
                          </span>

                        </td>


                        {/* NAME */}

                        <td className="px-6 py-5 font-semibold text-slate-800">

                          {activeTab === "stores"
                            ? `Store ${item.store}`
                            : `Department ${item.department}`}

                        </td>


                        {/* COUNT */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {item.prediction_count}
                        </td>


                        {/* AVERAGE */}

                        <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                          {formatCurrency(
                            item.average_sales
                          )}
                        </td>


                        {/* TOTAL */}

                        <td className="px-6 py-5 text-sm font-bold text-slate-900">
                          {formatCurrency(
                            item.total_sales
                          )}
                        </td>


                        {/* HIGHEST */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatCurrency(
                            item.highest_sales
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div className="mt-8 flex flex-wrap justify-center gap-3">

          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Back to Dashboard
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            🏠 Home
          </Link>

          <a
            href="/#predict"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            + New Prediction
          </a>

        </div>

      </div>

    </main>
  );
}