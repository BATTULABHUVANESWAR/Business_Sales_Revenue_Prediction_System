export default function PredictionResult() {
  return (
    <section className="bg-slate-50 px-6 pb-24">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-xl shadow-slate-200/50 md:p-10">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            📊
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-widest text-blue-600">
            Prediction Result
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Estimated Weekly Sales
          </h2>

          <div className="my-6">
            <p className="text-5xl font-bold tracking-tight text-blue-600">
              ₹1,39,426
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Estimated sales for the selected store and period
            </p>
          </div>

          <div className="mx-auto grid max-w-lg grid-cols-2 gap-4 text-left md:grid-cols-3">

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Store
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Store 1
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Department
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Department 1
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">
                Prediction Date
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                12 Dec 2012
              </p>
            </div>

          </div>

          <button
            type="button"
            className="mt-8 rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
          >
            Make Another Prediction
          </button>

        </div>

      </div>
    </section>
  );
}