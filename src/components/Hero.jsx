// import { motion } from "framer-motion";
// import heroBg from "../assets/hero-bg-blue.png";

// export default function Hero() {
//   return (
//     <section
//       className="relative min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: `url(${heroBg})` }}
//     >
//       {/* Dark overlay for readability */}
//       <div className="absolute inset-0 bg-[#020617]/80" />

//       {/* Blue glow shadow */}
//       <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

//       <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">

//         <motion.h1
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-4xl md:text-6xl font-extrabold"
//         >
//           Know Your Vehicle
//           <span className="text-blue-400"> Instantly</span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="mt-6 max-w-2xl mx-auto text-gray-300 text-lg"
//         >
//           Trusted vehicle history, ownership records, and verification reports
//           powered by intelligent automotive data.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.7 }}
//           className="mt-10 flex justify-center gap-4"
//         >
//           <button className="px-8 py-3 rounded-xl bg-blue-500 text-black font-semibold hover:bg-blue-600 transition">
//             Check Vehicle
//           </button>

//           <button className="px-8 py-3 rounded-xl border border-blue-400/40 hover:border-blue-400 transition">
//             View Sample
//           </button>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
import { motion } from "framer-motion";
import heroBg from "../assets/hero-bg.png";


export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <img
        src={heroBg}
        alt="Vehicle verification technology"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark + Blue Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/80 to-[#020617]"></div>

      {/* Blue Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Know Your Car.
          <span className="text-blue-400"> Instantly.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-300 text-lg"
        >
          Instantly access vehicle history, RC verification,
          ownership details and fraud checks — before you buy.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-10 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 transition"
        >
          Check Vehicle Now
        </motion.button>

      </div>
    </section>
  );
}
