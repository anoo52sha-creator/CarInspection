

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
 import { CheckCircle, XCircle } from "lucide-react";


// --- Reusable Display Components for the new format ---
const SectionHeader = ({ title }) => (
  <h2 className="text-sm font-bold uppercase tracking-wider bg-orange-100 text-orange-800 p-2 my-6">
    {title}
  </h2>
);

const ReportRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b">
    <p className="text-sm font-semibold uppercase text-gray-600">{label}</p>
    <p className="text-sm text-gray-800">{value}</p>
  </div>
);

const TyreInfo = ({ side, data }) => {
  // If data for this wheel doesn't exist, don't render anything
  if (!data) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold uppercase bg-blue-100 text-blue-800 p-2">{side} Tyre</h3>
      <div className="pl-4">
        <ReportRow label="Manufacturer" value={data.manufacturer || 'N/A'} />
        <ReportRow label="Year" value={data.year || 'N/A'} />
        <ReportRow label="Wheel/Alloys" value={data.wheelAlloys || 'N/A'} />
      </div>
    </div>
  );
};

export default function Result() {
  const { state } = useLocation();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // This logic remains the same: it safely gets the data from the previous page
    if (state?.finalReportData) {
      setReportData(state.finalReportData);
    }
  }, [state]);

  const downloadPDF = async () => {
    const reportElement = document.getElementById("report-content");
    if (!reportElement) return;

    // We'll use a white background for the PDF canvas
    const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: '#FFFFFF' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(canvas.toDataURL('image/jpg', 1.0), 'JPG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Car-Inspection-Report.pdf`);
  };

  if (!reportData) {
    return <div className="p-10 text-center font-bold text-red-600">REPORT DATA NOT FOUND.</div>;
  }

  // Destructure the data for easier use
  const { reportInfo, imageUrls, vehicleSummary, wheels, paintAndBody, engineTransmission } = reportData;

  return (
    <section className="bg-gray-200 py-12 px-4">
      {/* This is the container that gets converted to a PDF */}
      <div id="report-content" className="max-w-3xl mx-auto bg-white p-12 text-gray-900 font-sans">
        
        {/* === HEADER & LOGO === */}
        <header className="flex items-center justify-center mb-10">
          <img src="/logo.jpg" alt="Car Inspection Logo" className="h-20 mr-4" /> 
          {/* Make sure you have a logo.png in your `public` folder */}
        </header>

        <ReportRow label="Report ID" value={reportInfo.referenceNo} />
        <ReportRow label="Customer Name" value={reportData.customerName} />
        <ReportRow label="Type of Inspection" value={reportData.typeOfInspection} />
        
        {/* === VEHICALS EXTERNAL PICTURES === */}
        <SectionHeader title="Vehicals External Pictures" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          {imageUrls && imageUrls.map((url, i) => (
            <img key={i} src={url} alt={`Vehicle Image ${i+1}`} className="w-full object-cover rounded border" />
          ))}
        </div>

        {/* === VEHICLE SUMMARY === */}
        <SectionHeader title="Vehicle Summary" />
        <ReportRow label="VIN Number" value={vehicleSummary.vin} />
        <ReportRow label="Vehicle Type" value={vehicleSummary.vehicleType} />
        <ReportRow label="Engine Size" value={vehicleSummary.engineSize} />
        <ReportRow label="External Color" value={vehicleSummary.externalColor} />
        <ReportRow label="Specs" value={vehicleSummary.specs} />

        {/* === INSPECTION REPORT === */}
        <SectionHeader title="Inspection Report:" />
        
        {/* Wheel and Tyre Condition */}
        <SectionHeader title="Wheel and Tyre Condition" />
        <TyreInfo side="Front LHS" data={wheels?.frontLhs} />
        <TyreInfo side="Front RHS" data={wheels?.frontRhs} />
        <TyreInfo side="Rear LHS" data={wheels?.rearLhs} />
        <TyreInfo side="Rear RHS" data={wheels?.rearRhs} />

        {/* Paint and Body Appraisal */}
        <SectionHeader title="Paint and Body Appraisal" />
        {/* You can add the car diagram SVG here */}
        <div className="mb-4 text-center text-gray-500 italic">(Car Diagram Placeholder)</div>
        <div className="pl-4">
          {paintAndBody.map((item, i) => (
            <ReportRow key={i} label={item.panel} value={item.status} />
          ))}
        </div>

        {/* Engine Transmission Inspection */}
        <SectionHeader title="Engine Transmission Inspection" />
        <div className="pl-4">
          {engineTransmission.map((item, i) => (
            <ReportRow key={i} label={item.item} value={item.status} />
          ))}
        </div>

        {/* ... Add other sections here following the same pattern ... */}

      </div>

      <div className="text-center mt-10">
        <button onClick={downloadPDF} className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold text-lg">
          Download PDF
        </button>
      </div>
    </section>
  );
}





// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
//  import { CheckCircle, XCircle } from "lucide-react";


// // --- Reusable Display Components for the new format ---
// const SectionHeader = ({ title }) => (
//   <h2 className="text-sm font-bold uppercase tracking-wider bg-orange-100 text-orange-800 p-2 my-6">
//     {title}
//   </h2>
// );

