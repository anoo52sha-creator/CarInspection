import { motion } from "framer-motion";

export default function ServiceCard({ title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-[#020617] border border-gray-800 rounded-2xl p-8 text-left shadow-lg hover:border-emerald-400 transition"
    >
      <h4 className="text-xl font-semibold text-emerald-400">
        {title}
      </h4>

      <p className="mt-4 text-gray-400">
        {desc}
      </p>
    </motion.div>
  );
}
