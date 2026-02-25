import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Edit, Check, X, FileText, Camera, Settings, Paintbrush, Upload, Trash2 } from "lucide-react";

// The single source of truth, based on the Excel sheet.
const initialState = {
  // Header
  reportId: "1",
  customerName: "SYC",
  overallRating: "5", 
  date: "19/02/2026 - 10:00AM",
  typeOfInspection: "PPI - 299AED",
  yearMakeModel: "2021 ALFA ROMEO GIULIETTA VELOCE",

  // Vehicle Summary
  vehicleSummary: {
    vinNumber: "ZARCABC46M7550853",
    mileage: "33899",
    vehicleType: "HATCH BACK",
    noOfCylinders: "4",
    engineSize: "1.4L",
    horsepower: "105HP",
    externalColor: "BLUE",
    fuelType: "PATROL",
    specs: "GCC",
  },
  
  // Images (handled separately)
  images: [],
  imagePreviews: [],

  // Wheels
  wheels: {
    frontLhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS" },
    frontRhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS" },
    rearLhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS" },
    rearRhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS" },
  },

  // Paint and Body
  paintAndBody: {
    notes: "REAR LHS DOOR REPAINT, REAR LHS QP SMART PAINT",
    highlightedParts: ['part_1', 'part_5'], 
  },
  
  // Checklists with "Okay/Not Okay/Custom"
  engineTransmission: {
    "ENGINE VISUAL CONDITION": "OKAY",
    "ENGINE START": "NORMAL",
    "ENGINE SHIELD COVER": "OKAY",
    "ENGINE TRANSMISSION MOUNTS": "OKAY",
    "TRANSMISSION FLUID(OPTIONAL)": "-",
    "DRIVE BELT / PULLEY": "OKAY",
    "FUSE BOX": "OKAY",
    comments: "",
    images: [],
  },
  suspensionSteering: {
    "STEERING MECHANISM": "OKAY",
    "STEERING RACK": "OKAY",
    "FRONT BRAKE PADS": "OKAY",
    "FRONT BRAKE ROTOR": "MINOR RUST", 
    comments: "",
    images: [],
  },
  interiors: {
    "DASHBOARD SWITCHES": "OKAY - WORKING",
    "CLUSTER NOTIFICATIONS": "NO FAULTS FOUND",
    "REMOTE KEY": "OKAY",
    comments: "",
    images: [],
  },
};

// --- The Combo Box Component ---
const StatusSelector = ({ value, onChange }) => {
  const options = ["OKAY", "NOT OKAY", "N/A", "WORKING FINE", "NORMAL"];
  const isCustom = !options.includes(value) && value !== "";

  return (
    <div className="flex gap-2">
      <select 
        value={isCustom ? "custom" : value} 
        onChange={(e) => onChange(e.target.value === 'custom' ? '' : e.target.value)}
        className="w-full p-2 border-slate-300 border rounded bg-slate-50 text-slate-900"
      >
        <option value="">Select Status</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        <option value="custom">Custom...</option>
      </select>
      {isCustom && (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border-blue-400 border rounded bg-white text-slate-900"
          placeholder="Enter custom status"
        />
      )}
    </div>
  );
};

// --- The Checklist Form Component ---
const ChecklistSection = ({ title, data, sectionName, onChange }) => {
  const items = Object.keys(data).filter(key => key !== 'comments' && key !== 'images');
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4 p-2 bg-orange-100">{title}</h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item} className="grid grid-cols-[2fr_3fr] items-center gap-4">
            <label className="font-semibold text-sm text-slate-700">{item}</label>
            <StatusSelector 
              value={data[item]} 
              onChange={(newValue) => onChange(sectionName, item, newValue)}
            />
          </div>
        ))}
        <div className="mt-4">
            <label className="font-semibold text-sm text-slate-700">Comments</label>
            <textarea value={data.comments} onChange={(e) => onChange(sectionName, 'comments', e.target.value)} className="w-full mt-1 p-2 border-slate-300 border rounded bg-slate-50 text-slate-900" rows="2" />
        </div>
      </div>
    </div>
  );
};

// --- The Paint & Body Appraisal Component ---
const CarDiagram = ({ highlightedParts, onPartClick }) => {
  const parts = [
    { id: 'part_1', name: 'Front Bumper', style: { top: '85%', left: '40%' } },
    { id: 'part_2', name: 'Bonnet', style: { top: '65%', left: '45%' } },
    { id: 'part_3', name: 'Roof', style: { top: '40%', left: '45%' } },
    { id: 'part_4', name: 'Rear Bumper', style: { top: '5%', left: '40%' } },
    { id: 'part_5', name: 'Front Right Door', style: { top: '50%', left: '70%' } },
    { id: 'part_6', name: 'Rear Right Door', style: { top: '30%', left: '70%' } },
  ];

  return (
    <div className="relative w-48 h-96 mx-auto bg-gray-200 rounded-md p-4">
       <p className="text-center text-xs text-gray-500">SVG Car Diagram Placeholder</p>
       {parts.map(part => (
         <button
           key={part.id}
           type="button"
           onClick={() => onPartClick(part.id)}
           style={part.style}
           className={`absolute w-10 h-10 rounded-full border-2 transition-all ${highlightedParts.includes(part.id) ? 'bg-red-500 border-red-700' : 'bg-blue-300/50 border-blue-500'}`}
         >
           <span className="text-white text-xs font-bold">{part.name.charAt(0)}</span>
         </button>
       ))}
    </div>
  );
};

