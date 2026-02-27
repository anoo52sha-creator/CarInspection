import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Upload, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

//const API_URL = "http://localhost:5001/api";
const API_URL = "https://car-inspection-two.vercel.app/api";


const initialState = {
  reportId: "SYC-" + Math.floor(1000 + Math.random() * 9000),
  customerName: "Mohammad",
  overallRating: 4,
  date: new Date(),
  typeOfInspection: "PPI - 299AED",
  yearMakeModel: "2021 ALFA ROMEO GIULIETTA VELOCE",

  vehicleSummary: {
    vinNumber: "ZARCABC46M7550853",
    mileage: "33893",
    vehicleType: "HATCH BACK",
    noOfCylinders: "4",
    engineSize: "1.4L",
    horsePower: "105HP",
    externalColor: "BLUE",
    fuelType: "PATROL",
    specs: "GCC",
    vehicleRegNo: "ABC123", // 👈 ADDED
  },

  wheels: {
    frontLhs: { 
      manufacturer: "NEXEN", 
      year: "2025", 
      tyreSize: "225/40ZR18", 
      condition: "GOOD", 
      wheelAlloys: "ALLOY WHEELS",
      images: [] // 👈 ADDED
    },
    frontRhs: { 
      manufacturer: "NEXEN", 
      year: "2025", 
      tyreSize: "225/40ZR18", 
      condition: "GOOD", 
      wheelAlloys: "ALLOY WHEELS",
      images: [] // 👈 ADDED
    },
    rearLhs: { 
      manufacturer: "NEXEN", 
      year: "2025", 
      tyreSize: "225/40ZR18", 
      condition: "GOOD", 
      wheelAlloys: "ALLOY WHEELS",
      images: [] // 👈 ADDED
    },
    rearRhs: { 
      manufacturer: "NEXEN", 
      year: "2025", 
      tyreSize: "225/40ZR18", 
      condition: "GOOD", 
      wheelAlloys: "ALLOY WHEELS",
      images: [] // 👈 ADDED
    },
  },

  paintAndBody: { selectedParts: [], notes: "", images: [] },

  engineTransmission: {
    "ENGINE VISUAL CONDITION": "OKAY",
    "ENGINE START": "NORMAL",
    "ENGINE SHIELD COVER": "OKAY",
    "ENGINE TRANSMISSION MOUNTS": "OKAY",
    "TRANSMISSION FLUID(OPTIONAL)": "-",
    "DRIVE BELT / PULLEY": "OKAY",
    "FUSE BOX": "OKAY",
    "HOOD STAY": "OKAY",
    "RADIATOR CONDITION": "OKAY",
    "RADIATOR CAP": "OKAY",
    "RADIATOR FAN MOTOR": "OKAY",
    "ENGINE OIL FILLER CAP": "OKAY",
    "AC HOSES": "OKAY",
    "COOLANT LEVEL": "OKAY",
    "COOLANT HEATER HOSES": "OKAY",
    "COOLANT TANK/CAP": "OKAY",
    "EXHAUST SMOKE": "OKAY",
    "WASHER FLUID CAP": "OKAY",
    "FUEL FILLER CAP": "OKAY",
    comments: "",
    images: [],
  },

  suspensionSteering: {
    "STEERING MECHANISM": "OKAY",
    "STEERING RACK": "OKAY",
    "FRONT BRAKE PADS": "OKAY",
    "REAR BRAKE PADS/DRUM": "OKAY",
    "FRONT BRAKE ROTOR": "MINOR RUST",
    "REAR BRAKE ROTOR": "OKAY",
    // ABS: "OKAY",
    "PARKING BRAKE MECHANISM": "OKAY",
    "FRONT SHOCK ABSORBERS": "OKAY",
    "REAR SHOCK ABSORBERS": "OKAY",
    "FRONT AXLE": "OKAY",
    "REAR AXLE": "OKAY",
    "FRONT SUSPENSION BUSHES": "N/A",
    "REAR SUSPENSION BUSHES": "OKAY",
    comments: "",
    images: [],
  },

  interiors: {
    "DASHBOARD SWITCHES": "OKAY - WORKING",
    "CLUSTER NOTIFICATIONS": "NO FAULTS FOUND",
    "REMOTE KEY": "OKAY",
    "POWER WINDOW SWITCHES": "OKAY - WORKING",
    "ROOF SWITCHES/ROOF LIGHTS": "OKAY - WORKING",
    UPHOLSTERY: "OKAY",
    "SEAT CONDITION": "OKAY",
    "SEAT UNDER FRAME": "OKAY",
    "ARM REST/CONSOLE BOX": "OKAY",
    "SUN VISORS": "OKAY",
    "SIDE / CENTER MIRRORS": "OKAY",
    "HEAD LAMPS": "OKAY",
    "TAIL LAMPS": "OKAY",
    "AIR CONDITIONING": "OKAY",
    "AC VENTS/AIR FLOW": "OKAY",
    "DOOR BEEDINGS": "OKAY",
    "DOOR HINGES": "OKAY",
    "TAIL GATE STAY": "OKAY",
    comments: "",
    images: [],
  },

  batteryAnalysis: { "BATTERY REPORT": "GOOD", comments: "", images: [] },

  otherSpecifications: {
    "DRIVE TYPE": "FWD",
    "PARKING SENSORS": "EQUIPPED",
    "BLUETOOTH SYSTEM": "EQUIPPED",
    "AUTO HOLD": "EQUIPPED",
    "SOUND SYSTEM": "EQUIPPED",
    "CRUISE CONTROL": "EQUIPPED",
    "SUNROOF TYPE": "PANOROMIC",
    "VENTILATED/LEATHER SEATS": "N/A",
    "FABRIC SEATS": "EQUIPPED",
    "PUSH START/STOP": "EQUIPPED",
    "NO OF KEYS": "1",
    "REAR VIEW CAMERA": "NOT EQUIPPED",
    "RADAR/ADAS": "NOT EQUIPPED",
    ABS: "OKAY",
    "POWER CONTROL SEATS": "EQUIPPED",
    comments: "",
    images: [],
  },

  diagnosticReport: { comments: "", pdfFile: null, immediateAttention: "" },

  roadTest: {
    "ENGINE NOISE": "NORMAL",
    "TRANSMISSION NOISE": "NORMAL",
    "ENGINE START": "NORMAL",
    "STEERING ALIGNMENT": "NORMAL",
    "GEAR OPERATION": "NORMAL",
    "BRAKE OPERATION": "WORKING FINE",
    "SUSPENSION NOISE": "NORMAL",
    "CRUISE CONTROL": "WORKING FINE",
    "BLIND SPOT": "WORKING FINE",
    "AC OPERATION": "COOLING GOOD",
    "INSTRUMENTS/CONTROLS": "WORKING FINE",
    comments: "",
  },
};

