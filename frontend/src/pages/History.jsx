import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPredictionHistory } from "../services/api";

export default function History() {
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // LOAD HISTORY
  // ==================================================

  useEffect(() => {
    const loadHistory = async () => {
      const isLoggedIn =
        sessionStorage.getItem("isLoggedIn");

      const email =
        sessionStorage.getItem("userEmail");

      // ------------------------------------------------
      // LOGIN CHECK
      // ------------------------------------------------

      if (isLoggedIn !== "true" || !email) {
        setError(
          "Please login to view your prediction history."
        );

        setLoading(false);

        return;
      }

      try {
        const response =
          await getPredictionHistory(email);

        if (response.success) {
          setPredictions(
            response.predictions || []
          );
        } else {
          setError(
            response.message ||
            "Unable to load prediction history."
          );
        }

      } catch (error) {

        console.error(
          "Failed to load prediction history:",
          error
        );

        setError(
          "Unable to connect to the Flask server."
        );

      } finally {

        setLoading(false);

      }
    };

    loadHistory();

  }, []);


  // ==================================================
  // CALCULATE AVERAGE
  // ==================================================

  const averageSales =
    predictions.length > 0
      ? predictions.reduce(
          (total, prediction) =>
            total +
            Number(
              prediction.predicted_sales || 0
            ),
          0
        ) / predictions.length
      : 0;


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
            Loading prediction history...
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
            History Unavailable
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
  // UI
  // ==================================================

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">

      <div className="mx-auto max-w-7xl">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              PREDICTION HISTORY
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Your Predictions
            </h1>

            <p className="mt-2 text-slate-500">
              Review your previous business sales predictions.
            </p>

          </div>


          <a
            href="/#predict"
            className="w-fit rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            + New Prediction
          </a>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">


          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Predictions
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {predictions.length}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Predictions generated
            </p>

          </div>


          {/* LATEST */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Latest Prediction
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">

              {predictions.length > 0
                ? formatCurrency(
                    predictions[0]
                      .predicted_sales
                  )
                : "—"}

            </p>

            <p className="mt-2 text-xs text-slate-400">
              Most recent forecast
            </p>

          </div>


          {/* AVERAGE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Average Predicted Sales
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">

              {predictions.length > 0
                ? formatCurrency(
                    averageSales
                  )
                : "—"}

            </p>

            <p className="mt-2 text-xs text-slate-400">
              Average weekly sales
            </p>

          </div>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


          {/* TABLE HEADER */}

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Recent Predictions
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your actual prediction records
                </p>

              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {predictions.length} record
                {predictions.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

          </div>


          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {predictions.length === 0 ? (

            <div className="p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                📈
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No predictions yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You haven't generated any sales
                predictions yet. Make your first
                prediction and it will appear here.
              </p>

              <a
                href="/#predict"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Make Your First Prediction
              </a>

            </div>

          ) : (

            /* ==================================================
               TABLE
            ================================================== */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px] text-left">


                {/* HEADER */}

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Store
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Predicted Sales
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>


                {/* BODY */}

                <tbody className="divide-y divide-slate-100">

                  {predictions.map(
                    (prediction) => (

                      <tr
                        key={
                          prediction.id
                        }
                        className="transition hover:bg-slate-50"
                      >


                        {/* DATE */}

                        <td className="px-6 py-5 text-sm text-slate-600">

                          {prediction.prediction_date}

                        </td>


                        {/* STORE */}

                        <td className="px-6 py-5 text-sm font-medium text-slate-800">

                          Store{" "}
                          {prediction.store}

                        </td>


                        {/* DEPARTMENT */}

                        <td className="px-6 py-5 text-sm text-slate-600">

                          Dept{" "}
                          {prediction.department}

                        </td>


                        {/* SALES */}

                        <td className="px-6 py-5 text-sm font-bold text-slate-900">

                          {formatCurrency(
                            prediction.predicted_sales
                          )}

                        </td>


                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">

                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                            Completed

                          </span>

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
            FOOTER ACTION
        ================================================== */}

        <div className="mt-8 flex justify-center">

          <Link
            to="/dashboard"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </div>

    </main>
  );
}