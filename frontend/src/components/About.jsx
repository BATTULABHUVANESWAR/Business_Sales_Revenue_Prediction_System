export default function About() {
  const steps = [
    {
      number: "01",
      title: "Enter Business Details",
      description:
        "Select the store, department, prediction date, holiday status, and optional promotion details.",
    },
    {
      number: "02",
      title: "Analyze Historical Data",
      description:
        "FourSight uses historical sales patterns and relevant business factors to prepare the prediction data.",
    },
    {
      number: "03",
      title: "Machine Learning",
      description:
        "The trained Random Forest model analyzes the prepared features and estimates weekly sales.",
    },
    {
      number: "04",
      title: "Get Your Prediction",
      description:
        "View the estimated weekly sales and use the result to support better business decisions.",
    },
  ];

  return (
    <section id="about" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            From Business Data to Sales Prediction
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            FourSight combines historical sales data, feature engineering,
            and machine learning to estimate future weekly sales.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-600">
                  {step.number}
                </span>

                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technology */}
        <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                TECHNOLOGY
              </p>

              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                Built with Data & Machine Learning
              </h3>

              <p className="mt-3 max-w-xl leading-7 text-slate-500">
                The system combines data preprocessing, exploratory data
                analysis, feature engineering, and regression models to
                build the sales prediction pipeline.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              {[
                "Python",
                "Pandas",
                "NumPy",
                "Scikit-learn",
                "Random Forest",
                "XGBoost",
                "Flask",
                "React",
                "Tailwind CSS",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}