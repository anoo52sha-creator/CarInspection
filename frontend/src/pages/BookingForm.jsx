import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    package: "Comprehensive Inspection",
  });

  const [errors, setErrors] = useState({});
  const [highlightTabby, setHighlightTabby] = useState(false);

  const priceMap = {
    "Comprehensive Inspection": "299 AED",
    "Basic Inspection": "199 AED",
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";

    if (!/^\d{10}$/.test(form.phone))
      e.phone = "Phone number must be exactly 10 digits";


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      setHighlightTabby(true);
      setTimeout(() => setHighlightTabby(false), 800);
      return;
    }

    navigate("/thank-you");
  };

  return (
    <section className="min-h-screen bg-slate-950 px-6 py-20">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-white text-center">
          Book Pre-Purchase Car Inspection
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* First Name */}
          <Input
            label="First Name"
            value={form.firstName}
            error={errors.firstName}
            onChange={(v) => setForm({ ...form, firstName: v })}
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            value={form.lastName}
            error={errors.lastName}
            onChange={(v) => setForm({ ...form, lastName: v })}
          />

          {/* Phone */}
          <Input
            label="Phone"
            value={form.phone}
            placeholder="Enter 10-digit phone number Ex:xxxxxxxxx"
            error={errors.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          {/* Email */}
          <Input
            label="Email"
            value={form.email}
            placeholder="you@email.com"
            error={errors.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          {/* Package */}
          <div>
            <label className="text-sm text-gray-400">Choose Package</label>
            <select
              value={form.package}
              onChange={(e) =>
                setForm({ ...form, package: e.target.value })
              }
              className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <option>Comprehensive Inspection</option>
              <option>Basic Inspection</option>
            </select>
          </div>

          {/* Total */}
          <div>
            <label className="text-sm text-gray-400">Total Payable</label>
            <input
              disabled
              value={priceMap[form.package]}
              className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
            />
          </div>

          {/* Tabby */}
         <div className="mt-4 flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3">
            <span className="px-2 py-1 text-xs font-bold bg-blue-600 text-white rounded">
                TABBY
            </span>

            <p className="text-sm text-blue-300">
                Split your purchase into <span className="font-semibold">4 interest-free payments</span>
            </p>
        </div>


          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold"
          >
            Book Inspection
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------------- INPUT COMPONENT ---------------- */
function Input({ label, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full bg-slate-800 border rounded-xl px-4 py-3 text-white outline-none ${
          error ? "border-red-500" : "border-white/10"
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
