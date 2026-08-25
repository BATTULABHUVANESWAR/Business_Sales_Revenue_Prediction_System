import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  getDashboardStats,
  getPredictionHistory,
} from "../services/api";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {

    const loadDashboard = async () => {

      const email = sessionStorage.getItem("userEmail");

      if (!email) {

        setError(
          "Please login to access your dashboard."
        );

        setLoading(false);

        return;
      }

      try {

        const [
          dashboardResponse,
          historyResponse,
        ] = await Promise.all([

          getDashboardStats(email),

          getPredictionHistory(email),

        ]);


        // ------------------------------------------------------
        // DASHBOARD STATS
        // ------------------------------------------------------

        if (dashboardResponse.success) {

          setStats(dashboardResponse);

        } else {

          setError(
            dashboardResponse.message ||
            "Unable to load dashboard."
          );

          return;
        }


        // ------------------------------------------------------
        // PREDICTION HISTORY
        // ------------------------------------------------------

        if (historyResponse.success) {

          setHistory(
            historyResponse.predictions || []
          );

        }

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

        setError(
          "Unable to connect to the Flask server."
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (value) => {

    return `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>

        </div>

      </main>

    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Unavailable
          </h1>

          <p className="mt-3 text-slate-500">
            {error}
          </p>

          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>

        </div>

      </main>

    );

  }


  const latest =
    stats?.latest_prediction;


  // ============================================================
  // PREPARE CHART DATA
  // ============================================================

  const chartData = [...history]
    .reverse()
    .slice(-10)
    .map((item, index) => ({

      // Unique X-axis value
      prediction: `P${index + 1}`,

      // Actual prediction date
      date: item.prediction_date,

      // Actual predicted sales
      sales: Number(
        item.predicted_sales
      ),

    }));


  // ============================================================
  // DASHBOARD
  // ============================================================

  return (

    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">

      <div className="mx-auto max-w-7xl">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8 sm:mb-10">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            SALES ANALYTICS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Monitor your sales prediction activity.
          </p>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">


          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-sm font-medium text-slate-500">
              Total Predictions
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stats?.total_predictions ?? 0}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Predictions generated
            </p>

          </div>


          {/* AVERAGE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-sm font-medium text-slate-500">
              Average Predicted Sales
            </p>

            <p className="mt-3 text-2xl font-bold text-blue-600 sm:text-3xl">
              {formatCurrency(
                stats?.average_sales
              )}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Average weekly sales
            </p>

          </div>


          {/* HIGHEST */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-sm font-medium text-slate-500">
              Highest Prediction
            </p>

            <p className="mt-3 text-2xl font-bold text-green-600 sm:text-3xl">
              {formatCurrency(
                stats?.highest_sales
              )}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Highest estimated sales
            </p>

          </div>

        </div>


        {/* ==================================================
            PREDICTION TREND
        ================================================== */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-8">


          {/* HEADER */}

          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                SALES TREND
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                Prediction Trend
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Track your predicted weekly sales over time.
              </p>

            </div>


            <p className="text-sm text-slate-400">

              {history.length} prediction
              {history.length !== 1 ? "s" : ""}

            </p>

          </div>


          {/* ==================================================
              RESPONSIVE CHART
          ================================================== */}

          {history.length >= 2 ? (

            <div className="mt-6 h-72 w-full sm:mt-8 sm:h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  {/* GRID */}

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />


                  {/* X AXIS */}

                  <XAxis
                    dataKey="prediction"
                    tick={{
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />


                  {/* Y AXIS */}

                  <YAxis
                    tick={{
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={55}
                    tickFormatter={(value) =>
                      `₹${(
                        Number(value) / 1000
                      ).toFixed(0)}K`
                    }
                  />


                  {/* TOOLTIP */}

                  <Tooltip
                    content={({
                      active,
                      payload,
                    }) => {

                      if (
                        !active ||
                        !payload ||
                        payload.length === 0
                      ) {

                        return null;

                      }

                      const point =
                        payload[0].payload;

                      return (

                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">

                          <p className="text-xs font-medium text-slate-400">
                            {point.prediction}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Date: {point.date}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-blue-600">
                            Sales: {formatCurrency(
                              point.sales
                            )}
                          </p>

                        </div>

                      );

                    }}
                  />


                  {/* LINE */}

                  <Line
                    type="monotone"
                    dataKey="sales"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="mt-8 flex h-64 items-center justify-center rounded-2xl bg-slate-50">

              <div className="text-center">

                <div className="text-4xl">
                  📈
                </div>

                <p className="mt-3 font-semibold text-slate-700">
                  Not enough data yet
                </p>

                <p className="mt-1 px-4 text-sm text-slate-400">
                  Make at least two predictions to see your sales trend.
                </p>

              </div>

            </div>

          )}

        </div>


        {/* ==================================================
            LATEST PREDICTION
        ================================================== */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                LATEST PREDICTION
              </p>


              {latest ? (

                <>

                  <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                    {formatCurrency(
                      latest.predicted_sales
                    )}
                  </h2>


                  <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">

                    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                      Store {latest.store}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                      Dept {latest.department}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">
                      {latest.prediction_date}
                    </span>

                  </div>

                </>

              ) : (

                <>

                  <h2 className="mt-3 text-2xl font-bold text-slate-900">
                    No predictions yet
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Make your first prediction to see it here.
                  </p>

                </>

              )}

            </div>


            <Link
              to="/history"
              className="rounded-xl border border-slate-200 px-6 py-3 text-center font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
            >
              View History
            </Link>

          </div>

        </div>


        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2">


          {/* NEW PREDICTION */}

          <a
            href="/#predict"
            className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md sm:p-7"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  New Prediction
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter business details and generate a new weekly sales forecast.
                </p>

              </div>

              <span className="shrink-0 text-2xl text-blue-600 transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </a>


          {/* HISTORY */}

          <Link
            to="/history"
            className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md sm:p-7"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Prediction History
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review all your previously generated sales predictions.
                </p>

              </div>

              <span className="shrink-0 text-2xl text-blue-600 transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </Link>

        </div>

        {/* ==================================================
          BACK TO HOME
          ================================================== */}

          <div className="mt-8 flex justify-center">

            <Link
              to="/"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            >
                ← Back to Home
            </Link>

          </div>

      </div>

    </main>

  );
}