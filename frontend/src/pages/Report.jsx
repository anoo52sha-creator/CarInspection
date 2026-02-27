import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Star, Download, Printer, Loader2 } from "lucide-react";
//NEW
// const API_URL = "http://localhost:5001/api";
const API_URL = "https://car-inspection-h7fd.vercel.app/api";
const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
const SectionHeader = ({ title }) => (
  <h2 className="text-sm font-bold uppercase tracking-wider bg-orange-100 text-orange-800 p-2 my-6">
    {title}
  </h2>
);

const ReportRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-200">
    <p className="text-sm font-semibold uppercase text-gray-600 w-1/2">{label}</p>
    <p className="text-sm text-gray-800 w-1/2 text-right">{value}</p>
  </div>
);

// 👇 UPDATED: Now shows tyre images if available
const TyreInfo = ({ side, data }) => {
  if (!data) return null;

  const images = data.images || [];

  return (
    <div className="mb-6 border p-4 rounded bg-slate-50">
      <h3 className="text-sm font-bold uppercase text-blue-800 border-b pb-2 mb-2">{side} Tyre</h3>
      <div>
        <ReportRow label="Manufacturer" value={data.manufacturer || "N/A"} />
        <ReportRow label="Year" value={data.year || "N/A"} />
        <ReportRow label="Tyre Size" value={data.tyreSize || "N/A"} />
        <ReportRow label="Condition" value={data.condition || "N/A"} />
        <ReportRow label="Wheel Alloys" value={data.wheelAlloys || "N/A"} />
      </div>

      {/* Show uploaded images for this tyre */}
      {images.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-700 uppercase mb-2">Uploaded Images</p>
          <ImageSlider   images={images} title={`${side} Tyre Images`} />
        </div>
      )}
    </div>
  );
};

