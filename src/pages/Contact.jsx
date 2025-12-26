export default function Contact() {
  return (
    <section className="min-h-screen bg-slate-950 px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Contact
          </span>{" "}
          Us
        </h1>

        <p className="mt-4 text-center text-gray-400 max-w-2xl mx-auto">
          We’re here to help. Reach out to us for inspections, bookings, or any queries.
        </p>

        {/* Content */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">

          {/* MAP */}
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-blue-500/20">
            <iframe
              title="Micrologic Integrated Location"
              src="https://www.google.com/maps?q=Micrologic%20Integrated%20Systems%20Dubai&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>

          {/* DETAILS */}
          <div className="bg-slate-900/60 border border-blue-500/20 rounded-2xl p-8 flex flex-col justify-center">

            <h2 className="text-2xl font-bold text-white mb-6">
              Our Office
            </h2>

            {/* Address */}
            <div className="mb-6">
              <p className="text-sm uppercase tracking-wide text-blue-400 mb-1">
                Address
              </p>
              <p className="text-gray-300 leading-relaxed">
                Micrologic Integrated Systems <br />
                Dubai, United Arab Emirates
              </p>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <p className="text-sm uppercase tracking-wide text-blue-400 mb-1">
                Phone
              </p>
              <p className="text-gray-300">
                +971 800 24325
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-400 mb-1">
                Email
              </p>
              <p className="text-gray-300">
                support@checkanycar.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
