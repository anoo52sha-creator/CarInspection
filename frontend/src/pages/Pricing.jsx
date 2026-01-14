export default function Pricing() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">
        Simple, Transparent Pricing
      </h2>
      <p className="text-center text-gray-400 mb-12">
        Pay only when you need detailed vehicle reports
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <Plan
          title="Free"
          price="₹0"
          features={[
            "Basic vehicle validation",
            "Limited searches",
            "No downloadable report",
          ]}
        />

        <Plan
          title="Pro"
          price="₹99 / report"
          highlight
          features={[
            "Full vehicle report",
            "Ownership & fuel details",
            "Instant results",
            "PDF download",
          ]}
        />

        <Plan
          title="Business"
          price="₹999 / month"
          features={[
            "Unlimited searches",
            "Priority processing",
            "Commercial usage",
            "Support access",
          ]}
        />
      </div>
    </section>
  );
}

function Plan({ title, price, features, highlight }) {
  return (
    <div
      className={`rounded-2xl p-8 border backdrop-blur-xl ${
        highlight
          ? "bg-blue-500/10 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
          : "bg-white/10 border-white/20"
      }`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-6">{price}</p>

      <ul className="space-y-3 text-sm text-gray-300 mb-8">
        {features.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-xl transition ${
          highlight
            ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
            : "border border-white/20 hover:bg-white/10"
        }`}
      >
        Choose Plan
      </button>
    </div>
  );
}
