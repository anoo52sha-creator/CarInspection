import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-400/40 shadow-lg"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-blue-500/0 group-hover:bg-blue-500/10 blur-xl transition"></div>

      <div className="relative z-10">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mb-4">
          <Icon size={24} />
        </div>

        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-gray-400 text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
