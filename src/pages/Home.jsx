// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const [value, setValue] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   /* ---------------- SEARCH LOGIC ---------------- */
//   const handleSearch = () => {
//     if (!isValidInput(value)) {
//       setError("Enter a valid Vehicle Number or VIN");
//       return;
//     }
//     setError("");
//     navigate("/result", { state: { query: value } });
//   };

//   /* ---------------- REVIEWS SLIDER ---------------- */
//   const reviews = [
//     { name: "Ahmed R.", text: "Very detailed inspection. Helped me avoid a damaged car." },
//     { name: "Priya S.", text: "Doorstep inspection was smooth and professional." },
//     { name: "Mohammed K.", text: "AI-powered report explanation was impressive." },
//     { name: "Sara M.", text: "Dedicated manager explained everything clearly." },
//     { name: "Daniel P.", text: "Saved me from buying a faulty car." },
//     { name: "Ayesha N.", text: "Worth every dirham. Highly recommended." },
//     { name: "Shiva M.", text: "Dedicated manager explained everything clearly." },
//     { name: "Anusha P.", text: "Saved me from buying a faulty car." },
//     { name: "Aradhya N.", text: "Worth every dirham. Highly recommended." },
//   ];

//   const visibleCount = 3;
//   const totalPages = Math.ceil(reviews.length / visibleCount);
//   const [page, setPage] = useState(0);

//   const startIndex = page * visibleCount;
//   const visibleReviews = reviews.slice(startIndex, startIndex + visibleCount);

//   const next = () => setPage((p) => (p + 1) % totalPages);
//   const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

//   return (
//     <>
//       {/* ================= HERO SECTION ================= */}
//       <section
//         className="min-h-screen flex flex-col justify-center text-center px-6"
//         style={{
//           backgroundImage: `
//             linear-gradient(
//               to bottom,
//               rgba(2,6,23,0.7),
//               rgba(2,6,23,0.9)
//             ),
//             url('/hero-bg-blue.png')
//           `,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
//           <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
//             Auto Vera
//           </span>
//           <br />
//           Smart Vehicle Intelligence
//         </h1>

//         <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
//           Verify any vehicle instantly using number or VIN.
//         </p>

//         {/* SEARCH */}
//         <div className="mt-10 max-w-xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
//           <input
//             value={value}
//             onChange={(e) => setValue(e.target.value.toUpperCase())}
//             placeholder="Enter Vehicle Number or VIN"
//             className="w-full bg-transparent outline-none text-lg text-white placeholder-gray-400"
//           />

//           {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

//           <button
//             onClick={handleSearch}
//             className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-lg text-white font-semibold"
//           >
//             Search
//           </button>
//         </div>
//       </section>

//       {/* ================= PURPOSE SECTION ================= */}
//       <section className="py-20 px-6 bg-slate-950 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-white">
//           Buying a Used/New Car in the UAE?
//         </h2>

//         <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
//           Buy it risk-free with our expert{" "}
//           <span className="text-blue-400 font-semibold">
//             Pre-Purchase Inspection (PPI)
//           </span>{" "}
//           service at your Doorstep.
//         </p>

//         <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
//           {[
//             "200-Point Pre-Purchase Inspection",
//             "Doorstep Inspection at Seller's Location",
//             "Dedicated Manager for Every Inspection",
//             "AI-powered report conversation feature",
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
//             >
//               <span className="text-blue-400 text-xl">✔</span>
//               <span className="text-gray-200">{item}</span>
//             </div>
//           ))}
//         </div>

//         <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
//           <button className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold">
//             Book Inspection Now
//           </button>

//           <button className="px-8 py-3 rounded-xl border border-blue-400 text-blue-400">
//             Check Our Inspection Plans
//           </button>
//         </div>
//       </section>

//       {/* ================= REVIEWS SECTION ================= */}
//       <section id="reviews" className="py-24 bg-slate-900 px-6 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-white">
//           What our Customers say about Our
//           <span className="text-blue-400"> Comprehensive Car Inspection</span>
//         </h2>

//         <p className="mt-3 text-gray-400">
//           Trusted by car buyers across the UAE.
//         </p>

