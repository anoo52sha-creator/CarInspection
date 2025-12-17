import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#020617]/70 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
          Auto<span className="text-blue-400">Vera</span>
        </h1>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a className="hover:text-white">Home</a>
          <a className="hover:text-white">Services</a>
          <a className="hover:text-white">Pricing</a>
          <a className="hover:text-white">Contact</a>
        </div>

        <button className="px-4 py-2 rounded-lg bg-blue-500 text-black font-semibold hover:bg-blue-600 transition">
          Get Report
        </button>
      </div>
    </motion.nav>
  );
}
