export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 px-6 py-10 text-slate-400">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-white">
              FourSight
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6">
              Business Sales & Revenue Prediction System powered by
              machine learning.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm">
            <a
              href="#home"
              className="transition hover:text-white"
            >
              Home
            </a>

            <a
              href="#predict"
              className="transition hover:text-white"
            >
              Predict
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs md:text-left">
          © {new Date().getFullYear()} FourSight. Machine Learning Capstone Project.
        </div>

      </div>
    </footer>
  );
}