import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Components
import Navbar from "./components/Navbar";
import PredictionForm from "./components/PredictionForm";
import About from "./components/About";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ModelComparison from "./pages/ModelComparison";
import Performance from "./pages/Performance";

// API
import {
  getModelMetrics,
  getSalesTrend,
} from "./services/api";


// ============================================================
// HOME PAGE
// ============================================================

function Home() {

  const [metrics, setMetrics] = useState(null);

  const [salesTrend, setSalesTrend] = useState([]);

  const [homeLoading, setHomeLoading] = useState(true);


  // ============================================================
  // LOAD HOME PAGE DATA
  // ============================================================

  useEffect(() => {

    const loadHomeData = async () => {

      try {

        const [
          metricsResponse,
          trendResponse,
        ] = await Promise.all([

          getModelMetrics(),

          getSalesTrend(),

        ]);


        // ------------------------------------------------------
        // MODEL METRICS
        // ------------------------------------------------------

        if (metricsResponse.success) {

          setMetrics(metricsResponse);

        } else {

          console.error(
            "Model metrics error:",
            metricsResponse.message
          );

        }


        // ------------------------------------------------------
        // SALES TREND
        // ------------------------------------------------------

        if (trendResponse.success) {

          setSalesTrend(
            trendResponse.sales || []
          );

        } else {

          console.error(
            "Sales trend error:",
            trendResponse.message
          );

        }

      } catch (error) {

        console.error(
          "Failed to load home data:",
          error
        );

      } finally {

        setHomeLoading(false);

      }

    };


    loadHomeData();

  }, []);


  // ============================================================
  // HOME UI
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />


      <main id="home">


        {/* ==================================================
            HERO SECTION
        ================================================== */}

        <section className="relative overflow-hidden bg-white">

          <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-6 py-12 sm:py-16lg:grid-cols-2 lg:gap-20 lg:py-20">


            {/* ==================================================
                LEFT CONTENT
            ================================================== */}

            <div>


              {/* Badge */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <span className="text-sm font-semibold text-blue-700">

                  MACHINE LEARNING • SALES FORECASTING

                </span>

              </div>


              {/* Heading */}

              <h1 className="mx-auto max-w-3xl text-center text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">

                Predict Your

                <span className="block text-blue-600">

                  Future Sales

                </span>

              </h1>


              {/* Description */}

              <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-500">

                Turn historical sales data into meaningful
                predictions and make smarter business
                decisions with machine learning.

              </p>


              {/* Buttons */}

              <div className="mt-8 flex flex-wrap justify-center gap-4">

                <a
                  href="#predict"
                  className="rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >

                  Start Prediction →

                </a>


                <a
                  href="#about"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >

                  Learn More

                </a>

              </div>


              {/* ==================================================
                  REAL MODEL STATISTICS
              ================================================== */}

              <div className="mt-12 flex flex-wrap gap-10">


                {/* R2 */}

                <div>

                  <p className="text-2xl font-bold text-slate-900">

                    {metrics

                      ? `${(
                          Number(metrics.r2) * 100
                        ).toFixed(2)}%`

                      : "—"

                    }

                  </p>


                  <p className="text-sm text-slate-500">

                    R² Score

                  </p>

                </div>


                {/* MODELS */}

                <div>

                  <p className="text-2xl font-bold text-slate-900">

                    {metrics?.models_compared ?? "—"}

                  </p>


                  <p className="text-sm text-slate-500">

                    Models Compared

                  </p>

                </div>


                {/* RECORDS */}

                <div>

                  <p className="text-2xl font-bold text-slate-900">

                    {metrics

                      ? Number(
                          metrics.total_rows
                        ).toLocaleString("en-IN")

                      : "—"

                    }

                  </p>


                  <p className="text-sm text-slate-500">

                    Sales Records

                  </p>

                </div>


              </div>

            </div>


            {/* ==================================================
                RIGHT SIDE — GRAPH CARD
            ================================================== */}

            <div className="relative block">


              {/* Background Glow */}

              <div className="absolute -inset-10 rounded-full bg-blue-100/50 blur-3xl" />


              {/* Card */}

              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60">


                {/* ==================================================
                    GRAPH HEADER
                ================================================== */}

                <div className="mb-6 flex items-center justify-between">


                  <div>

                    <p className="text-sm font-medium text-slate-500">

                      Historical Sales Trend

                    </p>


                    <p className="mt-1 text-3xl font-bold text-slate-900">

                      Weekly Sales

                    </p>

                  </div>


                  {/* Best Model */}

                  <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">

                    {metrics

                      ? `R² ${(
                          Number(metrics.r2) * 100
                        ).toFixed(2)}%`

                      : "Loading..."

                    }

                  </div>

                </div>


                {/* ==================================================
                    GRAPH
                ================================================== */}

                <div className="h-64 w-full rounded-2xl bg-slate-50 p-3 sm:p-4">


                  {salesTrend.length > 0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <LineChart
                        data={salesTrend.slice(-52)}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 0,
                          bottom: 0,
                        }}
                      >


                        {/* Grid */}

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />


                        {/* X Axis */}

                        <XAxis
                          dataKey="date"
                          tick={{
                            fontSize: 11,
                          }}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={30}
                        />


                        {/* Y Axis */}

                        <YAxis
                          tick={{
                            fontSize: 11,
                          }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) =>
                            `₹${(
                              value / 1000000
                            ).toFixed(0)}M`
                          }
                        />


                        {/* Tooltip */}

                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(
                              value
                            ).toLocaleString(
                              "en-IN",
                              {
                                maximumFractionDigits: 0,
                              }
                            )}`
                          }
                        />


                        {/* Sales Line */}

                        <Line
                          type="monotone"
                          dataKey="sales"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{
                            r: 5,
                          }}
                        />

                      </LineChart>

                    </ResponsiveContainer>

                  ) : (

                    <div className="flex h-full items-center justify-center">

                      <div className="text-center">

                        {homeLoading ? (

                          <>
                            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                            <p className="mt-3 text-sm text-slate-400">

                              Loading historical sales...

                            </p>
                          </>

                        ) : (

                          <p className="text-sm text-slate-400">

                            Historical sales data unavailable.

                          </p>

                        )}

                      </div>

                    </div>

                  )}

                </div>


                {/* ==================================================
                    GRAPH FOOTER
                ================================================== */}

                <div className="mt-5 flex items-center justify-between">

                  <div>

                    <p className="text-xs text-slate-400">

                      Historical Data

                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-600">

                      Latest 52 Weeks

                    </p>

                  </div>


                  <div className="text-right">

                    <p className="text-xs text-slate-400">

                      Best Model

                    </p>

                    <p className="mt-1 text-sm font-semibold text-blue-600">

                      {metrics?.best_model || "Loading..."}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            PREDICTION
        ================================================== */}

        <PredictionForm />


        {/* ==================================================
            ABOUT
        ================================================== */}

        <About />


      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />

    </div>

  );
}


// ============================================================
// APP / ROUTING
// ============================================================

export default function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            PROTECTED ROUTES
        ================================================== */}

        <Route element={<ProtectedRoute />}>


          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/model-comparison"
            element={<ModelComparison />}
          />

          <Route
            path="/performance"
            element={<Performance />}
          />


        </Route>


        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route
          path="*"
          element={<Home />}
        />


      </Routes>

    </BrowserRouter>

  );
}