//         <div className="relative mt-16 max-w-6xl mx-auto">
//           {/* Arrows */}
//           <button onClick={prev} className="absolute -left-6 top-1/2 -translate-y-1/2 bg-slate-800 w-10 h-10 rounded-full text-white">
//             ‹
//           </button>
//           <button onClick={next} className="absolute -right-6 top-1/2 -translate-y-1/2 bg-slate-800 w-10 h-10 rounded-full text-white">
//             ›
//           </button>

//           {/* Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {visibleReviews.map((r, i) => (
//               <div key={i} className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
//                 <div className="text-yellow-400 mb-3">★★★★★</div>

//                 <p className="text-gray-200 text-sm">“{r.text}”</p>

//                 {/* Google logo */}
//                 <img src="/google-logo.png" className="absolute bottom-4 right-4 h-6" />

//                 {/* Bubble tail */}
//                 <div className="absolute -bottom-3 left-8 w-5 h-5 bg-white/5 rotate-45 border-l border-b border-white/10" />

//                 {/* User */}
//                 <div className="mt-8 flex items-center gap-3">
//                   <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                     {r.name[0]}
//                   </div>
//                   <span className="text-gray-300 text-sm">{r.name}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Dots */}
//           <div className="mt-10 flex justify-center gap-2">
//             {Array.from({ length: totalPages }).map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i)}
//                 className={`h-2 w-2 rounded-full ${
//                   page === i ? "bg-blue-400" : "bg-gray-600"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// /* ---------------- VALIDATION ---------------- */
// function isValidInput(value) {
//   const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
//   const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
//   return vehicleRegex.test(value) || vinRegex.test(value);
// }

//__________________________________________________________________________________________________________________________________________________________________________________________________________________
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const [value, setValue] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   /* ---------------- SEARCH LOGIC ---------------- */
//   const handleSearch = () => {
//     if (!isValidInput(value)) {
//       setError("Enter a valid Vehicle Number or VIN");
//       return;
//     }
//     setError("");
//     navigate("/result", { state: { query: value } });
//   };

//   /* ---------------- SCROLL TO REVIEWS ---------------- */
//   const scrollToReviews = () => {
//     document.getElementById("reviews")?.scrollIntoView({
//       behavior: "smooth",
//     });
//   };

//   /* ---------------- REVIEWS SLIDER ---------------- */
//   const reviews = [
//     { name: "Ahmed R.", text: "Very detailed inspection. Helped me avoid a damaged car." },
//     { name: "Priya S.", text: "Doorstep inspection was smooth and professional." },
//     { name: "Mohammed K.", text: "AI-powered report explanation was impressive." },
//     { name: "Sara M.", text: "Dedicated manager explained everything clearly." },
//     { name: "Daniel P.", text: "Saved me from buying a faulty car." },
//     { name: "Ayesha N.", text: "Worth every dirham. Highly recommended." },
//     { name: "Shiva M.", text: "Dedicated manager explained everything clearly." },
//     { name: "Anusha P.", text: "Saved me from buying a faulty car." },
//     { name: "Aradhya N.", text: "Worth every dirham. Highly recommended." },
//   ];

//   const visibleCount = 3;
//   const totalPages = Math.ceil(reviews.length / visibleCount);
//   const [page, setPage] = useState(0);

//   const startIndex = page * visibleCount;
//   const visibleReviews = reviews.slice(startIndex, startIndex + visibleCount);

//   const next = () => setPage((p) => (p + 1) % totalPages);
//   const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

//   return (
//     <>
//       {/* ================= HERO SECTION ================= */}
//       <section
//         className="min-h-screen flex flex-col justify-center text-center px-6"
//         style={{
//           backgroundImage: `
//             linear-gradient(
//               to bottom,
//               rgba(2,6,23,0.7),
//               rgba(2,6,23,0.9)
//             ),
//             url('/hero-bg-blue.png')
//           `,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
//           <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
//             Auto Vera
//           </span>
//           <br />
//           Smart Vehicle Intelligence
//         </h1>

//         <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
//           Verify any vehicle instantly using number or VIN.
//         </p>

//         {/* SEARCH */}
//         <div className="mt-10 max-w-xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
//           <input
//             value={value}
//             onChange={(e) => setValue(e.target.value.toUpperCase())}
//             placeholder="Enter Vehicle Number or VIN"
//             className="w-full bg-transparent outline-none text-lg text-white placeholder-gray-400"
//           />

//           {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

//           <button
//             onClick={handleSearch}
//             className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-lg text-white font-semibold"
//           >
//             Search
//           </button>
//         </div>
//       </section>

