import { useEffect, useState } from "react";
import { getModelComparison } from "../services/api";
import { Link } from "react-router-dom";


export default function ModelComparison() {

  const [models, setModels] = useState([]);
  const [bestModel, setBestModel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadModelComparison = async () => {

      try {

        const result = await getModelComparison();

        if (result.success) {

          setModels(result.models || []);
          setBestModel(result.best_model || "");

        } else {

          setError(
            result.message ||
            "Unable to load model comparison."
          );

        }

      } catch (err) {

        console.error(
          "Model comparison error:",
          err
        );

        setError(
          "Unable to load model comparison."
        );

      } finally {

        setLoading(false);

      }

    };

    loadModelComparison();

  }, []);


  return (

    <main className="min-h-screen bg-slate-50 px-6 py-12">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Machine Learning
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Model Comparison
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Comparison of the machine-learning and deep-learning
            models evaluated for weekly sales forecasting.
          </p>

        </div>


        {/* Best Model */}

        {!loading && bestModel && (

          <div className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <p className="text-sm font-medium text-blue-600">
              Selected Production Model
            </p>

            <div className="mt-2 flex items-center gap-3">

              <span className="text-3xl">
                🏆
              </span>

              <h2 className="text-2xl font-bold text-slate-900">
                {bestModel}
              </h2>

            </div>

            <p className="mt-2 text-sm text-slate-600">
              Selected based on overall test-set performance.
            </p>

          </div>

        )}


        {/* Loading */}

        {loading && (

          <div className="flex min-h-64 items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-400">
                Loading model performance...
              </p>

            </div>

          </div>

        )}


        {/* Error */}

        {!loading && error && (

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>

        )}


        {/* Comparison Table */}

        {!loading && !error && (

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Model
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                      R² Score
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                      MAE
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                      RMSE
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {models.map((model, index) => {

                    const isBest =
                      model.model === bestModel;

                    return (

                      <tr
                        key={model.model}
                        className="border-b border-slate-100 last:border-0"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <span className="text-sm font-medium text-slate-400">
                              #{index + 1}
                            </span>

                            <span className="font-semibold text-slate-800">
                              {model.model}
                            </span>

                          </div>

                        </td>


                        <td className="px-6 py-5 text-right">

                          <span className="font-bold text-slate-900">

                            {(Number(model.R2) * 100).toFixed(2)}%

                          </span>

                        </td>


                        <td className="px-6 py-5 text-right text-slate-600">

                          ₹{Number(model.MAE).toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}

                        </td>


                        <td className="px-6 py-5 text-right text-slate-600">

                          ₹{Number(model.RMSE).toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}

                        </td>


                        <td className="px-6 py-5 text-center">

                          {isBest ? (

                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                              Selected
                            </span>

                          ) : (

                            <span className="text-xs text-slate-400">
                              Evaluated
                            </span>

                          )}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* Explanation */}

        {!loading && !error && models.length > 0 && (

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Model Selection
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              Multiple models were evaluated using MAE, RMSE,
              and R². Higher R² and lower MAE/RMSE indicate
              better predictive performance. The model with
              the strongest overall performance was selected
              for the production prediction system.

            </p>

          </div>

        )}

      </div>

      {/* ==================================================
            FOOTER ACTIONS
        ================================================== */}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

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

    </main>

  );
}