const StarRatingDisplay = ({ rating }) => (
  <div className="flex gap-1 justify-end">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={`${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
      />
    ))}
  </div>
);

// const ImageGrid = ({ images, title = "Images" }) => {
//   if (!images || images.length === 0) {
//     return <p className="text-sm text-gray-500 italic">No {title.toLowerCase()} uploaded.</p>;
//   }
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
//       {images.map((url, idx) => (
//         <div key={idx} className="block">
//           <img
//             src={url}
//             alt={`${title} ${idx + 1}`}
//             className="w-full h-32 object-cover rounded border"
//             onError={(e) => {
//               e.target.src = "/placeholder.png";
//               e.target.className = "w-full h-32 object-contain rounded border bg-gray-100 p-2";
//             }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };
//  --

// ✅ NEW: Image Carousel Component (paste this anywhere above the export)
const ImageCarousel = ({ images, title = "Images" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <p className="text-sm text-gray-500 italic">No {title.toLowerCase()} uploaded.</p>;
  }

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mt-4">
      <label className="text-sm font-bold text-gray-700 mb-2 block">{title} ({images.length})</label>
      <div className="relative bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
        <img 
          src={images[currentIndex]} 
          alt={`${title} ${currentIndex + 1}`} 
          className="w-full h-48 object-cover"
          crossOrigin="anonymous" // 👈 Critical for PDF rendering
        />
        
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 text-sm transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 text-sm transition-colors"
            >
              →
            </button>
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center">
        {currentIndex + 1} of {images.length}
      </p>
    </div>
  );
};
// ✅ NEW: Multi-Image Slider (shows 3-4 images at once)
const ImageSlider = ({ images, title = "Images" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Show 3 images at a time

  if (!images || images.length === 0) {
    return <p className="text-sm text-gray-500 italic">No {title.toLowerCase()} uploaded.</p>;
  }

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const visibleImages = images.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const nextSlide = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="mt-4">
      <label className="text-sm font-bold text-gray-700 mb-2 block">{title} ({images.length})</label>
      <div className="relative bg-slate-100 rounded-lg overflow-hidden border border-slate-200 p-4">
        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-2">
          {visibleImages.map((url, idx) => (
            <div key={idx} className="relative">
              <img
                src={url}
                alt={`${title} ${currentIndex * itemsPerPage + idx + 1}`}
                className="w-full h-24 object-cover rounded border"
                crossOrigin="anonymous"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5">
                {currentIndex * itemsPerPage + idx + 1}/{images.length}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-3">
            <button
              type="button"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`px-3 py-1 rounded ${
                currentIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            
            <button
              type="button"
              onClick={nextSlide}
              disabled={currentIndex === totalPages - 1}
              className={`px-3 py-1 rounded ${
                currentIndex === totalPages - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center">
        Showing {visibleImages.length} of {images.length} images
      </p>
    </div>
  );
};
async function waitForImages(rootEl) {
  const imgs = Array.from(rootEl.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve();
          const done = () => {
            img.removeEventListener("load", done);
            img.removeEventListener("error", done);
            resolve();
          };
          img.addEventListener("load", done);
          img.addEventListener("error", done);
        })
    )
  );
}
export default function Report() {
  const { state } = useLocation();
  const { id } = useParams();

  const [reportData, setReportData] = useState(state?.finalReportData || null);
  const [loading, setLoading] = useState(!state?.finalReportData);
  const [downloading, setDownloading] = useState(false);
  const [autoDownloadRan, setAutoDownloadRan] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/reports/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const r = data.report;
          const vehicleImages = r.vehicle_data?.vehicleImages || [];
          const vehicleSummary = r.vehicle_data || {};
          setReportData({
            reportId: r.report_id,
            customerName: r.customer_name,
            overallRating: r.overall_rating,
            date: r.inspection_date,
            typeOfInspection: r.inspection_type,
            yearMakeModel: r.year_make_model,
            vehicleSummary: r.vehicle_data || {},
            wheels: r.wheels_data || {},
            paintAndBody: r.paint_body_data || { selectedParts: [], notes: "", images: [] },
            engineTransmission: r.engine_transmission || { images: [] },
            suspensionSteering: r.suspension_steering || { images: [] },
            interiors: r.interiors || { images: [] },
            batteryAnalysis: r.battery_analysis || { images: [] },
            otherSpecifications: r.other_specs || { images: [] },
            diagnosticReport: r.diagnostic_report || {},
            roadTest: r.road_test || {},
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        if (state?.finalReportData) setReportData(state.finalReportData);
        setLoading(false);
      });
  }, [id, state?.finalReportData]);

  useEffect(() => {
    if (reportData && state?.autoDownload && !downloading && !autoDownloadRan) {
      setAutoDownloadRan(true);
      const t = setTimeout(() => downloadPDF(), 1500);
      return () => clearTimeout(t);
    }
  }, [reportData, state?.autoDownload, downloading, autoDownloadRan]);
const downloadPDF = async () => {
  if (!reportRef.current) return;
  setIsGeneratingPDF(true); // Show loading state
  
  try {
    const [{ jsPDF }, { default: html2canvas }, { PDFDocument }] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
      import("pdf-lib"),
    ]);

    const el = reportRef.current;
    
    // First, make sure all images are loaded
    await waitForImages(el);
    
    // 👇 CRITICAL FIX: Add these options for Cloudinary image rendering
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: false,  // Critical for cross-origin images
      backgroundColor: "#FFFFFF",
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      imageTimeout: 30000,  // Wait longer for images
      removeContainer: true,
      
      // 👇 NEW: Force images to be loaded with CORS headers
      onclone: (clonedDoc) => {
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          img.crossOrigin = "anonymous";  // This is the key!
        });
      }
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const reportPdfBytes = pdf.output("arraybuffer");

    const merged = await PDFDocument.create();
    const reportDoc = await PDFDocument.load(reportPdfBytes);
    const reportPages = await merged.copyPages(reportDoc, reportDoc.getPageIndices());
    reportPages.forEach((p) => merged.addPage(p));

    if (reportData?.diagnosticReport?.pdfFile) {
      try {
        const diagRes = await fetch(reportData.diagnosticReport.pdfFile);
        if (diagRes.ok) {
          const diagBytes = await diagRes.arrayBuffer();
          const diagDoc = await PDFDocument.load(diagBytes);
          const diagPages = await merged.copyPages(diagDoc, diagDoc.getPageIndices());
          diagPages.forEach((p) => merged.addPage(p));
        }
      } catch (e) {
        console.warn("Could not merge diagnostic PDF:", e);
      }
    }

    const finalBytes = await merged.save();
    const blob = new Blob([finalBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Car-Inspection-${reportData.reportId || "Report"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("PDF error:", err);
    alert("PDF download failed: " + err.message);
  }

  setIsGeneratingPDF(false); // Hide loading state
};
  const printReport = () => window.print();

  if (loading) {
    return <div className="p-10 text-center font-bold text-xl text-blue-800">Loading report...</div>;
  }

  if (!reportData) {
    return <div className="p-10 text-center font-bold text-red-600">REPORT DATA NOT FOUND.</div>;
  }

  return (
    <section className="bg-gray-200 py-12 px-4 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-4 print:hidden">
        <button
          onClick={printReport}
          className="px-4 py-2 bg-slate-600 text-white rounded flex items-center gap-2 hover:bg-slate-700"
        >
          <Printer size={18} /> Print
        </button>
        {/* <button
          onClick={downloadPDF}
         disabled={downloading || isGeneratingPDF}
          className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          {downloading ? "Generating PDF..." : "Download PDF"}
        </button> */}
        <button
  onClick={downloadPDF}
  disabled={isGeneratingPDF}  // ✅ Use isGeneratingPDF here
  className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isGeneratingPDF ? (
    <>
      <Loader2 className="animate-spin" size={18} /> Generating PDF...
    </>
  ) : (
    <>
      <Download size={18} /> Download PDF
    </>
  )}
</button>
      </div>

      <div ref={reportRef} id="report-content" className="max-w-4xl mx-auto bg-white p-12 text-gray-900 font-sans shadow-lg">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b-2 border-orange-200 pb-6">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="Logo" className="h-14 w-auto object-contain" />
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">CAR CHECK EXPERTS</h1>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">
                Pre Purchase Inspection Report
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm font-bold bg-slate-100 px-3 py-1 rounded inline-block mb-2">
              Report ID: {reportData.reportId}
            </p>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-semibold">Overall Rating:</span>
              <StarRatingDisplay rating={reportData.overallRating} />
            </div>
          </div>
        </header>

        {/* 👇 UPDATED: Added Vehicle Reg No conditionally */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportRow label="Customer Name" value={reportData.customerName} />
          <ReportRow label="Date/Time" value={new Date(reportData.date).toLocaleString()} />
          <ReportRow label="Type of Inspection" value={reportData.typeOfInspection} />
          <ReportRow label="Year/Make/Model" value={reportData.yearMakeModel} />
          {reportData.vehicleSummary?.vehicleRegNo && (
            <ReportRow label="Vehicle Reg No" value={reportData.vehicleSummary.vehicleRegNo} />
          )}
        </div>

        <SectionHeader title="Vehicle Summary" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-white p-4 mb-8">
          {Object.entries(reportData.vehicleSummary || {}).map(([key, value]) => (
            <ReportRow key={key} label={key.replace(/([A-Z])/g, " $1").trim()} value={value} />
          ))}
        </div>

        <SectionHeader title="Wheel and Tyre Condition" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TyreInfo side="Front LHS" data={reportData.wheels?.frontLhs} />
          <TyreInfo side="Front RHS" data={reportData.wheels?.frontRhs} />
          <TyreInfo side="Rear LHS" data={reportData.wheels?.rearLhs} />
          <TyreInfo side="Rear RHS" data={reportData.wheels?.rearRhs} />
        </div>

        <SectionHeader title="Paint and Body Appraisal" />
        <div className="flex flex-col md:flex-row gap-8 items-center border p-6 rounded-lg mb-4">
          <div className="w-full md:w-1/2 flex justify-center border-r pr-4">
            <img src="/CarImage.png" alt="Car Diagram" className="max-w-[200px] object-contain" />
          </div>
          <div className="w-full md:w-1/2">
            {reportData.paintAndBody?.selectedParts?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700 mb-2 uppercase border-b pb-1">Selected Defects</p>
                <div className="bg-slate-50 p-3 rounded">
                  {reportData.paintAndBody.selectedParts.map((p) => (
                    <p key={p.id} className="text-sm mb-1">
                      <span className="font-bold text-red-600">{p.id}. {p.name}</span>: {p.defect}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <p className="text-sm font-bold text-gray-700 mb-2 uppercase border-b pb-1">Inspection Notes</p>
            <p className="text-sm text-gray-800 bg-slate-50 p-3 rounded min-h-[50px]">
              {reportData.paintAndBody?.notes || "No remarks."}
            </p>
          </div>
        </div>
        
        {reportData.paintAndBody?.images?.length > 0 && (
          <div className="mb-8">
            <SectionHeader title="Paint & Body Images (Uploaded)" />
            <ImageSlider   images={reportData.paintAndBody.images} title="Paint & Body Images" />
          </div>
        )}

        <SectionHeader title="Engine Transmission Inspection" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-4">
          {Object.entries(reportData.engineTransmission || {})
            .filter(([k]) => k !== "comments" && k !== "images")
            .map(([key, value]) => (
              <ReportRow key={key} label={key} value={value} />
            ))}
        </div>
        {reportData.engineTransmission?.comments && (
          <div className="mb-4 p-4 bg-orange-50 rounded border border-orange-100">
            <p className="text-sm font-bold text-orange-800">Comments:</p>
            <p className="text-sm text-gray-800 mt-1">{reportData.engineTransmission.comments}</p>
          </div>
        )}
        {reportData.engineTransmission?.images?.length > 0 && (
          <div className="mb-8">
            <SectionHeader title="Engine Images (Uploaded)" />
            <ImageSlider   images={reportData.engineTransmission.images} title="Engine Images" />
          </div>
        )}

        <SectionHeader title="Suspension, Steering and Brake Inspection" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-8">
          {Object.entries(reportData.suspensionSteering || {})
            .filter(([k]) => k !== "comments" && k !== "images")
            .map(([key, value]) => (
              <ReportRow key={key} label={key} value={value} />
            ))}
        </div>
        {reportData.suspensionSteering?.images?.length > 0 && (
          <div className="mb-8">
            <SectionHeader title="Suspension Images (Uploaded)" />
            <ImageSlider  arousel  images={reportData.suspensionSteering.images} title="Suspension Images" />
          </div>
        )}

        <SectionHeader title="Interiors, Electricals and Lightings" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-8">
          {Object.entries(reportData.interiors || {})
            .filter(([k]) => k !== "comments" && k !== "images")
            .map(([key, value]) => (
              <ReportRow key={key} label={key} value={value} />
            ))}
        </div>
        {reportData.interiors?.images?.length > 0 && (
          <div className="mb-8">
            <SectionHeader title="Interior Images (Uploaded)" />
            <ImageSlider   images={reportData.interiors.images} title="Interior Images" />
          </div>
        )}

        <SectionHeader title="Battery Analysis" />
        <div className="w-full md:w-1/2 mb-4">
          <ReportRow label="Battery Report" value={reportData.batteryAnalysis?.["BATTERY REPORT"]} />
        </div>
        {reportData.batteryAnalysis?.images?.length > 0 && (
          <div className="mb-8">
            <SectionHeader title="Battery Images (Uploaded)" />
            <ImageSlider   images={reportData.batteryAnalysis.images} title="Battery Images" />
          </div>
        )}

        <SectionHeader title="Other Specifications" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-8">
          {Object.entries(reportData.otherSpecifications || {})
            .filter(([k]) => k !== "comments" && k !== "images")
            .map(([key, value]) => (
              <ReportRow key={key} label={key} value={value} />
            ))}
        </div>
        {reportData.otherSpecifications?.images?.length > 0 && (
          <div className="mb-8">
            <SectionHeader title="Other Specs Images (Uploaded)" />
            <ImageSlider   images={reportData.otherSpecifications.images} title="Other Specs Images" />
          </div>
        )}

        <SectionHeader title="Diagnostic Report" />
        <div className="bg-slate-50 p-6 rounded border mb-8">
          {reportData.diagnosticReport?.immediateAttention && (
            <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
              <p className="text-sm font-bold text-red-800 uppercase mb-1">Immediate Attention Required</p>
              <p className="text-sm text-red-900">{reportData.diagnosticReport.immediateAttention}</p>
            </div>
          )}
          <p className="text-sm font-bold text-gray-700 uppercase mb-1 border-b pb-1">Diagnostic Comments</p>
          <p className="text-sm text-gray-800 mt-2">
            {reportData.diagnosticReport?.comments || "No diagnostic comments provided."}
          </p>
          {reportData.diagnosticReport?.pdfFile && (
            <div className="mt-4">
              <p className="text-sm font-bold text-gray-700 uppercase mb-1">Attached Diagnostic PDF</p>
              <a
                href={reportData.diagnosticReport.pdfFile}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                View Diagnostic PDF (merged into downloaded PDF)
              </a>
            </div>
          )}
        </div>

        <SectionHeader title="Road Test Remarks" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-8">
          {Object.entries(reportData.roadTest || {})
            .filter(([k]) => k !== "comments")
            .map(([key, value]) => (
              <ReportRow key={key} label={key} value={value} />
            ))}
        </div>

        <div className="mt-16 pt-8 border-t-2 border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-semibold uppercase tracking-wider gap-2">
          <p>© {new Date().getFullYear()} Car Check Experts. All rights reserved.</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </section>
  );
}
// import { useLocation, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Star, Download, Printer, Loader2 } from "lucide-react";

// const API_URL = "http://localhost:5001/api";

// const SectionHeader = ({ title }) => (
//   <h2 className="text-sm font-bold uppercase tracking-wider bg-orange-100 text-orange-800 p-2 my-6">
//     {title}
//   </h2>
// );

// const ReportRow = ({ label, value }) => (
//   <div className="flex justify-between items-center py-2 border-b border-slate-200">
//     <p className="text-sm font-semibold uppercase text-gray-600 w-1/2">{label}</p>
//     <p className="text-sm text-gray-800 w-1/2 text-right">{value}</p>
//   </div>
// );

// const TyreInfo = ({ side, data }) => {
//   if (!data) return null;
//   return (
//     <div className="mb-6 border p-4 rounded bg-slate-50">
//       <h3 className="text-sm font-bold uppercase text-blue-800 border-b pb-2 mb-2">{side} Tyre</h3>
//       <div>
//         <ReportRow label="Manufacturer" value={data.manufacturer || 'N/A'} />
//         <ReportRow label="Year" value={data.year || 'N/A'} />
//         <ReportRow label="Tyre Size" value={data.tyreSize || 'N/A'} />
//         <ReportRow label="Condition" value={data.condition || 'N/A'} />
//         <ReportRow label="Wheel Alloys" value={data.wheelAlloys || 'N/A'} />
//       </div>
//     </div>
//   );
// };

// const StarRatingDisplay = ({ rating }) => (
//   <div className="flex gap-1 justify-end">
//     {[1,2,3,4,5].map(star => (
//       <Star key={star} size={16} className={`${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
//     ))}
//   </div>
// );

// export default function Report() {
//   const { state } = useLocation();
//   const { id } = useParams();
//   const [reportData, setReportData] = useState(state?.finalReportData || null);
//   const [loading, setLoading] = useState(!state?.finalReportData);
//   const [downloading, setDownloading] = useState(false);
//   // ✅ New flag to ensure auto download runs ONLY ONCE
//   const [autoDownloadRan, setAutoDownloadRan] = useState(false);

//   // ✅ Fixed fetch useEffect: removed reportData from dependencies
//   useEffect(() => {
//     if (!reportData && id) {
//       fetch(`${API_URL}/reports/${id}`)
//         .then(res => res.json())
//         .then(data => {
//           if (data.success) {
//             const r = data.report;
//             setReportData({
//               reportId: r.report_id,
//               customerName: r.customer_name,
//               overallRating: r.overall_rating,
//               date: r.inspection_date,
//               typeOfInspection: r.inspection_type,
//               yearMakeModel: r.year_make_model,
//               vehicleSummary: r.vehicle_data,
//               wheels: r.wheels_data,
//               paintAndBody: r.paint_body_data,
//               engineTransmission: r.engine_transmission,
//               suspensionSteering: r.suspension_steering,
//               interiors: r.interiors,
//               batteryAnalysis: r.battery_analysis,
//               otherSpecifications: r.other_specs,
//               diagnosticReport: r.diagnostic_report,
//               roadTest: r.road_test,
//             });
//           }
//           setLoading(false);
//         })
//         .catch(err => {
//           console.error("Error fetching report:", err);
//           setLoading(false);
//         });
//     }
//   }, [id]); // 👍 Only re-run if id changes

//   // ✅ Fixed Auto-Download useEffect: will run EXACTLY ONCE
//   useEffect(() => {
//     if (reportData && state?.autoDownload && !downloading && !autoDownloadRan) {
//       console.log("🚀 Auto-download triggered!");
//       setAutoDownloadRan(true); // 🚩 Mark as ran immediately, will never trigger again
//       const timer = setTimeout(() => {
//         downloadPDF();
//       }, 1500);
//       return () => clearTimeout(timer);
//     }
//   }, [reportData, state?.autoDownload, downloading, autoDownloadRan]);

//   const downloadPDF = async () => {
//     console.log("🚀 Starting PDF download...");
//     setDownloading(true);
    
//     try {
//       const { jsPDF } = await import('jspdf');
//       console.log("✅ jsPDF loaded");
      
//       const html2canvas = (await import('html2canvas')).default;
//       console.log("✅ html2canvas loaded");
      
//       const reportElement = document.getElementById("report-content");
//       console.log("📄 Report element found:", reportElement);
      
//       if (!reportElement) {
//         alert("ERROR: Could not find report content to convert to PDF!");
//         setDownloading(false);
//         return;
//       }

//       console.log("📸 Capturing screenshot...");
//       const canvas = await html2canvas(reportElement, { 
//         scale: 2, 
//         useCORS: true,
//         backgroundColor: '#FFFFFF',
//         logging: false,
//         windowWidth: reportElement.scrollWidth,
//         windowHeight: reportElement.scrollHeight
//       });
      
//       console.log("✅ Canvas created:", canvas.width, "x", canvas.height);
      
//       const imgData = canvas.toDataURL('image/jpeg', 1.0);
//       console.log("✅ Image data created, length:", imgData.length);
      
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgHeight = (canvas.height * pdfWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       console.log("📄 Adding image to PDF page 1...");
//       pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
//       heightLeft -= pageHeight;

//       let pageNum = 1;
//       while (heightLeft >= 0) {
//         pageNum++;
//         console.log(`📄 Adding PDF page ${pageNum}...`);
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
      
//       const fileName = `Car-Inspection-${reportData.reportId}.pdf`;
//       console.log("💾 Saving PDF as:", fileName);
//       pdf.save(fileName);
//       console.log("✅ PDF download complete!");
//       alert("✅ PDF downloaded successfully! Check your Downloads folder.");
      
//     } catch (err) {
//       console.error("❌ PDF Generation FAILED:", err);
//       alert("❌ PDF download failed! Check browser console for details.\n\nError: " + err.message);
//     }
    
//     setDownloading(false);
//   };

//   const printReport = () => {
//     window.print();
//   };

//   if (loading) {
//     return <div className="p-10 text-center font-bold text-xl text-blue-800">Loading report...</div>;
//   }

//   if (!reportData) {
//     return <div className="p-10 text-center font-bold text-red-600">REPORT DATA NOT FOUND.</div>;
//   }

//   return (
//     <section className="bg-gray-200 py-12 px-4 font-sans text-gray-900">
//       <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-4 print:hidden">
//         <button onClick={printReport} className="px-4 py-2 bg-slate-600 text-white rounded flex items-center gap-2 hover:bg-slate-700">
//           <Printer size={18} /> Print
//         </button>
//         <button 
//           onClick={downloadPDF} 
//           disabled={downloading} 
//           className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {downloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
//           {downloading ? 'Generating PDF...' : 'Download PDF'}
//         </button>
//       </div>

//       <div id="report-content" className="max-w-4xl mx-auto bg-white p-12 text-gray-900 font-sans shadow-lg">
        
//         <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b-2 border-orange-200 pb-6">
//           <div>
//             <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">CAR CHECK EXPERTS</h1>
//             <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">Pre Purchase Inspection Report</p>
//           </div>
//           <div className="mt-4 md:mt-0 text-right">
//             <p className="text-sm font-bold bg-slate-100 px-3 py-1 rounded inline-block mb-2">Report ID: {reportData.reportId}</p>
//             <div className="flex items-center gap-2 justify-end">
//                 <span className="text-sm font-semibold">Overall Rating:</span> 
//                 <StarRatingDisplay rating={reportData.overallRating} />
//             </div>
//           </div>
//         </header>

//         <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <ReportRow label="Customer Name" value={reportData.customerName} />
//           <ReportRow label="Date/Time" value={new Date(reportData.date).toLocaleString()} />
//           <ReportRow label="Type of Inspection" value={reportData.typeOfInspection} />
//           <ReportRow label="Year/Make/Model" value={reportData.yearMakeModel} />
//         </div>

//         <SectionHeader title="Vehicle Summary" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-white p-4">
//           {Object.entries(reportData.vehicleSummary).map(([key, value]) => (
//             <ReportRow key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Wheel and Tyre Condition" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <TyreInfo side="Front LHS" data={reportData.wheels.frontLhs} />
//           <TyreInfo side="Front RHS" data={reportData.wheels.frontRhs} />
//           <TyreInfo side="Rear LHS" data={reportData.wheels.rearLhs} />
//           <TyreInfo side="Rear RHS" data={reportData.wheels.rearRhs} />
//         </div>

//         <SectionHeader title="Paint and Body Appraisal" />
//         <div className="flex flex-col md:flex-row gap-8 items-center border p-6 rounded-lg mb-8">
//           <div className="w-full md:w-1/2 flex justify-center border-r pr-4">
//             <img src="/CarImage.png" alt="Car Diagram" className="max-w-[200px] object-contain" crossOrigin="anonymous" />
//           </div>
//           <div className="w-full md:w-1/2">
//             {reportData.paintAndBody.selectedParts?.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm font-bold text-gray-700 mb-2 uppercase border-b pb-1">Selected Defects</p>
//                 <div className="bg-slate-50 p-3 rounded">
//                   {reportData.paintAndBody.selectedParts.map(p => (
//                     <p key={p.id} className="text-sm mb-1"><span className="font-bold text-red-600">{p.id}. {p.name}</span>: {p.defect}</p>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <p className="text-sm font-bold text-gray-700 mb-2 uppercase border-b pb-1">Inspection Notes</p>
//             <p className="text-sm text-gray-800 bg-slate-50 p-3 rounded min-h-[50px]">{reportData.paintAndBody.notes || 'No remarks.'}</p>
//           </div>
//         </div>

//         <SectionHeader title="Engine Transmission Inspection" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
//           {Object.entries(reportData.engineTransmission).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>
//         {reportData.engineTransmission.comments && (
//           <div className="mt-4 p-4 bg-orange-50 rounded border border-orange-100">
//             <p className="text-sm font-bold text-orange-800">Comments:</p>
//             <p className="text-sm text-gray-800 mt-1">{reportData.engineTransmission.comments}</p>
//           </div>
//         )}

//         <SectionHeader title="Suspension, Steering and Brake Inspection" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
//           {Object.entries(reportData.suspensionSteering).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Interiors, Electricals and Lightings" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
//           {Object.entries(reportData.interiors).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Battery Analysis" />
//         <div className="w-1/2">
//             <ReportRow label="Battery Report" value={reportData.batteryAnalysis["BATTERY REPORT"]} />
//         </div>

//         <SectionHeader title="Other Specifications" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
//           {Object.entries(reportData.otherSpecifications).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Diagnostic Report" />
//         <div className="bg-slate-50 p-6 rounded border">
//             {reportData.diagnosticReport.immediateAttention && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
//                 <p className="text-sm font-bold text-red-800 uppercase mb-1">Immediate Attention Required</p>
//                 <p className="text-sm text-red-900">{reportData.diagnosticReport.immediateAttention}</p>
//             </div>
//             )}
//             <p className="text-sm font-bold text-gray-700 uppercase mb-1 border-b pb-1">Diagnostic Comments</p>
//             <p className="text-sm text-gray-800 mt-2">{reportData.diagnosticReport.comments || 'No diagnostic comments provided.'}</p>
//         </div>

//         <SectionHeader title="Road Test Remarks" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
//           {Object.entries(reportData.roadTest).filter(([k]) => k !== 'comments').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <div className="mt-16 pt-8 border-t-2 border-slate-200 flex justify-between items-center text-xs text-gray-500 font-semibold uppercase tracking-wider">
//           <p>© {new Date().getFullYear()} Car Check Experts. All rights reserved.</p>
//           <p>Generated on {new Date().toLocaleDateString()}</p>
//         </div>
//       </div>
//     </section>
//   );
// }


//????????????????????????________________________________________________________________________________________________________________________________________________________________
// import { useLocation, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Star, Download, Printer } from "lucide-react";

// const API_URL = "http://localhost:5001/api";

// const SectionHeader = ({ title }) => (
//   <h2 className="text-sm font-bold uppercase tracking-wider bg-orange-100 text-orange-800 p-2 my-6">
//     {title}
//   </h2>
// );

// const ReportRow = ({ label, value }) => (
//   <div className="flex justify-between items-center py-2 border-b border-slate-200">
//     <p className="text-sm font-semibold uppercase text-gray-600">{label}</p>
//     <p className="text-sm text-gray-800">{value}</p>
//   </div>
// );

// const TyreInfo = ({ side, data }) => {
//   if (!data) return null;
//   return (
//     <div className="mb-6">
//       <h3 className="text-sm font-bold uppercase bg-blue-100 text-blue-800 p-2">{side} Tyre</h3>
//       <div className="pl-4">
//         <ReportRow label="Manufacturer" value={data.manufacturer || 'N/A'} />
//         <ReportRow label="Year" value={data.year || 'N/A'} />
//         <ReportRow label="Tyre Size" value={data.tyreSize || 'N/A'} />
//         <ReportRow label="Condition" value={data.condition || 'N/A'} />
//         <ReportRow label="Wheel Alloys" value={data.wheelAlloys || 'N/A'} />
//       </div>
//     </div>
//   );
// };

// const StarRatingDisplay = ({ rating }) => (
//   <div className="flex gap-1">
//     {[1,2,3,4,5].map(star => (
//       <Star key={star} size={16} className={`${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
//     ))}
//   </div>
// );

// export default function Report() {
//   const { state } = useLocation();
//   const { id } = useParams();
//   const [reportData, setReportData] = useState(state?.finalReportData || null);
//   const [loading, setLoading] = useState(!state?.finalReportData);

//   useEffect(() => {
//     // If no state, fetch from API
//     if (!reportData && id) {
//       fetch(`${API_URL}/reports/${id}`)
//         .then(res => res.json())
//         .then(data => {
//           if (data.success) {
//             // Reconstruct data from database format
//             const r = data.report;
//             setReportData({
//               reportId: r.report_id,
//               customerName: r.customer_name,
//               overallRating: r.overall_rating,
//               date: r.inspection_date,
//               typeOfInspection: r.inspection_type,
//               yearMakeModel: r.year_make_model,
//               vehicleSummary: r.vehicle_data,
//               wheels: r.wheels_data,
//               paintAndBody: r.paint_body_data,
//               engineTransmission: r.engine_transmission,
//               suspensionSteering: r.suspension_steering,
//               interiors: r.interiors,
//               batteryAnalysis: r.battery_analysis,
//               otherSpecifications: r.other_specs,
//               diagnosticReport: r.diagnostic_report,
//               roadTest: r.road_test,
//             });
//           }
//           setLoading(false);
//         });
//     }
//   }, [id, reportData]);

//   const downloadPDF = async () => {
//     const { jsPDF } = await import('jspdf');
//     const html2canvas = (await import('html2canvas')).default;
    
//     const reportElement = document.getElementById("report-content");
//     const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: '#FFFFFF' });
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
//     pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`Car-Inspection-${reportData.reportId}.pdf`);
//   };

//   const printReport = () => {
//     window.print();
//   };

//   if (loading) {
//     return <div className="p-10 text-center">Loading report...</div>;
//   }

//   if (!reportData) {
//     return <div className="p-10 text-center font-bold text-red-600">REPORT DATA NOT FOUND.</div>;
//   }

//   return (
//     <section className="bg-gray-200 py-12 px-4">
//       <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-4 print:hidden">
//         <button onClick={printReport} className="px-4 py-2 bg-slate-600 text-white rounded flex items-center gap-2">
//           <Printer size={18} /> Print
//         </button>
//         <button onClick={downloadPDF} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2">
//           <Download size={18} /> Download PDF
//         </button>
//       </div>

//       <div id="report-content" className="max-w-4xl mx-auto bg-white p-12 text-gray-900 font-sans">
        
//         <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b pb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-blue-800">CAR CHECK EXPERTS.COM</h1>
//             <p className="text-sm text-gray-500">Pre Purchase Inspection Report</p>
//           </div>
//           <div className="mt-4 md:mt-0 text-right">
//             <p className="text-sm font-semibold">Report ID: {reportData.reportId}</p>
//             <p className="text-sm">Overall Rating: <StarRatingDisplay rating={reportData.overallRating} /></p>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//           <ReportRow label="Customer Name" value={reportData.customerName} />
//           <ReportRow label="Date/Time" value={new Date(reportData.date).toLocaleString()} />
//           <ReportRow label="Type of Inspection" value={reportData.typeOfInspection} />
//           <ReportRow label="Year/Make/Model" value={reportData.yearMakeModel} />
//         </div>

//         <SectionHeader title="Vehicle Summary" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {Object.entries(reportData.vehicleSummary).map(([key, value]) => (
//             <ReportRow key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Wheel and Tyre Condition" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <TyreInfo side="Front LHS" data={reportData.wheels.frontLhs} />
//           <TyreInfo side="Front RHS" data={reportData.wheels.frontRhs} />
//           <TyreInfo side="Rear LHS" data={reportData.wheels.rearLhs} />
//           <TyreInfo side="Rear RHS" data={reportData.wheels.rearRhs} />
//         </div>

//         <SectionHeader title="Paint and Body Appraisal" />
//         <div className="flex flex-col md:flex-row gap-8 items-center">
//           <div className="w-full md:w-1/2">
//             <img src="/CarImage.png" alt="Car Diagram" className="w-full object-contain" />
//           </div>
//           <div className="w-full md:w-1/2">
//             {reportData.paintAndBody.selectedParts?.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm font-bold text-gray-700">Selected Defects:</p>
//                 <div className="p-3 bg-slate-100 rounded">
//                   {reportData.paintAndBody.selectedParts.map(p => (
//                     <p key={p.id} className="text-sm"><b>{p.id}. {p.name}</b>: {p.defect}</p>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <p className="text-sm font-bold text-gray-700">Inspection Notes:</p>
//             <p className="text-sm text-gray-800">{reportData.paintAndBody.notes}</p>
//           </div>
//         </div>

//         <SectionHeader title="Engine Transmission Inspection" />
//         <div className="space-y-2">
//           {Object.entries(reportData.engineTransmission).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>
//         {reportData.engineTransmission.comments && (
//           <div className="mt-4 p-3 bg-slate-100 rounded">
//             <p className="text-sm font-semibold">Comments: {reportData.engineTransmission.comments}</p>
//           </div>
//         )}

//         <SectionHeader title="Suspension, Steering and Brake Inspection" />
//         <div className="space-y-2">
//           {Object.entries(reportData.suspensionSteering).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Interiors, Electricals and Lightings" />
//         <div className="space-y-2">
//           {Object.entries(reportData.interiors).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Battery Analysis" />
//         <ReportRow label="Battery Report" value={reportData.batteryAnalysis["BATTERY REPORT"]} />

//         <SectionHeader title="Other Specifications" />
//         <div className="space-y-2">
//           {Object.entries(reportData.otherSpecifications).filter(([k]) => k !== 'comments' && k !== 'images').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <SectionHeader title="Diagnostic Report" />
//         {reportData.diagnosticReport.immediateAttention && (
//           <div className="p-3 bg-red-100 rounded mb-4">
//             <p className="text-sm font-bold text-red-700">Immediate Attention Required:</p>
//             <p className="text-sm text-red-800">{reportData.diagnosticReport.immediateAttention}</p>
//           </div>
//         )}
//         {reportData.diagnosticReport.comments && (
//           <div className="p-3 bg-slate-100 rounded">
//             <p className="text-sm font-semibold">Comments: {reportData.diagnosticReport.comments}</p>
//           </div>
//         )}

//         <SectionHeader title="Road Test Remarks" />
//         <div className="space-y-2">
//           {Object.entries(reportData.roadTest).filter(([k]) => k !== 'comments').map(([key, value]) => (
//             <ReportRow key={key} label={key} value={value} />
//           ))}
//         </div>

//         <div className="mt-12 pt-6 border-t text-center text-xs text-gray-500">
//           <p>Generated by Car Check Experts</p>
//           <p>Report ID: {reportData.reportId} | Date: {new Date().toLocaleDateString()}</p>
//         </div>
//       </div>
//     </section>
//   );
// }