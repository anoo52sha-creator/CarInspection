import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
      
      {/* BOLD BLUE THANK YOU */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-500">
        Thank You
      </h1>

      {/* MESSAGE */}
      <p className="mt-6 text-gray-300 max-w-xl text-base md:text-lg">
        Your message has been successfully received.  
        A member of our team will be in touch with you as soon as possible.
      </p>

      {/* BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="mt-10 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold shadow-lg"
      >
        BACK TO HOMEPAGE
      </button>
    </section>
  );
}