const initialFiles = {
  vehicleImages: [],
  paintBodyImages: [],
  engineImages: [],
  suspensionImages: [],
  interiorImages: [],
  batteryImages: [],
  specsImages: [],
  diagnosticPdf: [],
};

// 👇 NEW: Component to upload images per tyre
const TyreImageUpload = ({ label, files, setFiles }) => {
  const [previews, setPreviews] = useState([]);

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const nextFiles = [...files, ...selectedFiles];
    setFiles(nextFiles);

    const nextPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...nextPreviews]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-3">
      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
        <Upload size={14} /> {label}
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        className="mt-1 p-1 text-xs border border-slate-300 rounded bg-white w-full"
      />
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mt-1">
          {previews.map((preview, i) => (
            <div key={i} className="relative">
              <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-12 object-cover rounded border" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StarRating = ({ rating, setRating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`transition-colors ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
      >
        <Star size={24} />
      </button>
    ))}
  </div>
);

const ImageUpload = ({ label, files, setFiles, accept = "image/*", multiple = true }) => {
  const [previews, setPreviews] = useState([]);

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const nextFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
    setFiles(nextFiles);

    const nextPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => (multiple ? [...prev, ...nextPreviews] : nextPreviews));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4">
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <Upload size={18} /> {label}
      </label>
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleUpload}
        className="mt-2 p-2 border border-slate-300 rounded bg-white w-full"
      />
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative">
              <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-20 object-cover rounded border" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// const StatusSelector = ({ value, onChange }) => {
//   const options = ["OKAY", "NOT OKAY", "N/A", "WORKING FINE", "NORMAL", "GOOD", "POOR", "MINOR RUST"];
//   const isCustom = !options.includes(value) && value !== "";
//   return (
//     <div className="flex gap-2">
//       <select
//         value={isCustom ? "custom" : value}
//         onChange={(e) => onChange(e.target.value === "custom" ? "" : e.target.value)}
//         className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900"
//       >
//         <option value="">Select Status</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//         <option value="custom">Custom...</option>
//       </select>
//       {isCustom && (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full p-2 border-blue-400 rounded bg-white text-slate-900"
//           placeholder="Custom status"
//         />
//       )}
//     </div>
//   );
// };
// ✅ FIXED StatusSelector Component
const StatusSelector = ({ value, onChange }) => {
  const options = ["OKAY", "NOT OKAY", "N/A", "WORKING FINE", "NORMAL", "GOOD", "POOR", "MINOR RUST"];
  const isCustom = !options.includes(value) && value !== "";
  
  return (
    <div className="flex gap-2">
      <select
        value={isCustom ? "custom" : (value || "")}
        onChange={(e) => {
          if (e.target.value === "custom") {
            onChange(" "); // ✅ Set a default custom value
          } else {
            onChange(e.target.value);
          }
        }}
        className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900"
      >
        <option value="">Select Status</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value="custom">Custom...</option>
      </select>
      {isCustom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border-blue-400 rounded bg-white text-slate-900"
          placeholder="Enter custom status"
        />
      )}
    </div>
  );
};
const ChecklistSection = ({ title, data, sectionName, onChange, files, setFiles, showUpload = true }) => {
  const items = Object.keys(data).filter((key) => key !== "comments" && key !== "images");
  return (
    <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item} className="grid grid-cols-[2fr_3fr] items-center gap-4">
            <label className="font-semibold text-sm text-slate-700">{item}</label>
            <StatusSelector value={data[item]} onChange={(val) => onChange(sectionName, item, val)} />
          </div>
        ))}
        <div className="mt-4">
          <label className="font-semibold text-sm text-slate-700">Section Comments</label>
          <textarea
            value={data.comments}
            onChange={(e) => onChange(sectionName, "comments", e.target.value)}
            className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 text-slate-900"
            rows="2"
          />
        </div>
        {showUpload && <ImageUpload label={`Upload ${title} Images`} files={files} setFiles={setFiles} />}
      </div>
    </div>
  );
};