export default function CreateReport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("header");
  const [formData, setFormData] = useState(initialState);
  
  const handleDataChange = (section, name, value) => {
    setFormData(p => ({ ...p, [section]: { ...p[section], [name]: value } }));
  };

  const handlePaintPartClick = (partId) => {
    setFormData(p => {
        const currentParts = p.paintAndBody.highlightedParts;
        const newParts = currentParts.includes(partId)
          ? currentParts.filter(id => id !== partId)
          : [...currentParts, partId];
        return { ...p, paintAndBody: { ...p.paintAndBody, highlightedParts: newParts } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Navigate and pass data logic
    navigate("/report", { state: { finalReportData: formData } });
  };

  // ADDED: "Wheels & Tyres" to the tabs array
  const tabs = [
    { id: "header", label: "Report Info" },
    { id: "vehicleSummary", label: "Vehicle Summary" },
    { id: "wheels", label: "Wheels & Tyres" }, 
    { id: "paintAndBody", label: "Paint & Body" },
    { id: "engine", label: "Engine" },
    { id: "suspension", label: "Suspension" },
  ];
  
  return (
    <div className="min-h-screen bg-white p-8 text-slate-900">
      <h1 className="text-3xl font-bold text-center mb-8">Create Car Check Experts Report</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded font-semibold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                {tab.label}
              </button>
            ))}
        </div>

        <div className="max-w-4xl mx-auto">
            
            {/* ADDED: Missing Report Info Tab UI */}
            {activeTab === 'header' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 p-2 bg-orange-100">Report Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-sm text-slate-700">Report ID</label>
                    <input type="text" value={formData.reportId} onChange={(e) => setFormData({...formData, reportId: e.target.value})} className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 border" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-slate-700">Customer Name</label>
                    <input type="text" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 border" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-slate-700">Overall Rating (Stars)</label>
                    <input type="number" min="1" max="5" value={formData.overallRating} onChange={(e) => setFormData({...formData, overallRating: e.target.value})} className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 border" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-slate-700">Date/Time</label>
                    <input type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 border" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-slate-700">Type of Inspection</label>
                    <input type="text" value={formData.typeOfInspection} onChange={(e) => setFormData({...formData, typeOfInspection: e.target.value})} className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 border" />
                  </div>
                  <div>
                    <label className="font-semibold text-sm text-slate-700">Year/Make/Model</label>
                    <input type="text" value={formData.yearMakeModel} onChange={(e) => setFormData({...formData, yearMakeModel: e.target.value})} className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 border" />
                  </div>
                </div>
              </div>
            )}

            {/* ADDED: Missing Vehicle Summary Tab UI */}
            {activeTab === 'vehicleSummary' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 p-2 bg-orange-100">Vehicle Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(formData.vehicleSummary).map((key) => (
                    <div key={key}>
                      <label className="font-semibold text-sm text-slate-700 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input 
                        type="text" 
                        value={formData.vehicleSummary[key]} 
                        onChange={(e) => handleDataChange('vehicleSummary', key, e.target.value)} 
                        className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 border" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADDED: Missing Wheel and Tyre Conditions Tab UI */}
            {activeTab === 'wheels' && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 p-2 bg-orange-100">Wheel and Tyre Condition</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(formData.wheels).map((wheelKey) => (
                    <div key={wheelKey} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                      <h3 className="font-bold text-blue-800 mb-3 uppercase border-b border-blue-200 pb-2">
                        {wheelKey.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="space-y-3">
                        {Object.keys(formData.wheels[wheelKey]).map((field) => (
                          <div key={field}>
                            <label className="text-xs font-semibold text-slate-600 uppercase">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input 
                              type="text" 
                              value={formData.wheels[wheelKey][field]} 
                              onChange={(e) => {
                                setFormData(p => ({
                                  ...p,
                                  wheels: {
                                    ...p.wheels,
                                    [wheelKey]: { ...p.wheels[wheelKey], [field]: e.target.value }
                                  }
                                }))
                              }} 
                              className="w-full mt-1 p-2 border-slate-300 rounded bg-white border text-sm" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'engine' && <ChecklistSection title="Engine Transmission Inspection" data={formData.engineTransmission} sectionName="engineTransmission" onChange={handleDataChange}/>}
            {activeTab === 'suspension' && <ChecklistSection title="Suspension, Steering and Brake Inspection" data={formData.suspensionSteering} sectionName="suspensionSteering" onChange={handleDataChange}/>}
            
            {activeTab === 'paintAndBody' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4 p-2 bg-orange-100">Paint and Body Appraisal</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <CarDiagram highlightedParts={formData.paintAndBody.highlightedParts} onPartClick={handlePaintPartClick} />
                    <div>
                        <p className="text-sm font-semibold mb-2">Highlighted Parts:</p>
                        <div className="p-4 bg-slate-100 rounded-md min-h-[100px] text-sm text-slate-700">
                            {formData.paintAndBody.highlightedParts.join(', ')}
                        </div>
                        <label className="font-semibold text-sm text-slate-700 mt-4 block">Inspection Notes</label>
                        <textarea value={formData.paintAndBody.notes} onChange={(e) => handleDataChange('paintAndBody', 'notes', e.target.value)} className="w-full mt-1 p-2 border-slate-300 border rounded bg-slate-50 text-slate-900" rows="4" />
                    </div>
                  </div>
                </div>
            )}
            
        </div>
        <div className="text-center mt-8">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-8 py-3 rounded-lg font-bold">
            Generate & Preview
          </button>
        </div>
      </form>
    </div>
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








