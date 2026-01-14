import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Vehicle History",
    desc: "Complete ownership and accident history in seconds.",
  },
  {
    title: "RC Verification",
    desc: "Instant registration and authenticity checks.",
  },
  {
    title: "Inspection Report",
    desc: "Professional condition assessment before you buy.",
  },
];

export default function Services() {
  return (
    <section className="bg-[#020617] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-white"
        >
          Our Services
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              desc={service.desc}
              delay={index * 0.2}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
