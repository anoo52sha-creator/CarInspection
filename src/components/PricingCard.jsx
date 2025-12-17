import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingCard({
  title,
  price,
  features,
  popular,
  selected,
  onSelect,
}) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -12, scale: 1.04 }}
      className={`relative cursor-pointer rounded-2xl p-8 border backdrop-blur-xl transition-all duration-300
        ${
          selected
            ? "bg-blue-500/15 border-blue-400 shadow-2xl shadow-blue-500/40"
            : "bg-white/5 border-white/10 hover:border-blue-400/60"
        }
      `}
    >
      {/* Blue glow when selected */}
      {selected && (
        <div className="absolute inset-0 -z-10 rounded-2xl bg-blue-500/20 blur-2xl" />
      )}

      {popular && (
        <span className="absolute top-4 right-4 text-xs bg-blue-500 text-black px-3 py-1 rounded-full font-semibold">
          MOST POPULAR
        </span>
      )}

      <h3 className="text-xl font-bold text-white">{title}</h3>

      <p className="mt-4 text-4xl font-extrabold text-blue-400">
        ₹{price}
        <span className="text-sm text-gray-400 font-medium"> / report</span>
      </p>

      <ul className="mt-6 space-y-3 text-gray-300 text-sm">
        {features.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="text-blue-400" size={18} />
            {item}
          </li>
        ))}
      </ul>

      <button
        className={`mt-8 w-full py-3 rounded-xl font-semibold transition
          ${
            selected
              ? "bg-blue-500 text-black shadow-lg shadow-blue-500/40"
              : "border border-white/20 hover:border-blue-400"
          }
        `}
      >
        Get Started
      </button>
    </motion.div>
  );
}
