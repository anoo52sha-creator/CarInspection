import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export default function Result() {
  const { state } = useLocation();
  const query = state?.query;

  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({
        vehicle: query,
        status: "Verified",
        fuel: "Petrol",
        owner: "Ramesh Kumar",
        chassis: "MA3EUA22S00123456",
      });
      setLoading(false);
    }, 1200);
  }, [query]);

 function handlePayment() {
  if (!window.Razorpay) {
    alert("Razorpay SDK not loaded ❌");
    return;
  }

  const options = {
    key: "rzp_test_Rt4IPyQ1jvuOb1", // 👈 REAL TEST KEY
    amount: 9900,
    currency: "INR",
    name: "Auto Vera",
    description: "Full Vehicle Report",
    handler: function () {
      alert("Payment successful ✅");
      setPaid(true);
    },
    theme: {
      color: "#2563eb",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

  if (loading) {
    return (
      <div className="py-32 text-center text-blue-400 animate-pulse">
        Fetching vehicle data...
      </div>
    );
  }

 return (
  <section className="py-24 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-6">Vehicle Report</h2>

    {/* ✅ THIS PART WILL BE CONVERTED TO PDF */}
    <div id="report-content">
      <div className="grid md:grid-cols-2 gap-6">
        <Info label="Vehicle / VIN" value={data.vehicle} />
        <Info label="Status" value={data.status} />
        <Info label="Fuel Type" value={data.fuel} />

        {paid ? (
          <>
            <Info label="Owner Name" value={data.owner} />
            <Info label="Chassis Number" value={data.chassis} />
          </>
        ) : (
          <>
            <LockedInfo label="Owner Name" />
            <LockedInfo label="Chassis Number" />
          </>
        )}
      </div>
    </div>

    {/* PAYWALL */}
    {!paid && (
      <div className="mt-10 text-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-2">
          Unlock Full Vehicle Report
        </h3>
        <p className="text-gray-400 mb-6">
          Ownership details, chassis number & downloadable PDF.
        </p>

        <button
          onClick={handlePayment}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition shadow-[0_0_30px_rgba(59,130,246,0.6)]"
        >
          Unlock for ₹99
        </button>
      </div>
    )}

    {/* DOWNLOAD BUTTON */}
    {paid && (
      <div className="mt-10 text-center">
        <button
          onClick={downloadPDF}
          className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 transition shadow-[0_0_30px_rgba(34,197,94,0.6)]"
        >
          Download PDF Report
        </button>
      </div>
    )}
  </section>
);

}

function Info({ label, value }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold mt-1 text-black">
        {value}
      </p>
    </div>
  );
}

function LockedInfo({ label }) {
  return (
    <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <p className="text-sm text-gray-400">{label}</p>
      <div className="mt-2 h-6 w-3/4 bg-white/20 rounded blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
        🔒 Locked
      </div>
    </div>
  );
}
function downloadPDF() {
  console.log("PDF data:", document.getElementById("report-content"));

  const report = document.getElementById("report-content");
  if (!report) {
    alert("Report not ready ❌");
    return;
  }

  html2canvas(report, {
    scale: 2,
    backgroundColor: "#ffffff",
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("AutoVera_Vehicle_Report.pdf");
  });
}
