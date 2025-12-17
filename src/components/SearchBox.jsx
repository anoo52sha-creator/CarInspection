// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";

// export default function SearchBox() {
//   const [value, setValue] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleSearch = () => {
//     if (!value.trim()) {
//       setError("Please enter a vehicle number or VIN");
//       return;
//     }

//     setError("");
//     setLoading(true);
//     setResult(null);

//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       setResult({
//         vehicle: value,
//         status: "Verified",
//         owner: "1st Owner",
//       });
//     }, 2000);
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-16">

//       {/* Search Box */}
//       <div className="flex flex-col md:flex-row gap-4 bg-[#020617] border border-gray-800 rounded-2xl p-4 shadow-lg">

//         <input
//           type="text"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder="Enter Vehicle Number or VIN"
//           className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 px-4 py-3 rounded-xl border border-gray-700 focus:border-emerald-400 input-glow"
//         />

//         <motion.button
//           whileHover={!loading ? { scale: 1.05 } : {}}
//           whileTap={!loading ? { scale: 0.95 } : {}}
//           onClick={handleSearch}
//           disabled={loading}
//           className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-3 rounded-xl transition disabled:opacity-50"
//         >
//           {loading ? "Searching..." : "Search"}
//         </motion.button>
//       </div>

//       {/* Error */}
//       {error && (
//         <p className="text-red-400 mt-3 text-sm text-left">
//           {error}
//         </p>
//       )}

//       {/* Result */}
//       <AnimatePresence>
//         {result && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.4 }}
//             className="mt-6 bg-[#020617] border border-gray-800 rounded-2xl p-6 text-left"
//           >
//             <h4 className="text-emerald-400 font-semibold text-lg">
//               Vehicle Verified ✅
//             </h4>

//             <p className="mt-2 text-gray-400">
//               Vehicle: <span className="text-white">{result.vehicle}</span>
//             </p>
//             <p className="text-gray-400">
//               Owner Status: <span className="text-white">{result.owner}</span>
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function SearchBox() {
  return (
    <section className="relative z-20 -mt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">

          <p className="text-center text-gray-300 mb-4">
            Enter your Vehicle Number or VIN
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Eg: KA01AB1234 or 1HGCM82633A004352"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#020617] text-white placeholder-gray-400 outline-none border border-white/10 focus:border-blue-400 transition"
              />
            </div>

            <button className="px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition shadow-lg shadow-blue-500/30">
              Get Report
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            🔒 Secure & Confidential Vehicle Lookup
          </p>

        </div>
      </motion.div>
    </section>
  );
}