//       {/* ================= PURPOSE SECTION ================= */}
//       <section className="py-20 px-6 bg-slate-950 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-white">
//           Buying a Used/New Car in the UAE?
//         </h2>

//         <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
//           Buy it risk-free with our expert{" "}
//           <span className="text-blue-400 font-semibold">
//             Pre-Purchase Inspection (PPI)
//           </span>{" "}
//           service at your Doorstep.
//         </p>

//         <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
//           {[
//             "200-Point Pre-Purchase Inspection",
//             "Doorstep Inspection at Seller's Location",
//             "Dedicated Manager for Every Inspection",
//             "AI-powered report conversation feature",
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
//             >
//               <span className="text-blue-400 text-xl">✔</span>
//               <span className="text-gray-200">{item}</span>
//             </div>
//           ))}
//         </div>

//         {/* CTA BUTTONS */}
//         <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
//           <button className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold">
//             Book Inspection Now
//           </button>

//           <button className="px-8 py-3 rounded-xl border border-blue-400 text-blue-400">
//             Check Our Inspection Plans
//           </button>
//         </div>

//         {/* GOOGLE RATING STRIP */}
//         <div
//           onClick={scrollToReviews}
//           className="mt-10 flex flex-col items-center cursor-pointer group"
//         >
//           <div className="flex items-center gap-2">
//             <img src="/google-logo.png" alt="Google" className="h-6" />
//             <span className="text-yellow-400 font-semibold text-lg">
//               ★★★★★ 5.0
//             </span>
//           </div>

//           <p className="mt-1 text-gray-400 text-sm group-hover:text-white transition">
//             What our Customers say about Our Comprehensive Car Inspection →
//           </p>
//         </div>
//       </section>

//       {/* ================= REVIEWS SECTION ================= */}
//       <section id="reviews" className="py-24 bg-slate-900 px-6 text-center">
//         <h2 className="text-3xl md:text-4xl font-bold text-white">
//           What our Customers say about Our
//           <span className="text-blue-400"> Comprehensive Car Inspection</span>
//         </h2>

//         <p className="mt-3 text-gray-400">
//           Trusted by car buyers across the UAE.
//         </p>

//         <div className="relative mt-16 max-w-6xl mx-auto">
//           {/* ARROWS */}
//           <button
//             onClick={prev}
//             className="absolute -left-6 top-1/2 -translate-y-1/2 bg-slate-800 w-10 h-10 rounded-full text-white"
//           >
//             ‹
//           </button>

//           <button
//             onClick={next}
//             className="absolute -right-6 top-1/2 -translate-y-1/2 bg-slate-800 w-10 h-10 rounded-full text-white"
//           >
//             ›
//           </button>

//           {/* CARDS */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {visibleReviews.map((r, i) => (
//               <div
//                 key={i}
//                 className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-left"
//               >
//                 <div className="text-yellow-400 mb-3">★★★★★</div>

//                 <p className="text-gray-200 text-sm">“{r.text}”</p>

//                 <img
//                   src="/google-logo.png"
//                   className="absolute bottom-4 right-4 h-6"
//                   alt="Google"
//                 />

//                 <div className="absolute -bottom-3 left-8 w-5 h-5 bg-white/5 rotate-45 border-l border-b border-white/10" />

//                 <div className="mt-8 flex items-center gap-3">
//                   <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                     {r.name[0]}
//                   </div>
//                   <span className="text-gray-300 text-sm">{r.name}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* DOTS */}
//           <div className="mt-10 flex justify-center gap-2">
//             {Array.from({ length: totalPages }).map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i)}
//                 className={`h-2 w-2 rounded-full ${
//                   page === i ? "bg-blue-400" : "bg-gray-600"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// /* ---------------- VALIDATION ---------------- */
// function isValidInput(value) {
//   const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
//   const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
//   return vehicleRegex.test(value) || vinRegex.test(value);
// }
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ClipboardCheck, Clock } from "lucide-react";

