import FeatureCard from "./FeatureCard";
import { ShieldCheck, FileSearch, Car, AlertTriangle } from "lucide-react";

export default function Features() {
  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto">

      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Why choose <span className="text-blue-400">AutoSurely</span>?
        </h2>
        <p className="mt-4 text-gray-400">
          Make smarter vehicle decisions with accurate, verified and
          up-to-date automotive intelligence.
        </p>
      </div>

      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={Car}
          title="Complete Vehicle History"
          desc="Ownership details, previous usage, and vehicle lifecycle records."
        />

        <FeatureCard
          icon={ShieldCheck}
          title="RC & Ownership Verification"
          desc="Instant verification of registration and ownership authenticity."
        />

        <FeatureCard
          icon={FileSearch}
          title="Inspection & Condition Report"
          desc="Professional condition checks to avoid hidden damage or fraud."
        />

        <FeatureCard
          icon={AlertTriangle}
          title="Fraud & Risk Alerts"
          desc="Detect theft records, blacklisting, and accident flags early."
        />
      </div>
    </section>
  );
}