// const ReportRow = ({ label, value }) => (
//   <div className="flex justify-between items-center py-2 border-b">
//     <p className="text-sm font-semibold uppercase text-gray-600">{label}</p>
//     <p className="text-sm text-gray-800">{value}</p>
//   </div>
// );

// const TyreInfo = ({ side, data }) => {
//   // If data for this wheel doesn't exist, don't render anything
//   if (!data) return null;

//   return (
//     <div className="mb-6">
//       <h3 className="text-sm font-bold uppercase bg-blue-100 text-blue-800 p-2">{side} Tyre</h3>
//       <div className="pl-4">
//         <ReportRow label="Manufacturer" value={data.manufacturer || 'N/A'} />
//         <ReportRow label="Year" value={data.year || 'N/A'} />
//         <ReportRow label="Wheel/Alloys" value={data.wheelAlloys || 'N/A'} />
//       </div>
//     </div>
//   );
// };

// export default function Result() {
//   const { state } = useLocation();
//   const [reportData, setReportData] = useState(null);

//   useEffect(() => {
//     // This logic remains the same: it safely gets the data from the previous page
//     if (state?.finalReportData) {
//       setReportData(state.finalReportData);
//     }
//   }, [state]);

//   const downloadPDF = async () => {
//     const reportElement = document.getElementById("report-content");
//     if (!reportElement) return;

//     // We'll use a white background for the PDF canvas
//     const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: '#FFFFFF' });
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
//     pdf.addImage(canvas.toDataURL('image/jpg', 1.0), 'JPG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`Car-Inspection-Report.pdf`);
//   };

//   if (!reportData) {
//     return <div className="p-10 text-center font-bold text-red-600">REPORT DATA NOT FOUND.</div>;
//   }

//   // Destructure the data for easier use
//   const { reportInfo, imageUrls, vehicleSummary, wheels, paintAndBody, engineTransmission } = reportData;

//   return (
//     <section className="bg-gray-200 py-12 px-4">
//       {/* This is the container that gets converted to a PDF */}
//       <div id="report-content" className="max-w-3xl mx-auto bg-white p-12 text-gray-900 font-sans">
        
//         {/* === HEADER & LOGO === */}
//         <header className="flex items-center justify-center mb-10">
//           <img src="/logo.jpg" alt="Car Inspection Logo" className="h-20 mr-4" /> 
//           {/* Make sure you have a logo.png in your `public` folder */}
//         </header>

//         <ReportRow label="Report ID" value={reportInfo.referenceNo} />
//         <ReportRow label="Customer Name" value={reportData.customerName} />
//         <ReportRow label="Type of Inspection" value={reportData.typeOfInspection} />
        
//         {/* === VEHICALS EXTERNAL PICTURES === */}
//         <SectionHeader title="Vehicals External Pictures" />
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           {imageUrls && imageUrls.map((url, i) => (
//             <img key={i} src={url} alt={`Vehicle Image ${i+1}`} className="w-full object-cover rounded border" />
//           ))}
//         </div>

//         {/* === VEHICLE SUMMARY === */}
//         <SectionHeader title="Vehicle Summary" />
//         <ReportRow label="VIN Number" value={vehicleSummary.vin} />
//         <ReportRow label="Vehicle Type" value={vehicleSummary.vehicleType} />
//         <ReportRow label="Engine Size" value={vehicleSummary.engineSize} />
//         <ReportRow label="External Color" value={vehicleSummary.externalColor} />
//         <ReportRow label="Specs" value={vehicleSummary.specs} />

//         {/* === INSPECTION REPORT === */}
//         <SectionHeader title="Inspection Report:" />
        
//         {/* Wheel and Tyre Condition */}
//         <SectionHeader title="Wheel and Tyre Condition" />
//         <TyreInfo side="Front LHS" data={wheels?.frontLhs} />
//         <TyreInfo side="Front RHS" data={wheels?.frontRhs} />
//         <TyreInfo side="Rear LHS" data={wheels?.rearLhs} />
//         <TyreInfo side="Rear RHS" data={wheels?.rearRhs} />

//         {/* Paint and Body Appraisal */}
//         <SectionHeader title="Paint and Body Appraisal" />
//         {/* You can add the car diagram SVG here */}
//         <div className="mb-4 text-center text-gray-500 italic">(Car Diagram Placeholder)</div>
//         <div className="pl-4">
//           {paintAndBody.map((item, i) => (
//             <ReportRow key={i} label={item.panel} value={item.status} />
//           ))}
//         </div>

//         {/* Engine Transmission Inspection */}
//         <SectionHeader title="Engine Transmission Inspection" />
//         <div className="pl-4">
//           {engineTransmission.map((item, i) => (
//             <ReportRow key={i} label={item.item} value={item.status} />
//           ))}
//         </div>

//         {/* ... Add other sections here following the same pattern ... */}

//       </div>

//       <div className="text-center mt-10">
//         <button onClick={downloadPDF} className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold text-lg">
//           Download PDF
//         </button>
//       </div>
//     </section>
//   );
// }








