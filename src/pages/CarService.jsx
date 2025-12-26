export default function CarService() {
  return (
    <>
      {/* HERO */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Get Your <span className="text-blue-400">Mobile Car Serviced</span> Without Leaving Home
            </h1>


            <p className="mt-6 text-gray-400 max-w-xl">
              Enjoy hassle-free, expert mobile car service right at your
              doorstep—whether you are at home, the office, or anywhere in UAE.
            </p>

            <ul className="mt-6 space-y-3 text-gray-300">
              {[
                "Fully Equipped Mobile Technicians",
                "On-Site Car Servicing Anywhere in UAE",
                "Garage-Quality Service at Your Doorstep",
                "Dedicated Service Manager & Free Advisory Call",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-blue-400">✔</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-6">
              {/* <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg">
                Book Our Service Now
              </button> */}
              <button
                onClick={() => {
                  document.getElementById("faq")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg"
              >
                Book Our Service Now
              </button>

              <div className="text-sm text-gray-400">
                ⭐⭐⭐⭐⭐ 5.0 <br />
                Call us on <span className="text-blue-400">800-24325</span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              src="/mobile-car-service.png"
              alt="Mobile Car Service"
              className="max-w-full"
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-950">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white">
        Our <span className="text-blue-400">Mobile Car Services</span> in Dubai
      </h2>
      <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
        Premium doorstep car servicing delivered by certified professionals
      </p>
    </div>

    {/* Services Grid */}
    <div className="grid md:grid-cols-3 gap-8">

      {[
        {
          icon: "🛢️",
          title: "Oil & Filter Change",
          desc: "High-quality engine oil and filter replacement at your doorstep."
        },
        {
          icon: "🔋",
          title: "Battery Replacement",
          desc: "Battery testing, jump-start, and replacement with warranty support."
        },
        {
          icon: "🧰",
          title: "General Car Service",
          desc: "Complete multi-point inspection for smooth and safe driving."
        },
        {
          icon: "🖥️",
          title: "Computer Diagnostics",
          desc: "Advanced diagnostic scan to detect hidden vehicle issues early."
        },
        {
          icon: "🛞",
          title: "Brakes & Suspension",
          desc: "Brake pads, discs, and suspension inspection for maximum safety."
        },
        {
          icon: "🧼",
          title: "Car Wash & Detailing",
          desc: "Exterior wash and interior cleaning without visiting a garage."
        }
      ].map((service, index) => (
        <div
          key={index}
          className="bg-slate-900/70 backdrop-blur rounded-2xl p-6 
                     border border-blue-500/20
                     hover:border-blue-400
                     hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]
                     transition"
        >
          <div className="text-blue-400 text-3xl mb-4">
            {service.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            {service.title}
          </h3>
          <p className="text-gray-400">
            {service.desc}
          </p>
        </div>
      ))}

    </div>

    {/* CTA */}
    <div className="text-center mt-20">
      <a
        href="/book-inspection"
        className="inline-block px-12 py-4 rounded-xl 
                   bg-blue-600 text-white font-semibold text-lg
                   hover:bg-blue-500 transition 
                   shadow-[0_0_40px_rgba(59,130,246,0.6)]"
      >
        Book Mobile Car Service
      </a>
      <p className="mt-5 text-gray-400">
        Call us anytime:{" "}
        <span className="font-semibold text-blue-400">800-24325</span>
      </p>
    </div>

  </div>
</section>

<section className="py-24 px-6 bg-slate-900">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-4xl font-bold text-white leading-snug">
        Comprehensive Home{" "}
        <span className="text-blue-400">Car Service in Dubai</span>
      </h2>

      <p className="mt-6 text-gray-400 leading-relaxed">
        At CheckAnyCar, we know that convenience matters just as much as quality
        when it comes to car care. That’s why our{" "}
        <span className="text-blue-400 font-medium">
          home car service Dubai
        </span>{" "}
        is designed to give you the best of both worlds.
      </p>

      <p className="mt-4 text-gray-400 leading-relaxed">
        Instead of taking time out of your schedule to drive across the city,
        wait in queues, and deal with the uncertainty of traditional garages, we
        bring the workshop directly to you. Our team handles a wide range of
        services, all carried out by certified professionals using advanced
        equipment and genuine parts.
      </p>

      <p className="mt-4 text-gray-400 leading-relaxed">
        We’ve built our service model around one simple idea:{" "}
        <span className="text-white font-semibold">
          you shouldn’t have to choose between convenience and quality.
        </span>{" "}
        With CheckAnyCar, your car gets expert attention at your doorstep, and
        you get to carry on with your day uninterrupted.
      </p>

      <button 
          onClick={() => window.location.href = "/contact"}
          className="mt-8 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg">
          Contact Us
      </button>
      
    </div>

    {/* RIGHT IMAGE */}
    <div className="relative">
      <img
        src="/book-inspection.png"
        alt="Home Car Service Dubai"
        className="rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.35)]"
      />
    </div>

  </div>
</section>
{/* MINOR SERVICE PACKAGES */}
<section className="py-24 px-6 bg-slate-950">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white">
        Our Minor Mobile{" "}
        <span className="text-blue-400">Car Service Packages</span> in UAE
      </h2>
      <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
        Every car has unique needs, and so do our customers. At CheckAnyCar,
        we’ve designed minor car service packages in UAE to suit different
        requirements with professional doorstep care.
      </p>
    </div>

    {/* Packages */}
    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          title: "Basic Minor Car Service Package in UAE",
          desc:
            "Our basic minor service package covers all the essentials, including oil change, filter replacements, brake checks, and fluid top-ups—perfect for everyday reliability and preventive maintenance.",
          icon: "🧰",
        },
        {
          title: "Premium Car Servicing at Home Dubai",
          desc:
            "For those who want more detailed care, our premium package includes extended checks, system diagnostics, and part replacements with full transparency and professional reporting.",
          icon: "🚐",
        },
        {
          title: "Specialized Services",
          desc:
            "Some cars need extra care. From hybrid systems to advanced diagnostics, our specialized services are handled by experts trained in both modern and older vehicle models.",
          icon: "⚙️",
        },
      ].map((pkg, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-blue-500/20 rounded-2xl p-8 
                     hover:border-blue-400 hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] transition"
        >
          <div className="text-4xl mb-4">{pkg.icon}</div>
          <h3 className="text-xl font-semibold text-white mb-4">
            {pkg.title}
          </h3>
          <p className="text-gray-400 leading-relaxed">
            {pkg.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* SERVICE AREAS */}
<section className="py-24 px-6 bg-slate-900">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

    {/* LEFT */}
    <div>
      <h2 className="text-4xl font-bold text-white">
        Service Areas{" "}
        <span className="text-blue-400">Mobile Car Service Coverage</span>
      </h2>

      <p className="mt-6 text-gray-400 leading-relaxed">
        CheckAnyCar proudly serves customers across Dubai with our mobile car
        service. Our team covers key locations to ensure timely support wherever
        you are.
      </p>

      <ul className="mt-6 space-y-3 text-gray-300">
        {[
          "Dubai Marina",
          "Downtown Dubai",
          "Jumeirah",
          "Business Bay",
          "Al Barsha",
          "Deira",
        ].map((area, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="text-blue-400">✔</span>
            {area}
          </li>
        ))}
      </ul>

      <button 
      onClick={() => window.location.href = "/book-inspection"}
      className="mt-8 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg">
        Book Inspection Now
      </button>
     
      <p className="mt-4 text-sm text-gray-400">
        ⭐⭐⭐⭐⭐ 5.0 Rated Mobile Car Service in Dubai
      </p>
    </div>

    {/* RIGHT IMAGE */}
    <div>
      <img
        src="/Mobile_Car_Service_Areas_Dubai.png"
        alt="Mobile Car Service Areas Dubai"
        className="rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.35)]"
      />
    </div>

  </div>
</section>
{/* PROCESS WORKS */}
<section className="py-24 px-6 bg-slate-950">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white">
        How Our Home Car Service in Dubai{" "}
        <span className="text-blue-400">Process Works</span>
      </h2>
      <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
        We keep our process straightforward because we respect your time.
        Here’s how our doorstep car service works.
      </p>
    </div>

    {/* Steps */}
    <div className="grid md:grid-cols-5 gap-8">
      {[
        {
          title: "Book Your Service",
          desc: "Choose a convenient slot through our website or by contacting us directly.",
          icon: "📅",
        },
        {
          title: "We Arrive at Your Location",
          desc: "Our mobile unit arrives fully equipped with tools and required parts.",
          icon: "🚐",
        },
        {
          title: "Service Carried Out",
          desc: "From minor services to premium care, everything is done with full transparency.",
          icon: "🧰",
        },
        {
          title: "Inspection Report Shared",
          desc: "We explain the work completed and provide recommendations for future care.",
          icon: "📊",
        },
        {
          title: "Drive Worry-Free",
          desc: "Your car is ready to go—no workshop visits, no stress.",
          icon: "✅",
        },
      ].map((step, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-blue-500/20 rounded-2xl p-6 
                     hover:border-blue-400 hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] transition"
        >
          <div className="text-4xl mb-4">{step.icon}</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* EXPERT TIPS */}
<section className="py-24 px-6 bg-slate-900">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

    {/* LEFT */}
    <div>
      <h2 className="text-4xl font-bold text-white">
        Expert Tips &{" "}
        <span className="text-blue-400">Car Care Resources</span> for Mobile Car
        Service in Dubai
      </h2>

      <p className="mt-6 text-gray-400 leading-relaxed">
        At CheckAnyCar, we don’t just service your car—we guide you on how to
        maintain it between visits. From regular oil changes and tire pressure
        checks to understanding warning lights, our expert tips help extend the
        life of your vehicle.
      </p>

      <p className="mt-4 text-gray-400 leading-relaxed">
        We also share insights on handling Dubai’s extreme heat, maintaining
        battery health, and preparing your car for year-round reliability.
        Our goal is to empower you with knowledge so your car stays dependable
        all year.
      </p>
    </div>

    {/* RIGHT IMAGE */}
    <div>
      <img
        src="/ppi-process.jpg"
        alt="Expert Car Care Advice"
        className="rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.35)]"
      />
    </div>
  </div>
</section>

{/* ZERO STRESS SERVICES */}
<section className="py-24 px-6 bg-slate-950">
  <div className="max-w-7xl mx-auto">

    <div className="text-center mb-14">
      <h2 className="text-4xl font-bold text-white">
        Get{" "}
        <span className="text-blue-400">Zero-Stress Services</span> at Doorstep
      </h2>
      <p className="mt-4 text-gray-400">
        Our minor mobile car service packages are designed to fit your budget
        and schedule.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-gray-300">
      {[
        "Oil & Filter Change",
        "AC Filter Check & Cleaning",
        "Battery Health Test",
        "Brake Health Check",
        "Computer Diagnostic Check",
        "Suspension & Visual Check",
        "Tire Condition Check",
        "Coolant Check & Top-Up",
        "Electrical System Check",
        "Underbody Leak Inspection",
        "Light Function Check",
        "Monthly Advisory Call",
        "Car Wash & Vacuum",
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-slate-900 
                     border border-blue-500/20 rounded-xl px-4 py-3"
        >
          <span className="text-blue-400">✔</span>
          <span className="text-sm">{item}</span>
        </div>
      ))}
    </div>
  </div>
</section>

{/* WHY CHOOSE US */}
<section className="py-24 px-6 bg-slate-950">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

    {/* IMAGE */}
    <div>
      <img
        src="/doorstep-inspection.png"
        alt="Doorstep Car Inspection"
        className="rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.35)]"
      />
    </div>

    {/* CONTENT */}
    <div>
      <h2 className="text-4xl font-bold text-white mb-6">
        Why Choose Our Doorstep{" "}
        <span className="text-blue-400">Car Servicing in UAE</span>
      </h2>

      <p className="text-gray-400 mb-6">
        CheckAnyCar isn’t just another car service provider — we are your trusted
        partner in vehicle care. Here’s why customers rely on us:
      </p>

      <ul className="space-y-4 text-gray-300">
        {[
          "Convenience you can count on – servicing at your home or office.",
          "Qualified professionals – experienced technicians you can trust.",
          "Transparent process – clear costs, honest advice, detailed reports.",
          "Coverage across Dubai – we reach you without delay.",
          "Customer-first approach – we listen, advise, and empower you.",
        ].map((point, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-blue-400 mt-1">✔</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-gray-400">
        When you choose CheckAnyCar, you’re not just booking a service — you’re
        investing in a smoother, safer driving experience.
      </p>
    </div>
  </div>
</section>

{/* BOOK NOW CTA */}
<section className="py-28 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
  <div className="max-w-4xl mx-auto text-center">

    <h2 className="text-4xl font-bold text-white">
      Book Your Mobile Car Service Now{" "}
      <span className="text-blue-400">& Pay Later</span>
    </h2>

    <p className="mt-6 text-gray-400">
      Service your car wherever you are. 
    </p>
    <p className="mt-6 text-gray-400">
        Your car deserves professional care, and you deserve peace of mind. With CheckAnyCar, you get both—delivered straight to your doorstep. We make sure every vehicle receives expert attention. Book your home car service in Dubai today and let CheckAnyCar keep you moving with confidence. We also provide pre-delivery inspection in dubai.
    </p>

    {/* PRICE */}
    <div className="mt-10">
      <p className="text-gray-400 line-through text-lg">Starts from AED 399</p>
      <p className="text-6xl font-bold text-blue-400 mt-2">
        199 <span className="text-xl text-gray-400">AED</span>
      </p>
      <p className="text-sm text-gray-500 mt-1">*Conditions apply</p>
    </div>

    {/* COUNTDOWN */}
    <div className="mt-10 flex justify-center gap-4">
      {["3 Days", "23 Hrs", "43 Min", "12 Sec"].map((time, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-blue-500/30 rounded-xl px-5 py-3 text-white"
        >
          {time}
        </div>
      ))}
    </div>

    {/* CTA BUTTON */}
    <div className="mt-12">
      <a
        href="tel:800-24325"
        className="inline-block bg-blue-500 hover:bg-blue-600 
                   text-white font-semibold px-10 py-4 rounded-xl 
                   shadow-[0_0_30px_rgba(59,130,246,0.6)] transition"
      >
        CALL US ON 800-24325
      </a>
    </div>

    {/* PAY LATER */}
    <p className="mt-6 text-gray-400 text-sm">
      Split your yearly contract into{" "}
      <span className="text-blue-400 font-semibold">
        12 interest-free EMI payments
      </span>
    </p>
  </div>
</section>
{/* FAQ SECTION */}
<section id="faq" className="py-24 bg-slate-950 px-6">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-4xl font-bold text-white text-center mb-12">
      Frequently Asked{" "}
      <span className="text-blue-400">Questions</span>
    </h2>

    <div className="space-y-4">
      {[
        {
          q: "How much does mobile car service in Dubai cost?",
          a: "Our prices depend on the service package and car type, but we keep costs transparent and competitive. You’ll always know the full price before we begin.",
        },
        {
          q: "What is included in the minor car service package UAE?",
          a: "Minor car service includes oil change, filter replacement, fluid top-ups, brake checks, battery health test, and general vehicle inspection.",
        },
        {
          q: "How quickly can you reach my location for doorstep car service UAE?",
          a: "We typically reach your location within the scheduled time slot. Same-day service is available in most Dubai areas.",
        },
        {
          q: "Do you provide car servicing at home Dubai for all car brands?",
          a: "Yes, we service most major car brands including sedans, SUVs, luxury, and hybrid vehicles.",
        },
        {
          q: "Is mobile car service as reliable as workshop service?",
          a: "Absolutely. Our certified technicians use advanced tools and genuine parts, delivering workshop-quality service at your doorstep.",
        },
      ].map((item, index) => (
        <details
          key={index}
          className="group bg-slate-900 border border-blue-500/30 rounded-xl px-6 py-5"
        >
          <summary className="flex justify-between items-center cursor-pointer list-none">
            <span className="text-white font-medium">
              {item.q}
            </span>
            <span className="text-blue-400 text-2xl group-open:rotate-45 transition">
              +
            </span>
          </summary>

          <p className="mt-4 text-gray-400">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>

    </>
  );
}
