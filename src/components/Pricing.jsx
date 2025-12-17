import { useState } from "react";
import PricingCard from "./PricingCard";

export default function Pricing() {
  const [selected, setSelected] = useState("Pro"); // default selected

  return (
    <section className="py-24 bg-[#020617]">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Simple Pricing
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        <PricingCard
          title="Basic"
          price="99"
          features={[
            "Vehicle summary",
            "RC verification",
            "Ownership details",
          ]}
          selected={selected === "Basic"}
          onSelect={() => setSelected("Basic")}
        />

        <PricingCard
          title="Pro"
          price="199"
          features={[
            "Complete vehicle history",
            "Accident & theft check",
            "Inspection report",
            "Priority support",
          ]}
          popular
          selected={selected === "Pro"}
          onSelect={() => setSelected("Pro")}
        />

        <PricingCard
          title="Enterprise"
          price="499"
          features={[
            "Unlimited reports",
            "Bulk VIN lookup",
            "API access",
            "Dedicated support",
          ]}
          selected={selected === "Enterprise"}
          onSelect={() => setSelected("Enterprise")}
        />
      </div>
    </section>
  );
}
