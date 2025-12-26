import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold tracking-wide">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Auto Vera
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link
            to="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/book-inspection"
            className="hover:text-blue-400 transition"
          >
            Book Inspection
          </Link>

          <Link 
          to="/car-service"
           className="hover:text-blue-400 transition">
            Car Service
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-400 transition"
          >
            Contact
          </Link>

          <Link
            to="/pricing"
            className="hover:text-blue-400 transition"
          >
            Pricing
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          to="/result"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 
                     hover:from-blue-500 hover:to-cyan-400 
                     transition shadow-[0_0_25px_rgba(59,130,246,0.55)]
                     text-white text-sm font-semibold"
        >
          Get Report
        </Link>
      </div>
    </header>
  );
}
