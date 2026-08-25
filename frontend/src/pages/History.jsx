import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPredictionHistory } from "../services/api";

export default function History() {
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FILTER STATES
  // ==================================================

  const [storeFilter, setStoreFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // ==================================================
  // LOAD HISTORY
  // ==================================================

  useEffect(() => {
    const loadHistory = async () => {
      const isLoggedIn =
        sessionStorage.getItem("isLoggedIn");

      const email =
        sessionStorage.getItem("userEmail");

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
  // UNIQUE STORES
  // ==================================================

  const stores = useMemo(() => {
    return [
      ...new Set(
        predictions
          .map((prediction) => prediction.store)
          .filter(
            (store) =>
              store !== null &&
              store !== undefined &&
              store !== ""
          )
      ),
    ].sort((a, b) => Number(a) - Number(b));
  }, [predictions]);

  // ==================================================
  // UNIQUE DEPARTMENTS
  // ==================================================

  const departments = useMemo(() => {
    return [
      ...new Set(
        predictions
          .map(
            (prediction) =>
              prediction.department
          )
          .filter(
            (department) =>
              department !== null &&
              department !== undefined &&
              department !== ""
          )
      ),
    ].sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [predictions]);

  // ==================================================
  // FILTER PREDICTIONS
  // ==================================================

  const filteredPredictions = useMemo(() => {
    return predictions.filter(
      (prediction) => {

        const matchesStore =
          storeFilter === "all" ||
          String(prediction.store) ===
            String(storeFilter);

        const matchesDepartment =
          departmentFilter === "all" ||
          String(
            prediction.department
          ) === String(departmentFilter);

        const matchesDate =
          !dateFilter ||
          String(
            prediction.prediction_date || ""
          ).startsWith(dateFilter);

        return (
          matchesStore &&
          matchesDepartment &&
          matchesDate
        );
      }
    );
  }, [
    predictions,
    storeFilter,
    departmentFilter,
    dateFilter,
  ]);

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const clearFilters = () => {
    setStoreFilter("all");
    setDepartmentFilter("all");
    setDateFilter("");
  };

  const filtersActive =
    storeFilter !== "all" ||
    departmentFilter !== "all" ||
    dateFilter !== "";

  // ==================================================
  // OVERALL STATISTICS
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

  const highestSales =
    predictions.length > 0
      ? Math.max(
          ...predictions.map(
            (prediction) =>
              Number(
                prediction.predicted_sales || 0
              )
          )
        )
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

          {/* HIGHEST */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Highest Prediction
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {predictions.length > 0
                ? formatCurrency(
                    highestSales
                  )
                : "—"}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Highest predicted weekly sales
            </p>

          </div>

        </div>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5">

            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

              <div>

                <h2 className="font-bold text-slate-900">
                  Filter Predictions
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Narrow your history by store, department, or date.
                </p>

              </div>

              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-fit rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              )}

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              {/* STORE */}

              <div>

                <label
                  htmlFor="store-filter"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Store
                </label>

                <select
                  id="store-filter"
                  value={storeFilter}
                  onChange={(event) =>
                    setStoreFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >

                  <option value="all">
                    All Stores
                  </option>

                  {stores.map((store) => (
                    <option
                      key={store}
                      value={store}
                    >
                      Store {store}
                    </option>
                  ))}

                </select>

              </div>

              {/* DEPARTMENT */}

              <div>

                <label
                  htmlFor="department-filter"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Department
                </label>

                <select
                  id="department-filter"
                  value={departmentFilter}
                  onChange={(event) =>
                    setDepartmentFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >

                  <option value="all">
                    All Departments
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        Department {department}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* DATE */}

              <div>

                <label
                  htmlFor="date-filter"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Prediction Date
                </label>

                <input
                  id="date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(event) =>
                    setDateFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

              <div>

                <h2 className="font-bold text-slate-900">
                  Prediction Records
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {filtersActive
                    ? `Showing ${filteredPredictions.length} of ${predictions.length} matching predictions`
                    : "Your actual prediction records"}
                </p>

              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {filteredPredictions.length} record
                {filteredPredictions.length !== 1
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

          ) : filteredPredictions.length === 0 ? (

            /* ==================================================
               NO FILTER RESULTS
            ================================================== */

            <div className="p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🔎
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No matching predictions
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No prediction records match the
                selected filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>

            </div>

          ) : (

            /* ==================================================
               TABLE
            ================================================== */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px] text-left">

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

                <tbody className="divide-y divide-slate-100">

                  {filteredPredictions.map(
                    (prediction) => (

                      <tr
                        key={prediction.id}
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