export default function Home() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const reviewsRef = useRef(null);

  /* ---------------- SEARCH LOGIC ---------------- */
  const handleSearch = () => {
    if (!isValidInput(value)) {
      setError("Enter a valid Vehicle Number or VIN");
      return;
    }
    setError("");
    navigate("/result", { state: { query: value } });
  };

  /* ---------------- REVIEWS DATA ---------------- */
  const reviews = [
    { name: "Zaheer Assariya", text: "Excellent job done. They even found that the Prado was bought from Emirates auction and was flooded and repaired." },
    { name: "Mohammed J.", text: "Great service and very quick. Recommended if you plan to buy used cars." },
    { name: "Saquib F.", text: "Yes, very good service. Must try before buying." },
    { name: "Omar Helal", text: "Very good service. Fast report and accurate results." },
    { name: "Ahmed R.", text: "Detailed inspection saved me from buying a damaged car." },
    { name: "Priya S.", text: "Doorstep inspection was extremely convenient." },
  ];

  const visibleCount = 3;
  const totalPages = Math.ceil(reviews.length / visibleCount);
  const [page, setPage] = useState(0);

  const start = page * visibleCount;
  const visibleReviews = reviews.slice(start, start + visibleCount);

  const next = () => setPage((p) => (p + 1) % totalPages);
  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section
        className="min-h-screen flex flex-col justify-center text-center px-6"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(2,6,23,0.75), rgba(2,6,23,0.95)),
            url('/hero-bg-blue.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Auto Vera
          </span>
          <br />
          Smart Vehicle Intelligence
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
          Verify any vehicle instantly using number or VIN.
        </p>

        {/* SEARCH */}
        <div className="mt-10 max-w-xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder="Enter Vehicle Number or VIN"
            className="w-full bg-transparent outline-none text-lg text-white placeholder-gray-400"
          />

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          <button
            onClick={handleSearch}
            className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-lg text-white font-semibold"
          >
            Search
          </button>
        </div>

        {/* GOOGLE RATING */}
        <div
          onClick={scrollToReviews}
          className="mt-8 flex justify-center items-center gap-2 cursor-pointer"
        >
          <img src="/google-logo.png" className="h-6" />
          <span className="text-yellow-400 font-semibold">★★★★★ 5.0</span>
        </div>
      </section>

      {/* ================= WHY PPI IMPORTANT ================= */}
<section className="py-24 px-6 bg-slate-950 text-center">
  <h2 className="text-3xl md:text-4xl font-extrabold text-white">
    Why is a{" "}
    <span className="text-blue-400">Pre-Purchase Inspection</span>{" "}
    Important?
  </h2>

  <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {/* CARD 1 */}
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
      <div className="mb-6 flex justify-center">
        <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white">
        Avoid Costly Repairs Later
      </h3>

      <p className="mt-4 text-gray-400 text-sm leading-relaxed">
        Our inspection uncovers hidden issues like engine problems,
        structural damage, or excessive wear and tear — saving you from
        expensive repairs after purchase.
      </p>
    </div>

    {/* CARD 2 */}
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
      <div className="mb-6 flex justify-center">
        <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <span className="text-3xl">🤝</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white">
        Negotiate a Better Deal
      </h3>

      <p className="mt-4 text-gray-400 text-sm leading-relaxed">
        Know the car’s real condition before you buy. Use inspection
        findings to negotiate the price or request repairs from the
        seller with confidence.
      </p>
    </div>

    {/* CARD 3 */}
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
      <div className="mb-6 flex justify-center">
        <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white">
        Buy with Confidence
      </h3>

      <p className="mt-4 text-gray-400 text-sm leading-relaxed">
        Our thorough inspection ensures the vehicle is safe, reliable,
        and worth your investment — giving you peace of mind before
        making the final decision.
      </p>
    </div>
  </div>
</section>

{/* ================= 3 SIMPLE STEPS ================= */}
<section className="py-24 px-6 bg-slate-900 text-center">
  <h2 className="text-3xl md:text-4xl font-extrabold text-white">
    Get Your{" "}
    <span className="text-blue-400">Comprehensive Car Inspection</span>{" "}
    in 3 Simple Steps
  </h2>

  <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
    {/* STEP 1 */}
    <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
      <div className="absolute -top-6 left-6 text-6xl font-extrabold text-blue-500/20">
        1
      </div>

      <div className="mb-6 flex justify-center">
        <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <span className="text-3xl">📅</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white">Booking</h3>

      <p className="mt-4 text-gray-400 text-sm leading-relaxed">
        Choose your preferred inspection date and pay securely online.
        Our manager will contact you shortly to coordinate the details.
      </p>
    </div>

    {/* STEP 2 */}
    <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
      <div className="absolute -top-6 left-6 text-6xl font-extrabold text-blue-500/20">
        2
      </div>

      <div className="mb-6 flex justify-center">
        <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <span className="text-3xl">🚗</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white">Inspection</h3>

      <p className="mt-4 text-gray-400 text-sm leading-relaxed">
        Your dedicated account manager coordinates directly with the
        seller. Our expert inspector performs a 200+ point inspection at
        the vehicle location.
      </p>
    </div>

    {/* STEP 3 */}
    <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
      <div className="absolute -top-6 left-6 text-6xl font-extrabold text-blue-500/20">
        3
      </div>

      <div className="mb-6 flex justify-center">
        <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <span className="text-3xl">📄</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white">Report</h3>

      <p className="mt-4 text-gray-400 text-sm leading-relaxed">
        Receive a detailed inspection report with photos, findings, and
        expert recommendations to help you decide whether to purchase
        the car or not.
      </p>
    </div>
  </div>

  {/* CTA */}
  <div className="mt-16">
    <button
      onClick={() => window.location.href = "/book-inspection"}
      className="px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-lg"
    >
      Book Now
    </button>
  </div>
</section>
{/* ================= TRUSTED PARTNER SECTION ================= */}
<section className="py-24 px-6 bg-slate-950">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-white">
      Your Trusted Partner for Used Car{" "}
      <span className="text-blue-400">Inspections</span> and Mobile PPI Services
    </h2>

    <p className="mt-6 text-gray-400 max-w-4xl mx-auto leading-relaxed">
      Purchasing a used car in Dubai can be an excellent investment but comes
      with risks. Hidden mechanical issues, past accidents, or concealed defects
      can turn your dream car into a costly nightmare. At Auto Vera, we provide
      comprehensive Pre-Purchase Car Inspection (PPI) services to ensure you
      make an informed decision.Our AI-powered inspection technology delivers detailed, accurate reports,
      while our expert vehicle inspection services in Dubai provide on-the-spot
      assessments. We also offer the convenience of doorstep inspections,
      allowing your car to be thoroughly inspected wherever you are.
    </p>
  </div>

  {/* ================= WHAT IS PPI ================= */}
  <div className="mt-24 max-w-6xl mx-auto">
    <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
      What is a Pre-Purchase{" "}
      <span className="text-blue-400">Car Inspection in Dubai?</span>
    </h3>

    <p className="mt-4 text-gray-400 text-center max-w-3xl mx-auto">
      A Pre-Purchase Car Inspection in Dubai is a thorough assessment of a used
      car’s condition before finalizing the purchase. Our certified inspectors
      examine various aspects of the vehicle, including:
    </p>

    {/* <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"> */}
    <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-3 items-stretch">
      {/* IMAGE */}
     <div className="relative w-full h-full min-h-[520px] overflow-hidden">
      <img
        src="/ppi-inspection.jpg"
        alt="Car Inspection"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>


      {/* LIST */}
      <div className="space-y-4">
        {[
          "Engine performance and transmission",
          "Brakes and suspension",
          "Exterior and interior condition",
          "Tire health and alignment",
          "Accident history and previous repairs",
          "Electrical system diagnostics",
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <span className="text-blue-400 text-lg mt-1">✔</span>
            <span className="text-gray-200">{item}</span>
          </div>
        ))}

        <p className="mt-6 text-gray-400 text-sm">
          With our <span className="text-blue-400 font-semibold">detailed PPI reports</span>,
          you can confidently negotiate the right price and avoid unexpected repairs.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* ================= REVIEWS ================= */}
      <section ref={reviewsRef} className="py-24 bg-slate-900 px-6 text-center">
        <h2 className="text-4xl font-bold text-white">
          What our Customers say about Our
          <span className="text-blue-400"> Comprehensive Car Inspection</span>
        </h2>

        <p className="mt-3 text-gray-400">Trusted by car buyers across the UAE.</p>

        <div className="relative mt-16 max-w-6xl mx-auto">
          {/* Arrows */}
          <button onClick={prev} className="absolute -left-6 top-1/2 -translate-y-1/2 bg-slate-800 w-10 h-10 rounded-full text-white">‹</button>
          <button onClick={next} className="absolute -right-6 top-1/2 -translate-y-1/2 bg-slate-800 w-10 h-10 rounded-full text-white">›</button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleReviews.map((r, i) => (
              <div key={i} className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <div className="text-yellow-400 mb-3">★★★★★</div>
                <p className="text-gray-200 text-sm">“{r.text}”</p>
                <img src="/google-logo.png" className="absolute bottom-4 right-4 h-6" />

                <div className="absolute -bottom-3 left-8 w-5 h-5 bg-white/5 rotate-45 border-l border-b border-white/10" />

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {r.name[0]}
                  </div>
                  <span className="text-gray-300 text-sm">{r.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 w-2 rounded-full ${page === i ? "bg-blue-400" : "bg-gray-600"}`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* ================= WHY CHOOSE US ================= */}
<section className="py-24 px-6 bg-slate-900">
  <div className="max-w-6xl mx-auto">

    <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
      Why Choose Our Vehicle Inspection Services{" "}
      <span className="text-blue-400">in Dubai?</span>
    </h2>

    <p className="mt-4 text-gray-400 text-center max-w-3xl mx-auto">
      At Auto Vera, we prioritize transparency, accuracy, and trust.
      Here’s why thousands of car buyers choose us.
    </p>

    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">

      {/* IMAGE (NO BORDER / NO RADIUS) */}
      <div className="w-full h-full min-h-[420px] overflow-hidden">
        <img
          //src="/ConvenientIcon.jpg"
          src="/vehicle-inspection.jpg"
          alt="Vehicle Inspection"
          className="w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        {[
          "Certified Inspectors – Our expert team has extensive experience evaluating various makes and models of vehicles.",
          "Affordable Pricing – Get high-quality inspections at competitive rates.",
          "Detailed Reports – We provide a comprehensive inspection report highlighting any potential issues.",
          "Quick Turnaround – Receive your report promptly to make timely purchasing decisions.",
          "100% Unbiased – We work for you, not the seller, ensuring a neutral evaluation.",
          "AI Powered Inspection - We offers AI-powered inspection technology that delivers precise, reliable, and efficient vehicle evaluations.",
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-slate-950 border border-white/10 rounded-xl p-4"
          >
            <span className="text-blue-400 text-lg mt-1">✔</span>
            <span className="text-gray-200">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
{/* ================= MOBILE INSPECTION ================= */}
<section className="py-24 px-6 bg-slate-950 text-center">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
      Mobile Car Inspection Service in{" "}
      <span className="text-blue-400">Dubai</span> We Come to You
    </h2>

    <p className="mt-6 text-gray-400 max-w-4xl mx-auto leading-relaxed">
      Busy schedule? No problem! Our mobile car inspection service brings
      expert vehicle inspection directly to your doorstep. Whether you’re
      at home, work, or a dealership, our inspectors assess the car’s
      condition on-site — saving you time and effort.
    </p>

    {/* FEATURE CARDS */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Convenient */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
        <div className="mb-6 flex justify-center">
          <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <MapPin className="text-blue-400 w-7 h-7" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Convenient</h3>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          No need to drive to a workshop. We come to your location anywhere
          in Dubai for hassle-free inspections.
        </p>
      </div>

      {/* Comprehensive */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
        <div className="mb-6 flex justify-center">
          <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <ClipboardCheck className="text-blue-400 w-7 h-7" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Comprehensive Check</h3>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          Our inspectors evaluate all critical components and provide a
          detailed, easy-to-understand report.
        </p>
      </div>

      {/* Fast */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition">
        <div className="mb-6 flex justify-center">
          <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <Clock className="text-blue-400 w-7 h-7" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Fast Service</h3>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          Get real-time updates and receive your inspection report quickly
          to make confident decisions.
        </p>
      </div>

    </div>

    {/* CTA */}
    <div className="mt-16">
      <button
        onClick={() => navigate("/book-inspection")}
        className="px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-lg"
      >
        Book Now
      </button>
    </div>
  </div>
</section>

{/* ================= PACKAGES ================= */}
<section className="py-24 px-6 bg-slate-900">
  <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
    Choose a{" "}
    <span className="text-blue-400">Risk-Free Inspection Package</span>
  </h2>

  <p className="mt-3 text-gray-400 text-center">
    A small price today to avoid costly surprises tomorrow.
  </p>

  <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

    {[
      { name: "Rapid", price: "99", points: "60+" },
      { name: "Standard", price: "199", points: "100+" },
      { name: "Comprehensive", price: "299", points: "200+" },
      { name: "Luxury", price: "599", points: "400+" },
      { name: "EV Special", price: "399", points: "200+" },
    ].map((pkg, i) => (
      <div
        key={i}
        className="bg-slate-950 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition flex flex-col"
      >
        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
        <p className="mt-2 text-gray-400 text-sm">
          AED <span className="text-3xl text-white font-bold">{pkg.price}</span>{" "}
          ({pkg.points} points)
        </p>

        <ul className="mt-6 space-y-2 text-gray-300 text-sm flex-1">
          <li>✔ All Emirates</li>
          <li>✔ Engine & Transmission</li>
          <li>✔ Visual & Mechanical Checks</li>
        </ul>

        <button
          onClick={() => window.location.href = "/book-inspection"}
          className="mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold"
        >
          Book Now
        </button>
      </div>
    ))}
  </div>
</section>
{/* ================= BOOK PPI ONLINE ================= */}
<section className="py-24 px-6 bg-slate-900">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

    {/* IMAGE */}
    <div className="w-full h-[420px] overflow-hidden">
      <img
        src="/ppi-online.jpg"
        alt="Book PPI Online"
        className="w-full h-full object-cover"
      />
    </div>

    {/* CONTENT */}
    <div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Book Car PPI{" "}
        <span className="text-blue-400">Service in Dubai Online</span>
      </h2>

      <p className="mt-4 text-gray-400">
        Booking your car inspection service in Dubai is simple and hassle-free.
        Follow these easy steps:
      </p>

      <ul className="mt-8 space-y-4">
        {[
          "Visit our website and choose your preferred inspection package.",
          "Enter the vehicle details and inspection location.",
          "Select a convenient time slot for the inspection.",
          "Our certified inspector conducts the assessment and provides a detailed report.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">✔</span>
            <span className="text-gray-300">{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-gray-400 text-sm">
        With <span className="text-blue-400 font-semibold">Auto Vera</span>, you
        can book your PPI service online in just a few clicks!
      </p>
    </div>
  </div>
</section>
{/* ================= BENEFITS ================= */}
<section className="py-24 px-6 bg-slate-950 text-center">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
      Benefits of Mobile{" "}
      <span className="text-blue-400">Car Inspections in Dubai</span>
    </h2>

    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* CARD */}
      {[
        {
          title: "Saves Time & Effort",
          text: "No need to visit a workshop. We inspect the vehicle at your location.",
          icon: "⏱️",
        },
        {
          title: "Expert Analysis",
          text: "Our professionals assess the vehicle’s condition in detail.",
          icon: "🛠️",
        },
        {
          title: "Better Decision Making",
          text: "Receive a full report before making a purchase decision.",
          icon: "📊",
        },
        {
          title: "Avoid Costly Repairs",
          text: "Detect potential mechanical issues before buying.",
          icon: "💰",
        },
        {
          title: "Inspection at Doorstep",
          text: "Experience the ease of a professional car inspection at your doorstep, designed to save your time while delivering a smooth, reliable, and worry-free service.",
          icon: "🏠",
        },
        {
          title: "AI Powered Inspection",
          text: "Powered by advanced AI, our mobile car inspections deliver precise evaluations and instant detailed reports—so you know your car’s true condition without delay.",
          icon: "🤖",
        },
      ].map((b, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-white/10 rounded-2xl p-8 hover:border-blue-400 transition"
        >
          <div className="mb-6 flex justify-center">
            <div className="h-14 w-14 rounded-xl bg-blue-600/20 flex items-center justify-center text-3xl">
              {b.icon}
            </div>
          </div>

          <h3 className="text-lg font-bold text-white">{b.title}</h3>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            {b.text}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
{/* ================= HOW PPI WORKS ================= */}
<section className="py-24 px-6 bg-slate-950">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

    {/* CONTENT */}
    <div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        How Does a Pre-Purchase{" "}
        <span className="text-blue-400">Car Inspection Work?</span>
      </h2>

      <div className="mt-10 space-y-6">
        {[
          {
            title: "Schedule an Appointment",
            desc: "Book online or call us to schedule an inspection.",
          },
          {
            title: "On-Site Inspection",
            desc: "Our experts assess the vehicle at the specified location.",
          },
          {
            title: "Detailed Report",
            desc: "We provide a full report including images and diagnostics.",
          },
          {
            title: "Expert Advice",
            desc: "Our team guides you on potential concerns and next steps.",
          },
        ].map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold">
              {i + 1}
            </div>
            <div>
              <h4 className="text-white font-semibold">{step.title}</h4>
              <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* IMAGE */}
    <div className="w-full h-[420px] overflow-hidden">
      <img
        src="/ppi-process.jpg"
        alt="Car Inspection Process"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</section>
{/* ================= AREAS WE SERVE ================= */}
<section className="py-24 px-6 bg-slate-900">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

    {/* IMAGE */}
    <div className="w-full h-[400px] overflow-hidden">
      <img
        src="/dubai-areas.jpg"
        alt="Areas We Serve in Dubai"
        className="w-full h-full object-cover"
      />
    </div>

    {/* CONTENT */}
    <div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Areas We Serve in{" "}
        <span className="text-blue-400">Dubai</span>
      </h2>

      <p className="mt-4 text-gray-400">
        We offer vehicle inspection services across Dubai, including:
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-4">
        {[
          "Dubai Marina",
          "Downtown Dubai",
          "Jumeirah",
          "Business Bay",
          "Al Barsha",
          "Deira",
        ].map((area, i) => (
          <li key={i} className="flex items-center gap-3 text-gray-300">
            <span className="text-blue-400">✔</span>
            {area}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-gray-400 text-sm">
        No matter where you are,{" "}
        <span className="text-blue-400 font-semibold">Auto Vera</span> ensures a
        seamless and reliable inspection experience.
      </p>
    </div>
  </div>
</section>
{/* ================= FAQS ================= */}
<section className="py-24 px-6 bg-slate-950">
  <div className="max-w-4xl mx-auto">

    <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
      FAQs
    </h2>

    <div className="mt-10 space-y-4">
      {[
        {
          question: "What is included in a pre-purchase car inspection (PPI)?",
          answer:
            "Our PPI service includes thoroughly checking the engine, transmission, brakes, suspension, tires, exterior, interior, and electrical components. We also provide accident history and service records if available.",
        },
        {
          question: "How do I book a car inspection service in Dubai?",
          answer:
            "You can book your inspection online using our 'Book Now' form or call our support team to schedule a convenient time for the inspection.",
        },
        {
          question: "How long does a used car inspection take in Dubai?",
          answer:
            "A typical pre-purchase inspection takes between 45–90 minutes depending on the vehicle type and condition.",
        },
        {
          question: "Can I get a car inspection at my location?",
          answer:
            "Yes! Our mobile car inspection service comes directly to your home, workplace, or dealership.",
        },
        {
          question: "Why should I choose your vehicle inspection services in Dubai?",
          answer:
            "We provide expert inspections, detailed reports, and a hassle-free mobile service to ensure you make an informed purchase decision.",
        },
      ].map((faq, i) => (
        <details key={i} className="bg-slate-900 text-white rounded-xl p-4 border border-white/10">
          <summary className="cursor-pointer font-semibold">{faq.question}</summary>
          <p className="mt-2 text-gray-300 text-sm">{faq.answer}</p>
        </details>
      ))}
    </div>

    {/* ================= BOOK CTA ================= */}
    <div className="mt-16 text-center">
      <h3 className="text-3xl md:text-4xl font-bold text-white">
        Book Your Pre-Purchase{" "}
        <span className="text-blue-400">Car Inspection</span> Today!
      </h3>
      <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
        Don’t take risks when buying a used car in Dubai. Let{" "}
        <span className="font-semibold text-white">Auto Vera</span> provide a
        comprehensive vehicle inspection to ensure you make a wise investment.{" "}
        <span className="font-semibold text-white">Book your inspection today!</span>
      </p>

      {/* <button
        onClick={() => window.location.href = "/book-inspection"}
        className="mt-6 px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-lg"
      >
        BOOK NOW
      </button> */}
       <button
          onClick={() => window.location.href = "/book-inspection"}
          className="mt-6 px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-lg"
        >
          Book Now
        </button>
    </div>
  </div>
</section>

    </>
  );
}

/* ---------------- VALIDATION ---------------- */
function isValidInput(value) {
  const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vehicleRegex.test(value) || vinRegex.test(value);
}
