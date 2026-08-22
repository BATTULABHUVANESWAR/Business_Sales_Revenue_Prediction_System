import { useState } from "react";
import { predictSales } from "../services/api";

export default function PredictionForm() {
  const [formData, setFormData] = useState({
    store: "",
    department: "",
    prediction_date: "",
    holiday: "0",
    markdown1: "",
    markdown2: "",
    markdown3: "",
    markdown4: "",
    markdown5: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // --------------------------------------------------
  // HANDLE INPUT CHANGES
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // HANDLE PREDICTION
  // --------------------------------------------------

 const handleSubmit = async (event) => {
  event.preventDefault();

  const userEmail = sessionStorage.getItem("userEmail");

  if (!userEmail) {
    alert("Please login before making a prediction.");
    return;
  }

  setLoading(true);
  setResult(null);

  try {
    const response = await predictSales({
      email: userEmail,

      store: formData.store,
      department: formData.department,
      prediction_date: formData.prediction_date,

      holiday: Number(formData.holiday),

      markdown1: Number(formData.markdown1 || 0),
      markdown2: Number(formData.markdown2 || 0),
      markdown3: Number(formData.markdown3 || 0),
      markdown4: Number(formData.markdown4 || 0),
      markdown5: Number(formData.markdown5 || 0),
    });

    if (response.success) {
      setResult(response);
    } else {
      alert(response.message);
    }

  } catch (error) {
    console.error("Prediction error:", error);

    alert(
      "Unable to connect to the Flask server. Please make sure the backend is running."
    );

  } finally {
    setLoading(false);
  }
};
  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <section
      id="predict"
      className="bg-slate-50 px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="mb-12 text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            SALES PREDICTION
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Predict Weekly Sales
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Provide a few business details and let our machine
            learning model estimate future weekly sales.
          </p>

        </div>


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10"
        >

          {/* Business Details */}
          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Business Details
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select the information required for your prediction.
            </p>

          </div>


          <div className="mt-7 grid gap-6 md:grid-cols-2">

            {/* Store */}
            <div>

              <label
                htmlFor="store"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Store
              </label>

              <input
                id="store"
                type="number"
                name="store"
                min="1"
                value={formData.store}
                onChange={handleChange}
                placeholder="Enter store number"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>


            {/* Department */}
            <div>

              <label
                htmlFor="department"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Department
              </label>

              <input
                id="department"
                type="number"
                name="department"
                min="1"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department number"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>


            {/* Prediction Date */}
            <div>

              <label
                htmlFor="prediction_date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Prediction Date
              </label>

              <input
                id="prediction_date"
                type="date"
                name="prediction_date"
                value={formData.prediction_date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

            </div>


            {/* Holiday */}
            <div>

              <label
                htmlFor="holiday"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Holiday
              </label>

              <select
                id="holiday"
                name="holiday"
                value={formData.holiday}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >

                <option value="0">
                  No
                </option>

                <option value="1">
                  Yes
                </option>

              </select>

            </div>

          </div>


          {/* Promotion Details */}
          <div className="mt-10 border-t border-slate-100 pt-8">

            <h3 className="text-xl font-bold text-slate-900">
              Promotion Details
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Optional. Leave blank if no markdown information is available.
            </p>


            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3, 4, 5].map((number) => (

                <div key={number}>

                  <label
                    htmlFor={`markdown${number}`}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Markdown {number}
                  </label>

                  <input
                    id={`markdown${number}`}
                    type="number"
                    step="any"
                    min="0"
                    name={`markdown${number}`}
                    value={formData[`markdown${number}`]}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              ))}

            </div>

          </div>


          {/* Submit */}
          <div className="mt-10 border-t border-slate-100 pt-8 text-center">

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "Generating Prediction..."
                : "Predict Weekly Sales →"}

            </button>

          </div>


          {/* Prediction Result */}
          {result && (

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Prediction Result
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-900">
                ₹
                {Number(
                  result.prediction
                ).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Estimated Weekly Sales
              </p>

            </div>

          )}

        </form>

      </div>
    </section>
  );
}