const InteractiveCarDiagram = ({ selectedParts, onPartSelect }) => {
  const carParts = [
    { id: 1, name: "Front Bumper", defect: "FULLY REPAINTED", area: { top: "90%", left: "45%", width: "10%", height: "8%" } },
    { id: 2, name: "Bonnet", defect: "PARTIALLY REPAINTED", area: { top: "70%", left: "40%", width: "20%", height: "15%" } },
    { id: 3, name: "Roof", defect: "SMART REPAINT", area: { top: "30%", left: "40%", width: "20%", height: "15%" } },
    { id: 4, name: "Rear Bumper", defect: "DENTS", area: { top: "5%", left: "45%", width: "10%", height: "8%" } },
    { id: 5, name: "Front Right Door", defect: "SCRATCHES", area: { top: "50%", left: "70%", width: "15%", height: "20%" } },
    { id: 6, name: "Rear Right Door", defect: "CRACK", area: { top: "35%", left: "70%", width: "15%", height: "15%" } },
    { id: 7, name: "Front Left Door", defect: "FULLY REPAINTED", area: { top: "50%", left: "15%", width: "15%", height: "20%" } },
    { id: 8, name: "Rear Left Door", defect: "PARTIALLY REPAINTED", area: { top: "35%", left: "15%", width: "15%", height: "15%" } },
  ];
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[9/12]">
      <img src="/CarImage.png" alt="Car Diagram" className="w-full h-full object-contain" />
      {carParts.map((part) => {
        const isSelected = selectedParts.some((p) => p.id === part.id);
        return (
          <button
            key={part.id}
            type="button"
            onClick={() => onPartSelect(part)}
            style={{
              position: "absolute",
              top: part.area.top,
              left: part.area.left,
              width: part.area.width,
              height: part.area.height,
              zIndex: 10,
              backgroundColor: isSelected ? "rgba(255,0,0,0.3)" : "transparent",
              border: isSelected ? "2px solid red" : "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            title={`${part.name} - ${part.defect}`}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black px-1 rounded text-xs font-bold">
              {part.id}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default function CreateReport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("header");
  const [formData, setFormData] = useState(initialState);
  const [files, setFiles] = useState(initialFiles);
  const [tyreImageFiles, setTyreImageFiles] = useState({ // 👈 ADDED
    frontLhs: [],
    frontRhs: [],
    rearLhs: [],
    rearRhs: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRootChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (e) => setFormData((prev) => ({ ...prev, date: new Date(e.target.value) }));
  const handleSectionChange = (section, name, value) =>
    setFormData((p) => ({ ...p, [section]: { ...p[section], [name]: value } }));
  const handlePartSelect = (part) => {
    setFormData((prev) => {
      const existingIndex = prev.paintAndBody.selectedParts.findIndex((p) => p.id === part.id);
      const newSelectedParts =
        existingIndex > -1
          ? prev.paintAndBody.selectedParts.filter((p) => p.id !== part.id)
          : [...prev.paintAndBody.selectedParts, part];
      const newNotes = newSelectedParts.map((p) => `${p.name}: ${p.defect}`).join(", ");
      return {
        ...prev,
        paintAndBody: {
          ...prev.paintAndBody,
          selectedParts: newSelectedParts,
          notes: newNotes || prev.paintAndBody.notes,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("reportId", formData.reportId);

      const appendFiles = (fieldName, fileArray) => {
        if (Array.isArray(fileArray) && fileArray.length > 0) {
          fileArray.forEach((file) => formDataToSend.append(fieldName, file));
        }
      };

      appendFiles("vehicleImages", files.vehicleImages);
      appendFiles("paintBodyImages", files.paintBodyImages);
      appendFiles("engineImages", files.engineImages);
      appendFiles("suspensionImages", files.suspensionImages);
      appendFiles("interiorImages", files.interiorImages);
      appendFiles("batteryImages", files.batteryImages);
      appendFiles("specsImages", files.specsImages);

      if (Array.isArray(files.diagnosticPdf) && files.diagnosticPdf.length > 0) {
        formDataToSend.append("diagnosticPdf", files.diagnosticPdf[0]);
      }

      // 👇 Append tyre images
      Object.entries(tyreImageFiles).forEach(([position, fileArray]) => {
        if (Array.isArray(fileArray) && fileArray.length > 0) {
          fileArray.forEach((file) => formDataToSend.append(`tyreImages_${position}`, file));
        }
      });

      formDataToSend.append("reportData", JSON.stringify(formData));

      console.log("Submitting report...", formData.reportId);
      // const response = await axios.post(`${API_URL}/reports`, formDataToSend, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
const response = await axios.post(`${API_URL}/reports`, formDataToSend, {
  timeout: 25000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});
      console.log("Raw response:", response.data);

      // if (response.data.success) {
      //   const savedId = response.data.report?.report_id || formData.reportId;
      //   console.log("Report saved, navigating with id:", savedId);

      //   setSuccess(true);
      //   setTimeout(() => {
      //     navigate(`/report/${savedId}`, {
      //       state: {
      //         autoDownload: true,
      //         finalReportData: formData,
      //       },
      //     });
      //   }, 1500);
      // } 
      // ✅ REPLACE THIS SECTION IN handleSubmit
if (response.data.success) {
  const savedReport = response.data.report;
  const savedId = savedReport.report_id || formData.reportId;
  console.log("Report saved, navigating with id:", savedId);

  setSuccess(true);
  setTimeout(() => {
    navigate(`/report/${savedId}`, {
      state: {
        autoDownload: true,
        // ✅ Use the report data FROM BACKEND which has image URLs
        finalReportData: {
          ...formData,
          vehicleSummary: {
            ...formData.vehicleSummary,
            vehicleImages: savedReport.vehicle_data?.vehicleImages || []
          },
          wheels: savedReport.wheels_data || formData.wheels,
          paintAndBody: savedReport.paint_body_data || formData.paintAndBody,
          engineTransmission: savedReport.engine_transmission || formData.engineTransmission,
          suspensionSteering: savedReport.suspension_steering || formData.suspensionSteering,
          interiors: savedReport.interiors || formData.interiors,
          batteryAnalysis: savedReport.battery_analysis || formData.batteryAnalysis,
          otherSpecifications: savedReport.other_specs || formData.otherSpecifications,
          diagnosticReport: savedReport.diagnostic_report || formData.diagnosticReport,
        },
      },
    });
  }, 1500);
}else {
        throw new Error(response.data.error || "Unknown error saving report");
      }
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Error saving report: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "header", label: "Report Info" },
    { id: "vehicleSummary", label: "Vehicle Summary" },
    { id: "wheels", label: "Wheels & Tyres" },
    { id: "paintAndBody", label: "Paint & Body" },
    { id: "engine", label: "Engine" },
    { id: "suspension", label: "Suspension" },
    { id: "interiors", label: "Interiors" },
    { id: "battery", label: "Battery" },
    { id: "specs", label: "Other Specs" },
    { id: "diagnostic", label: "Diagnostic" },
    { id: "roadTest", label: "Road Test" },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Report Saved Successfully!</h2>
          <p className="text-slate-600 mt-2">Redirecting to preview & download PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Car Check Experts Report</h1>
          <button
            onClick={() => document.getElementById("report-form")?.requestSubmit()}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {loading ? "Saving..." : "Save & Generate PDF"}
          </button>
        </header>

        <form id="report-form" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm min-h-[600px] border border-slate-200">

            {activeTab === 'header' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Report Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Report ID</label><input type="text" name="reportId" value={formData.reportId} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
                  <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label><input type="text" name="customerName" value={formData.customerName} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
                  <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Date & Time</label><input type="datetime-local" value={format(formData.date, "yyyy-MM-dd'T'HH:mm")} onChange={handleDateChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
                  <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Inspection Type</label><input type="text" name="typeOfInspection" value={formData.typeOfInspection} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
                  <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Year Make Model</label><input type="text" name="yearMakeModel" value={formData.yearMakeModel} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
                  <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Overall Rating</label><StarRating rating={formData.overallRating} setRating={(val) => setFormData(prev => ({...prev, overallRating: val}))} /></div>
                </div>
                <ImageUpload label="Upload Vehicle External Pictures" files={files.vehicleImages} setFiles={(newFiles) => setFiles(prev => ({...prev, vehicleImages: newFiles}))} />
              </div>
            )}

            {activeTab === 'vehicleSummary' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Vehicle Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(formData.vehicleSummary).map((key) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input 
                        type="text" 
                        value={formData.vehicleSummary[key]} 
                        onChange={(e) => handleSectionChange('vehicleSummary', key, e.target.value)} 
                        className="p-2 border border-slate-300 rounded bg-white" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wheels' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Wheels and Tyre Condition</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {['frontLhs', 'frontRhs', 'rearLhs', 'rearRhs'].map((pos) => (
                    <div key={pos} className="border rounded-lg p-4 bg-slate-50">
                      <h3 className="font-bold text-blue-700 uppercase mb-4 border-b pb-2">
                        {pos.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Condition</label>
                          <StatusSelector 
                            value={formData.wheels[pos].condition} 
                            onChange={(val) => handleSectionChange('wheels', pos, {...formData.wheels[pos], condition: val})} 
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-500 uppercase">Manufacturer</label>
                          <input 
                            type="text" 
                            value={formData.wheels[pos].manufacturer} 
                            onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], manufacturer: e.target.value})} 
                            className="p-2 border border-slate-300 rounded bg-white" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                          <input 
                            type="text" 
                            value={formData.wheels[pos].year} 
                            onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], year: e.target.value})} 
                            className="p-2 border border-slate-300 rounded bg-white" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-500 uppercase">Tyre Size</label>
                          <input 
                            type="text" 
                            value={formData.wheels[pos].tyreSize} 
                            onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], tyreSize: e.target.value})} 
                            className="p-2 border border-slate-300 rounded bg-white" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-500 uppercase">Wheel Alloys</label>
                          <input 
                            type="text" 
                            value={formData.wheels[pos].wheelAlloys} 
                            onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], wheelAlloys: e.target.value})} 
                            className="p-2 border border-slate-300 rounded bg-white" 
                          />
                        </div>
                      </div>

                      {/* 👇 Tyre Image Upload */}
                      <TyreImageUpload
                        label={`Upload ${pos.toUpperCase()} Images`}
                        files={tyreImageFiles[pos]}
                        setFiles={(newFiles) => setTyreImageFiles(prev => ({
                          ...prev,
                          [pos]: newFiles
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'paintAndBody' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Paint and Body Appraisal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  <div>
                    <InteractiveCarDiagram selectedParts={formData.paintAndBody.selectedParts} onPartSelect={handlePartSelect} />
                    <p className="text-center text-xs text-slate-400 mt-2">Click numbered areas to select defects</p>
                  </div>
                  <div>
                    <div className="mb-6">
                      <label className="text-sm font-bold text-slate-700 uppercase mb-2">Selected Defects</label>
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-700 min-h-[100px]">
                        {formData.paintAndBody.selectedParts.length > 0 ? formData.paintAndBody.selectedParts.map(p => <p key={p.id}><b>{p.id}. {p.name}</b>: {p.defect}</p>) : <span className="text-slate-400 italic">No parts selected</span>}
                      </div>
                    </div>
                    <label className="text-sm font-bold text-slate-700 uppercase block mb-2">Inspection Notes</label>
                    <textarea 
                      value={formData.paintAndBody.notes} 
                      onChange={(e) => handleSectionChange('paintAndBody', 'notes', e.target.value)} 
                      className="w-full p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" 
                      rows="6" 
                      placeholder="Enter details..." 
                    />
                    <ImageUpload 
                      label="Upload Paint & Body Images" 
                      files={files.paintBodyImages} 
                      setFiles={(newFiles) => setFiles(prev => ({...prev, paintBodyImages: newFiles}))} 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'engine' && (
              <ChecklistSection 
                title="Engine & Transmission Inspection" 
                data={formData.engineTransmission} 
                sectionName="engineTransmission" 
                onChange={handleSectionChange} 
                files={files.engineImages} 
                setFiles={(newFiles) => setFiles(prev => ({...prev, engineImages: newFiles}))} 
              />
            )}
            {activeTab === 'suspension' && (
              <ChecklistSection 
                title="Suspension, Steering and Brake Inspection" 
                data={formData.suspensionSteering} 
                sectionName="suspensionSteering" 
                onChange={handleSectionChange} 
                files={files.suspensionImages} 
                setFiles={(newFiles) => setFiles(prev => ({...prev, suspensionImages: newFiles}))} 
              />
            )}
            {activeTab === 'interiors' && (
              <ChecklistSection 
                title="Interiors, Electricals and Lightings" 
                data={formData.interiors} 
                sectionName="interiors" 
                onChange={handleSectionChange} 
                files={files.interiorImages} 
                setFiles={(newFiles) => setFiles(prev => ({...prev, interiorImages: newFiles}))} 
              />
            )}
            {activeTab === 'battery' && (
              <ChecklistSection 
                title="Battery Analysis" 
                data={formData.batteryAnalysis} 
                sectionName="batteryAnalysis" 
                onChange={handleSectionChange} 
                files={files.batteryImages} 
                setFiles={(newFiles) => setFiles(prev => ({...prev, batteryImages: newFiles}))} 
              />
            )}
            {activeTab === 'specs' && (
              <ChecklistSection 
                title="Other Specifications" 
                data={formData.otherSpecifications} 
                sectionName="otherSpecifications" 
                onChange={handleSectionChange} 
                files={files.specsImages} 
                setFiles={(newFiles) => setFiles(prev => ({...prev, specsImages: newFiles}))} 
              />
            )}
            {activeTab === 'diagnostic' && (
              <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b">Diagnostic Report</h2>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm text-slate-700">Immediate Attention Required</label>
                    <textarea 
                      value={formData.diagnosticReport.immediateAttention} 
                      onChange={(e) => handleSectionChange('diagnosticReport', 'immediateAttention', e.target.value)} 
                      className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" 
                      rows="2" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm text-slate-700">Diagnostic Comments</label>
                    <textarea 
                      value={formData.diagnosticReport.comments} 
                      onChange={(e) => handleSectionChange('diagnosticReport', 'comments', e.target.value)} 
                      className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" 
                      rows="3" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-sm text-slate-700">Upload Diagnostic PDF</label>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setFiles(prev => ({...prev, diagnosticPdf: [e.target.files[0]]}))} 
                      className="mt-2 p-2 border border-slate-300 rounded bg-white w-full" 
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'roadTest' && (
              <div>
                <ChecklistSection 
                  title="Road Test Remarks" 
                  data={formData.roadTest} 
                  sectionName="roadTest" 
                  onChange={handleSectionChange} 
                  showUpload={false} 
                />
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Ready to Submit</h3>
                  <p className="text-sm text-blue-700 mb-4">Click "Save & Generate PDF" button at the top to save report to database and download PDF.</p>
                </div>
              </div>
            )}

          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : null}
              {loading ? "Processing..." : "Generate & Save Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Star, Upload, Loader2, CheckCircle } from "lucide-react";
// import { format } from "date-fns";
// import axios from "axios";

// const API_URL = "http://localhost:5001/api";

// const initialState = {
//   reportId: "SYC-" + Math.floor(1000 + Math.random() * 9000),
//   customerName: "JOHN",
//   overallRating: 4,
//   date: new Date(),
//   typeOfInspection: "PPI - 299AED",
//   yearMakeModel: "2021 ALFA ROMEO GIULIETTA VELOCE",

//   vehicleSummary: {
//     vinNumber: "ZARCABC46M7550853",
//     mileage: "33893",
//     vehicleType: "HATCH BACK",
//     noOfCylinders: "4",
//     engineSize: "1.4L",
//    // horseower: "105HP",
//      horsePower: "105HP", 
//     externalColor: "BLUE",
//     fuelType: "PATROL",
//     specs: "GCC",
//     registrationNumber: "",
//   },

//   wheels: {
//     frontLhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", image: null},
//     frontRhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", image: null },
//     rearLhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", image: null },
//     rearRhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", image: null },
//   },

//   paintAndBody: { selectedParts: [], notes: "", images: [] },

//   engineTransmission: {
//     "ENGINE VISUAL CONDITION": "OKAY",
//     "ENGINE START": "NORMAL",
//     "ENGINE SHIELD COVER": "OKAY",
//     "ENGINE TRANSMISSION MOUNTS": "OKAY",
//     "TRANSMISSION FLUID(OPTIONAL)": "-",
//     "DRIVE BELT / PULLEY": "OKAY",
//     "FUSE BOX": "OKAY",
//     "HOOD STAY": "OKAY",
//     "RADIATOR CONDITION": "OKAY",
//     "RADIATOR CAP": "OKAY",
//     "RADIATOR FAN MOTOR": "OKAY",
//     "ENGINE OIL FILLER CAP": "OKAY",
//     "AC HOSES": "OKAY",
//     "COOLANT LEVEL": "OKAY",
//     "COOLANT HEATER HOSES": "OKAY",
//     "COOLANT TANK/CAP": "OKAY",
//     "EXHAUST SMOKE": "OKAY",
//     "WASHER FLUID CAP": "OKAY",
//     "FUEL FILLER CAP": "OKAY",
//     comments: "",
//     images: [],
//   },

//   suspensionSteering: {
//     "STEERING MECHANISM": "OKAY",
//     "STEERING RACK": "OKAY",
//     "FRONT BRAKE PADS": "OKAY",
//     "REAR BRAKE PADS/DRUM": "OKAY",
//     "FRONT BRAKE ROTOR": "MINOR RUST",
//     "REAR BRAKE ROTOR": "OKAY",
//     "ABS": "OKAY",
//     "PARKING BRAKE MECHANISM": "OKAY",
//     "FRONT SHOCK ABSORBERS": "OKAY",
//     "REAR SHOCK ABSORBERS": "OKAY",
//     "FRONT AXLE": "OKAY",
//     "REAR AXLE": "OKAY",
//     "FRONT SUSPENSION BUSHES": "N/A",
//     "REAR SUSPENSION BUSHES": "OKAY",
//     comments: "",
//     images: [],
//   },

//   interiors: {
//     "DASHBOARD SWITCHES": "OKAY - WORKING",
//     "CLUSTER NOTIFICATIONS": "NO FAULTS FOUND",
//     "REMOTE KEY": "OKAY",
//     "POWER WINDOW SWITCHES": "OKAY - WORKING",
//     "ROOF SWITCHES/ROOF LIGHTS": "OKAY - WORKING",
//     UPHOLSTERY: "OKAY",
//     "SEAT CONDITION": "OKAY",
//     "SEAT UNDER FRAME": "OKAY",
//     "ARM REST/CONSOLE BOX": "OKAY",
//     "SUN VISORS": "OKAY",
//     "SIDE / CENTER MIRRORS": "OKAY",
//     "HEAD LAMPS": "OKAY",
//     "TAIL LAMPS": "OKAY",
//     "AIR CONDITIONING": "OKAY",
//     "AC VENTS/AIR FLOW": "OKAY",
//     "DOOR BEEDINGS": "OKAY",
//     "DOOR HINGES": "OKAY",
//     "TAIL GATE STAY": "OKAY",
//     comments: "",
//     images: [],
//   },

//   batteryAnalysis: { "BATTERY REPORT": "GOOD", comments: "", images: [] },

//   otherSpecifications: {
//     "DRIVE TYPE": "FWD",
//     "PARKING SENSORS": "EQUIPPED",
//     "BLUETOOTH SYSTEM": "EQUIPPED",
//     "SOUND SYSTEM": "EQUIPPED",
//     "CRUISE CONTROL": "EQUIPPED",
//     "SUNROOF TYPE": "PANOROMIC",
//     "VENTILATED/LEATHER SEATS": "N/A",
//     "FABRIC SEATS": "EQUIPPED",
//     "PUSH START/STOP": "EQUIPPED",
//     "NO OF KEYS": "1",
//     "REAR VIEW CAMERA": "NOT EQUIPPED",
//     "RADAR/ADAS": "NOT EQUIPPED",
//     "POWER CONTROL SEATS": "EQUIPPED",
//     comments: "",
//     images: [],
//   },

//   diagnosticReport: { comments: "", pdfFile: null, immediateAttention: "" },

//   roadTest: {
//     "ENGINE NOISE": "NORMAL",
//     "TRANSMISSION NOISE": "NORMAL",
//     "ENGINE START": "NORMAL",
//     "STEERING ALIGNMENT": "NORMAL",
//     "GEAR OPERATION": "NORMAL",
//     "BRAKE OPERATION": "WORKING FINE",
//     "SUSPENSION NOISE": "NORMAL",
//     "CRUISE CONTROL": "WORKING FINE",
//     "AC OPERATION": "COOLING GOOD",
//     "INSTRUMENTS/CONTROLS": "WORKING FINE",
//     comments: "",
//   },
// };

// const initialFiles = {
//   vehicleImages: [],
//   paintBodyImages: [],
//   engineImages: [],
//   suspensionImages: [],
//   interiorImages: [],
//   batteryImages: [],
//   specsImages: [],
//   diagnosticPdf: [],
// };

// const StarRating = ({ rating, setRating }) => (
//   <div className="flex gap-1">
//     {[1, 2, 3, 4, 5].map((star) => (
//       <button
//         key={star}
//         type="button"
//         onClick={() => setRating(star)}
//         className={`transition-colors ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
//       >
//         <Star size={24} />
//       </button>
//     ))}
//   </div>
// );

// const ImageUpload = ({ label, files, setFiles, accept = "image/*", multiple = true }) => {
//   const [previews, setPreviews] = useState([]);

//   const handleUpload = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     if (!selectedFiles.length) return;

//     const nextFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
//     setFiles(nextFiles);

//     const nextPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
//     setPreviews((prev) => (multiple ? [...prev, ...nextPreviews] : nextPreviews));
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//     setPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="mt-4">
//       <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
//         <Upload size={18} /> {label}
//       </label>
//       <input
//         type="file"
//         multiple={multiple}
//         accept={accept}
//         onChange={handleUpload}
//         className="mt-2 p-2 border border-slate-300 rounded bg-white w-full"
//       />
//       {previews.length > 0 && (
//         <div className="grid grid-cols-3 gap-2 mt-2">
//           {previews.map((preview, i) => (
//             <div key={i} className="relative">
//               <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-20 object-cover rounded border" />
//               <button
//                 type="button"
//                 onClick={() => removeFile(i)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const StatusSelector = ({ value, onChange }) => {
//   const options = ["OKAY", "NOT OKAY", "N/A", "WORKING FINE", "NORMAL", "GOOD", "POOR", "MINOR RUST"];
//   const isCustom = !options.includes(value) && value !== "";
//   return (
//     <div className="flex gap-2">
//       <select
//         value={isCustom ? "custom" : value}
//         onChange={(e) => onChange(e.target.value === "custom" ? "" : e.target.value)}
//         className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900"
//       >
//         <option value="">Select Status</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//         <option value="custom">Custom...</option>
//       </select>
//       {isCustom && (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full p-2 border-blue-400 rounded bg-white text-slate-900"
//           placeholder="Custom status"
//         />
//       )}
//     </div>
//   );
// };

// const ChecklistSection = ({ title, data, sectionName, onChange, files, setFiles, showUpload = true }) => {
//   const items = Object.keys(data).filter((key) => key !== "comments" && key !== "images");
//   return (
//     <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//       <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b">{title}</h2>
//       <div className="space-y-4">
//         {items.map((item) => (
//           <div key={item} className="grid grid-cols-[2fr_3fr] items-center gap-4">
//             <label className="font-semibold text-sm text-slate-700">{item}</label>
//             <StatusSelector value={data[item]} onChange={(val) => onChange(sectionName, item, val)} />
//           </div>
//         ))}
//         <div className="mt-4">
//           <label className="font-semibold text-sm text-slate-700">Section Comments</label>
//           <textarea
//             value={data.comments}
//             onChange={(e) => onChange(sectionName, "comments", e.target.value)}
//             className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 text-slate-900"
//             rows="2"
//           />
//         </div>
//         {showUpload && <ImageUpload label={`Upload ${title} Images`} files={files} setFiles={setFiles} />}
//       </div>
//     </div>
//   );
// };

// const InteractiveCarDiagram = ({ selectedParts, onPartSelect }) => {
//   const carParts = [
//     { id: 1, name: "Front Bumper", defect: "FULLY REPAINTED", area: { top: "90%", left: "45%", width: "10%", height: "8%" } },
//     { id: 2, name: "Bonnet", defect: "PARTIALLY REPAINTED", area: { top: "70%", left: "40%", width: "20%", height: "15%" } },
//     { id: 3, name: "Roof", defect: "SMART REPAINT", area: { top: "30%", left: "40%", width: "20%", height: "15%" } },
//     { id: 4, name: "Rear Bumper", defect: "DENTS", area: { top: "5%", left: "45%", width: "10%", height: "8%" } },
//     { id: 5, name: "Front Right Door", defect: "SCRATCHES", area: { top: "50%", left: "70%", width: "15%", height: "20%" } },
//     { id: 6, name: "Rear Right Door", defect: "CRACK", area: { top: "35%", left: "70%", width: "15%", height: "15%" } },
//     { id: 7, name: "Front Left Door", defect: "FULLY REPAINTED", area: { top: "50%", left: "15%", width: "15%", height: "20%" } },
//     { id: 8, name: "Rear Left Door", defect: "PARTIALLY REPAINTED", area: { top: "35%", left: "15%", width: "15%", height: "15%" } },
//   ];
//   return (
//     <div className="relative w-full max-w-md mx-auto aspect-[9/12]">
//       <img src="/CarImage.png" alt="Car Diagram" className="w-full h-full object-contain" />
//       {carParts.map((part) => {
//         const isSelected = selectedParts.some((p) => p.id === part.id);
//         return (
//           <button
//             key={part.id}
//             type="button"
//             onClick={() => onPartSelect(part)}
//             style={{
//               position: "absolute",
//               top: part.area.top,
//               left: part.area.left,
//               width: part.area.width,
//               height: part.area.height,
//               zIndex: 10,
//               backgroundColor: isSelected ? "rgba(255,0,0,0.3)" : "transparent",
//               border: isSelected ? "2px solid red" : "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//             title={`${part.name} - ${part.defect}`}
//           >
//             <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black px-1 rounded text-xs font-bold">
//               {part.id}
//             </span>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default function CreateReport() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("header");
//   const [formData, setFormData] = useState(initialState);
//   const [files, setFiles] = useState(initialFiles);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleRootChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleDateChange = (e) => setFormData((prev) => ({ ...prev, date: new Date(e.target.value) }));
//   const handleSectionChange = (section, name, value) =>
//     setFormData((p) => ({ ...p, [section]: { ...p[section], [name]: value } }));
//   const handlePartSelect = (part) => {
//     setFormData((prev) => {
//       const existingIndex = prev.paintAndBody.selectedParts.findIndex((p) => p.id === part.id);
//       const newSelectedParts =
//         existingIndex > -1
//           ? prev.paintAndBody.selectedParts.filter((p) => p.id !== part.id)
//           : [...prev.paintAndBody.selectedParts, part];
//       const newNotes = newSelectedParts.map((p) => `${p.name}: ${p.defect}`).join(", ");
//       return {
//         ...prev,
//         paintAndBody: {
//           ...prev.paintAndBody,
//           selectedParts: newSelectedParts,
//           notes: newNotes || prev.paintAndBody.notes,
//         },
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);

//     try {
//       const formDataToSend = new FormData();
//       // backend uses reportData.reportId from JSON, not this, but OK to send
//       formDataToSend.append("reportId", formData.reportId);

//       const appendFiles = (fieldName, fileArray) => {
//         if (Array.isArray(fileArray) && fileArray.length > 0) {
//           fileArray.forEach((file) => formDataToSend.append(fieldName, file));
//         }
//       };

//       appendFiles("vehicleImages", files.vehicleImages);
//       appendFiles("paintBodyImages", files.paintBodyImages);
//       appendFiles("engineImages", files.engineImages);
//       appendFiles("suspensionImages", files.suspensionImages);
//       appendFiles("interiorImages", files.interiorImages);
//       appendFiles("batteryImages", files.batteryImages);
//       appendFiles("specsImages", files.specsImages);

//       if (Array.isArray(files.diagnosticPdf) && files.diagnosticPdf.length > 0) {
//         formDataToSend.append("diagnosticPdf", files.diagnosticPdf[0]);
//       }

//       formDataToSend.append("reportData", JSON.stringify(formData));

//       console.log("Submitting report...", formData.reportId);
//       const response = await axios.post(`${API_URL}/reports`, formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Raw response:", response.data);

//       if (response.data.success) {
//         // Backend returns: { success, message, report: { report_id, ... } }
//         const savedId = response.data.report?.report_id || formData.reportId;
//         console.log("Report saved, navigating with id:", savedId);

//         setSuccess(true);
//         setTimeout(() => {
//           navigate(`/report/${savedId}`, {
//             state: {
//               autoDownload: true,
//               // useful fallback if fetch fails
//               finalReportData: formData,
//             },
//           });
//         }, 1500);
//       } else {
//         throw new Error(response.data.error || "Unknown error saving report");
//       }
//     } catch (error) {
//       console.error("Error saving report:", error);
//       alert("Error saving report: " + (error.response?.data?.error || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = [
//     { id: "header", label: "Report Info" },
//     { id: "vehicleSummary", label: "Vehicle Summary" },
//     { id: "wheels", label: "Wheels & Tyres" },
//     { id: "paintAndBody", label: "Paint & Body" },
//     { id: "engine", label: "Engine" },
//     { id: "suspension", label: "Suspension" },
//     { id: "interiors", label: "Interiors" },
//     { id: "battery", label: "Battery" },
//     { id: "specs", label: "Other Specs" },
//     { id: "diagnostic", label: "Diagnostic" },
//     { id: "roadTest", label: "Road Test" },
//   ];

//   if (success) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-slate-800">Report Saved Successfully!</h2>
//           <p className="text-slate-600 mt-2">Redirecting to preview & download PDF...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-slate-800">Car Check Experts Report</h1>
//           <button
//             onClick={() => document.getElementById("report-form")?.requestSubmit()}
//             disabled={loading}
//             className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
//           >
//             {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
//             {loading ? "Saving..." : "Save & Generate PDF"}
//           </button>
//         </header>

//         <form id="report-form" onSubmit={handleSubmit}>
//           <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
//                   activeTab === tab.id
//                     ? "bg-blue-600 text-white shadow-md"
//                     : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm min-h-[600px] border border-slate-200">
//             {/* --- TABS CONTENT (unchanged from your version) --- */}
//             {/* header, vehicleSummary, wheels, paintAndBody, engine, suspension, interiors, battery, specs, diagnostic, roadTest */}
//             {/* For brevity, keep the same JSX you already had here. The important fix is above in handleSubmit. */}
//            {activeTab === 'header' && (
//                     <div>
//                         <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Report Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Report ID</label><input type="text" name="reportId" value={formData.reportId} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                             <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label><input type="text" name="customerName" value={formData.customerName} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                             <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Date & Time</label><input type="datetime-local" value={format(formData.date, "yyyy-MM-dd'T'HH:mm")} onChange={handleDateChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                             <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Inspection Type</label><input type="text" name="typeOfInspection" value={formData.typeOfInspection} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                             <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Year Make Model</label><input type="text" name="yearMakeModel" value={formData.yearMakeModel} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                             <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Overall Rating</label><StarRating rating={formData.overallRating} setRating={(val) => setFormData(prev => ({...prev, overallRating: val}))} /></div>
//                             <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Reg No</label><input type="text" value={formData.vehicleSummary.registrationNumber || ""} onChange={(e) =>
//                                 handleSectionChange(
//                                   "vehicleSummary",
//                                   "registrationNumber",
//                                   e.target.value
//                                 )
//                               }
//                               className="p-2 border border-slate-300 rounded bg-white"
//                             />
//                           </div>
//                         </div>
//                         <ImageUpload label="Upload Vehicle External Pictures" files={files.vehicleImages} setFiles={(newFiles) => setFiles(prev => ({...prev, vehicleImages: newFiles}))} />
//                     </div>
//                 )}

//                 {activeTab === 'vehicleSummary' && (
//                     <div>
//                          <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Vehicle Summary</h2>
//                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {Object.keys(formData.vehicleSummary).map((key) => (
//                                 <div key={key} className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label><input type="text" value={formData.vehicleSummary[key]} onChange={(e) => handleSectionChange('vehicleSummary', key, e.target.value)} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                             ))}
//                          </div>
//                          {/* <div className="flex flex-col">
//                         <label className="text-xs font-bold text-slate-500 uppercase mb-1">
//                           Horse Power
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.vehicleSummary.horsePower || ""}
//                           onChange={(e) =>
//                             handleSectionChange(
//                               "vehicleSummary",
//                               "horsePower",
//                               e.target.value
//                             )
//                           }
//                           className="p-2 border border-slate-300 rounded bg-white"
//                         />
//                       </div> */}
//                     </div>
//                 )}

//                 {activeTab === 'wheels' && (
//                     <div>
//                         <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Wheels and Tyre Condition</h2>
//                         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//                             {['frontLhs', 'frontRhs', 'rearLhs', 'rearRhs'].map((pos) => (
//                                 <div key={pos} className="border rounded-lg p-4 bg-slate-50">
//                                     <h3 className="font-bold text-blue-700 uppercase mb-4 border-b pb-2">{pos.replace(/([A-Z])/g, ' $1').toUpperCase()}</h3>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Condition</label><StatusSelector value={formData.wheels[pos].condition} onChange={(val) => handleSectionChange('wheels', pos, {...formData.wheels[pos], condition: val})} /></div>
//                                         <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Manufacturer</label><input type="text" value={formData.wheels[pos].manufacturer} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], manufacturer: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                                         <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Year</label><input type="text" value={formData.wheels[pos].year} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], year: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                                         <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Tyre Size</label><input type="text" value={formData.wheels[pos].tyreSize} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], tyreSize: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                                         <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Wheel Alloys</label><input type="text" value={formData.wheels[pos].wheelAlloys} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], wheelAlloys: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                                          {/* ADD THIS IMAGE UPLOAD */}
//                                         <div className="mt-4">
//                                           <label className="text-xs font-bold text-slate-500 uppercase">
//                                             Upload Tyre Image
//                                           </label>
//                                           <ImageUpload 
//                                             label="" 
//                                             files={formData.wheels[pos].image ? [formData.wheels[pos].image] : []} 
//                                             setFiles={(newFiles) => {
//                                               const file = newFiles[0] || null;
//                                               handleSectionChange('wheels', pos, {
//                                                 ...formData.wheels[pos],
//                                                 image: file
//                                               });
//                                             }}
//                                             multiple={false}
//                                           />
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'paintAndBody' && (
//                     <div>
//                         <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Paint and Body Appraisal</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
//                             <div>
//                                 <InteractiveCarDiagram selectedParts={formData.paintAndBody.selectedParts} onPartSelect={handlePartSelect} />
//                                 <p className="text-center text-xs text-slate-400 mt-2">Click numbered areas to select defects</p>
//                             </div>
//                             <div>
//                                 <div className="mb-6">
//                                     <label className="text-sm font-bold text-slate-700 uppercase mb-2">Selected Defects</label>
//                                     <div className="p-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-700 min-h-[100px]">
//                                         {formData.paintAndBody.selectedParts.length > 0 ? formData.paintAndBody.selectedParts.map(p => <p key={p.id}><b>{p.id}. {p.name}</b>: {p.defect}</p>) : <span className="text-slate-400 italic">No parts selected</span>}
//                                     </div>
//                                 </div>
//                                 <label className="text-sm font-bold text-slate-700 uppercase block mb-2">Inspection Notes</label>
//                                 <textarea value={formData.paintAndBody.notes} onChange={(e) => handleSectionChange('paintAndBody', 'notes', e.target.value)} className="w-full p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" rows="6" placeholder="Enter details..." />
//                                 <ImageUpload label="Upload Paint & Body Images" files={files.paintBodyImages} setFiles={(newFiles) => setFiles(prev => ({...prev, paintBodyImages: newFiles}))} />
//                             </div>
//                         </div>
//                     </div>
//                 )}
                
//                 {activeTab === 'engine' && (
//                     <ChecklistSection title="Engine & Transmission Inspection" data={formData.engineTransmission} sectionName="engineTransmission" onChange={handleSectionChange} fileField="engineImages" files={files.engineImages} setFiles={(newFiles) => setFiles(prev => ({...prev, engineImages: newFiles}))} />
//                 )}
//                 {activeTab === 'suspension' && (
//                     <ChecklistSection title="Suspension, Steering and Brake Inspection" data={formData.suspensionSteering} sectionName="suspensionSteering" onChange={handleSectionChange} fileField="suspensionImages" files={files.suspensionImages} setFiles={(newFiles) => setFiles(prev => ({...prev, suspensionImages: newFiles}))} />
//                 )}
//                 {activeTab === 'interiors' && (
//                     <ChecklistSection title="Interiors, Electricals and Lightings" data={formData.interiors} sectionName="interiors" onChange={handleSectionChange} fileField="interiorImages" files={files.interiorImages} setFiles={(newFiles) => setFiles(prev => ({...prev, interiorImages: newFiles}))} />
//                 )}
//                 {activeTab === 'battery' && (
//                     <ChecklistSection title="Battery Analysis" data={formData.batteryAnalysis} sectionName="batteryAnalysis" onChange={handleSectionChange} fileField="batteryImages" files={files.batteryImages} setFiles={(newFiles) => setFiles(prev => ({...prev, batteryImages: newFiles}))} />
//                 )}
//                 {activeTab === 'specs' && (
//                     <ChecklistSection title="Other Specifications" data={formData.otherSpecifications} sectionName="otherSpecifications" onChange={handleSectionChange} fileField="specsImages" files={files.specsImages} setFiles={(newFiles) => setFiles(prev => ({...prev, specsImages: newFiles}))} />
//                 )}
//                 {activeTab === 'diagnostic' && (
//                     <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                         <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b">Diagnostic Report</h2>
//                         <div className="space-y-4">
//                             <div className="flex flex-col"><label className="font-semibold text-sm text-slate-700">Immediate Attention Required</label><textarea value={formData.diagnosticReport.immediateAttention} onChange={(e) => handleSectionChange('diagnosticReport', 'immediateAttention', e.target.value)} className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" rows="2" /></div>
//                             <div className="flex flex-col"><label className="font-semibold text-sm text-slate-700">Diagnostic Comments</label><textarea value={formData.diagnosticReport.comments} onChange={(e) => handleSectionChange('diagnosticReport', 'comments', e.target.value)} className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" rows="3" /></div>
//                             <div className="flex flex-col"><label className="font-semibold text-sm text-slate-700">Upload Diagnostic PDF</label><input type="file" accept=".pdf" onChange={(e) => setFiles(prev => ({...prev, diagnosticPdf: [e.target.files[0]]}))} className="mt-2 p-2 border border-slate-300 rounded bg-white w-full" /></div>
//                         </div>
//                     </div>
//                 )}
//                 {activeTab === 'roadTest' && (
//                     <div>
//                         <ChecklistSection title="Road Test Remarks" data={formData.roadTest} sectionName="roadTest" onChange={handleSectionChange} showUpload={false} />
//                         <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
//                             <h3 className="font-bold text-blue-800 mb-2">Ready to Submit</h3>
//                             <p className="text-sm text-blue-700 mb-4">Click "Save & Generate PDF" button at the top to save report to database and download PDF.</p>
//                         </div>
//                     </div>
//                 )}
//             </div>
        

//           <div className="flex justify-end mt-8">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
//             >
//               {loading ? <Loader2 className="animate-spin" size={20} /> : null}
//               {loading ? "Processing..." : "Generate & Save Report"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


