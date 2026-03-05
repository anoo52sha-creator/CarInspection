import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Upload, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";

// const API_URL = "http://localhost:5001/api";
const API_URL = "https://carinspection-1.onrender.com/api";

// --- CONSTANTS FOR PAINT & BODY ---

const DEFECT_TYPES = [
  { id: 1, label: "FULLY REPAINTED" },
  { id: 2, label: "PARTIALLY REPAINTED" },
  { id: 3, label: "SMART REPAINT" },
  { id: 4, label: "DENTS" },
  { id: 5, label: "SCRATCHES" },
  { id: 6, label: "CRACK" },
  { id: 7, label: "FADED" },
  { id: 8, label: "CHIP OFF" },
  { id: 9, label: "MULTIPLE SCRATCHES" },
  { id: 10, label: "PAINT PEEL OFF" },
];

// Coordinate mapping for the car image (approximate % for top-down view)
const CAR_PARTS_CONFIG = [
  // 1. Main Body
  { id: "roof", name: "Roof Panel", top: "42%", left: "25%", width: "50%", height: "18%" },
  { id: "windshield", name: "Windshield", top: "32%", left: "25%", width: "50%", height: "9%" },
  { id: "rear_glass", name: "Rear Windshield", top: "60%", left: "25%", width: "50%", height: "8%" },
  { id: "hood", name: "Hood / Bonnet", top: "13%", left: "22%", width: "56%", height: "18%" },
  { id: "trunk", name: "Trunk / Boot Lid", top: "69%", left: "22%", width: "56%", height: "12%" },
  
  // 2. Bumpers & Grille
  { id: "front_bumper", name: "Front Bumper", top: "1%", left: "15%", width: "70%", height: "11%" },
  { id: "rear_bumper", name: "Rear Bumper", top: "82%", left: "15%", width: "70%", height: "10%" },
  { id: "grille", name: "Front Grille", top: "9%", left: "35%", width: "30%", height: "4%" },

  // 3. Doors
  { id: "door_fl", name: "Front Left Door", top: "30%", left: "5%", width: "16%", height: "18%" },
  { id: "door_fr", name: "Front Right Door", top: "30%", left: "79%", width: "16%", height: "18%" },
  { id: "door_rl", name: "Rear Left Door", top: "49%", left: "5%", width: "16%", height: "18%" },
  { id: "door_rr", name: "Rear Right Door", top: "49%", left: "79%", width: "16%", height: "18%" },

  // 4. Fenders & Quarter Panels
  { id: "fender_fl", name: "Left Front Fender", top: "13%", left: "8%", width: "13%", height: "16%" },
  { id: "fender_fr", name: "Right Front Fender", top: "13%", left: "79%", width: "13%", height: "16%" },
  { id: "quarter_rl", name: "Left Rear Quarter", top: "68%", left: "8%", width: "13%", height: "14%" },
  { id: "quarter_rr", name: "Right Rear Quarter", top: "68%", left: "79%", width: "13%", height: "14%" },
  { id: "rocker_l", name: "Left Side Skirt", top: "30%", left: "1%", width: "4%", height: "38%" },
  { id: "rocker_r", name: "Right Side Skirt", top: "30%", left: "95%", width: "4%", height: "38%" },

  // 5. Mirrors
  { id: "mirror_l", name: "Left Side Mirror", top: "27%", left: "2%", width: "8%", height: "5%" },
  { id: "mirror_r", name: "Right Side Mirror", top: "27%", left: "90%", width: "8%", height: "5%" },

  // 6. Wheels (Corners)
  { id: "wheel_fl", name: "Front Left Wheel", top: "15%", left: "0%", width: "8%", height: "12%" },
  { id: "wheel_fr", name: "Front Right Wheel", top: "15%", left: "92%", width: "8%", height: "12%" },
  { id: "wheel_rl", name: "Rear Left Wheel", top: "68%", left: "0%", width: "8%", height: "12%" },
  { id: "wheel_rr", name: "Rear Right Wheel", top: "68%", left: "92%", width: "8%", height: "12%" },

  // 7. Spoiler & Structural
  { id: "spoiler", name: "Rear Spoiler", top: "81%", left: "30%", width: "40%", height: "5%" },
  { id: "pillars", name: "Pillars / Frame", top: "28%", left: "20%", width: "60%", height: "45%", zIndex: -1 }, // Catch-all background for pillars if clicked between windows
];

// --- END CONSTANTS ---

const initialState = {
  reportId: "SYC-" + Math.floor(1000 + Math.random() * 9000),
  // customerName: "Mohammad",
 // vehicleRegNo: "ABC123",
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
    vehicleRegNo: "ABC123",
  },

  wheels: {
    frontLhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", images: [] },
    frontRhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", images: [] },
    rearLhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", images: [] },
    rearRhs: { manufacturer: "NEXEN", year: "2025", tyreSize: "225/40ZR18", condition: "GOOD", wheelAlloys: "ALLOY WHEELS", images: [] },
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
      <input type="file" multiple accept="image/*" onChange={handleUpload} className="mt-1 p-1 text-xs border border-slate-300 rounded bg-white w-full" />
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mt-1">
          {previews.map((preview, i) => (
            <div key={i} className="relative">
              <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-12 object-cover rounded border" />
              <button type="button" onClick={() => removeFile(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]">×</button>
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
      <button key={star} type="button" onClick={() => setRating(star)} className={`transition-colors ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}>
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
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Upload size={18} /> {label}</label>
      <input type="file" multiple={multiple} accept={accept} onChange={handleUpload} className="mt-2 p-2 border border-slate-300 rounded bg-white w-full" />
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative">
              <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-20 object-cover rounded border" />
              <button type="button" onClick={() => removeFile(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusSelector = ({ value, onChange }) => {
  const options = ["OKAY", "NOT OKAY", "N/A", "WORKING FINE", "NORMAL", "GOOD", "POOR", "MINOR RUST"];
  const isCustom = !options.includes(value) && value !== "";
  return (
    <div className="flex gap-2">
      <select value={isCustom ? "custom" : (value || "")} onChange={(e) => { if (e.target.value === "custom") { onChange(" "); } else { onChange(e.target.value); } }} className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900">
        <option value="">Select Status</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        <option value="custom">Custom...</option>
      </select>
      {isCustom && <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 border-blue-400 rounded bg-white text-slate-900" placeholder="Enter custom status" />}
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
          <textarea value={data.comments} onChange={(e) => onChange(sectionName, "comments", e.target.value)} className="w-full mt-1 p-2 border-slate-300 rounded bg-slate-50 text-slate-900" rows="2" />
        </div>
        {showUpload && <ImageUpload label={`Upload ${title} Images`} files={files} setFiles={setFiles} />}
      </div>
    </div>
  );
};

// 👇 UPDATED: New Interactive Car Diagram with selection logic
const InteractiveCarDiagram = ({ selectedParts, onPartSelect, activeDefect }) => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[9/13] border bg-white shadow-inner rounded-xl overflow-hidden">
      {/* Background Image */}
      <img src="/CarImage.png" alt="Car Diagram" className="w-full h-full object-contain" />

      {/* Warning Overlay if no defect selected */}
      {!activeDefect && (
        <div className="absolute top-2 left-0 right-0 text-center pointer-events-none">
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow border border-yellow-300">
            Select a defect type below first
          </span>
        </div>
      )}

      {/* Render All Clickable Parts */}
      {CAR_PARTS_CONFIG.map((part) => {
        // Check if this part has a defect assigned in the report data
        const defectData = selectedParts.find((p) => p.id === part.id);
        const hasDefect = !!defectData;

        // Get Defect ID number for display (e.g., "8" for Chip Off)
        const defectNumber = hasDefect 
          ? DEFECT_TYPES.find(d => d.label === defectData.defect)?.id 
          : null;

        return (
          <button
            key={part.id}
            type="button"
            onClick={() => onPartSelect(part)}
            style={{
              position: "absolute",
              top: part.top,
              left: part.left,
              width: part.width,
              height: part.height,
              zIndex: part.zIndex || 10, // Default z-index
              backgroundColor: hasDefect ? "rgba(220, 38, 38, 0.4)" : "transparent", // Red if defective
              border: hasDefect ? "2px solid red" : "1px solid rgba(0,0,0,0.05)", // Solid red or faint border
              borderRadius: "4px",
              cursor: "pointer",
            }}
            title={`${part.name} ${hasDefect ? `(${defectData.defect})` : ""}`}
            className="group hover:bg-blue-500/20 transition-colors"
          >
            {/* Show Defect Number Bubble */}
            {hasDefect && defectNumber && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm z-20">
                {defectNumber}
              </span>
            )}
            
            {/* Hover Tooltip name */}
            <span className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
              {part.name}
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
  
  // 👇 STATE FOR ACTIVE DEFECT SELECTION
  const [activeDefect, setActiveDefect] = useState(null); // e.g. { id: 8, label: "CHIP OFF" }

  const [tyreImageFiles, setTyreImageFiles] = useState({ 
    frontLhs: [], frontRhs: [], rearLhs: [], rearRhs: [] 
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

  // 👇 UPDATED: Handle Part Selection Logic
  const handlePartSelect = (partConfig) => {
    if (!activeDefect) {
      alert("Please select a Defect Type (1-10) from the list on the right first.");
      return;
    }

    setFormData((prev) => {
      const currentParts = [...prev.paintAndBody.selectedParts];
      const existingIndex = currentParts.findIndex((p) => p.id === partConfig.id);

      if (existingIndex > -1) {
        // If part already selected, update its defect to the CURRENT selection
        // Logic: Replace existing defect with new selection (e.g. change Scratch to Dent)
        if (currentParts[existingIndex].defect === activeDefect.label) {
          // If clicking same part with same defect, maybe remove it? (Toggle off)
          currentParts.splice(existingIndex, 1);
        } else {
          // Update defect
          currentParts[existingIndex].defect = activeDefect.label;
        }
      } else {
        // Add new part with active defect
        currentParts.push({
          id: partConfig.id,
          name: partConfig.name,
          defect: activeDefect.label
        });
      }

      // Auto-generate notes based on selection
      const newNotes = currentParts.map((p) => `${p.name}: ${p.defect}`).join(", ");

      return {
        ...prev,
        paintAndBody: {
          ...prev.paintAndBody,
          selectedParts: currentParts,
          notes: newNotes,
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

      Object.entries(tyreImageFiles).forEach(([position, fileArray]) => {
        if (Array.isArray(fileArray) && fileArray.length > 0) {
          fileArray.forEach((file) => formDataToSend.append(`tyreImages_${position}`, file));
        }
      });

      formDataToSend.append("reportData", JSON.stringify(formData));

      const response = await axios.post(`${API_URL}/reports`, formDataToSend, {
        timeout: 90000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      if (response.data.success) {
        const savedReport = response.data.report;
        const savedId = savedReport.report_id || formData.reportId;
        setSuccess(true);
        setTimeout(() => {
          navigate(`/report/${savedId}`, {
            state: {
              autoDownload: true,
              finalReportData: {
                ...formData,
                vehicleSummary: { ...formData.vehicleSummary, vehicleImages: savedReport.vehicle_data?.vehicleImages || [] },
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
      } else {
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
          <button onClick={() => document.getElementById("report-form")?.requestSubmit()} disabled={loading} className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {loading ? "Saving..." : "Save & Generate PDF"}
          </button>
        </header>

        <form id="report-form" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>{tab.label}</button>
            ))}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm min-h-[600px] border border-slate-200">
            {/* {activeTab === 'header' && (
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
            )} */}
            {activeTab === 'header' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Report Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 👇 REMOVED: Customer Name input */}
                  <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Report ID</label><input type="text" name="reportId" value={formData.reportId} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
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
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input type="text" value={formData.vehicleSummary[key]} onChange={(e) => handleSectionChange('vehicleSummary', key, e.target.value)} className="p-2 border border-slate-300 rounded bg-white" />
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
                      <h3 className="font-bold text-blue-700 uppercase mb-4 border-b pb-2">{pos.replace(/([A-Z])/g, ' $1').toUpperCase()}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Condition</label>
                          <StatusSelector value={formData.wheels[pos].condition} onChange={(val) => handleSectionChange('wheels', pos, {...formData.wheels[pos], condition: val})} />
                        </div>
                        <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Manufacturer</label><input type="text" value={formData.wheels[pos].manufacturer} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], manufacturer: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
                        <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Year</label><input type="text" value={formData.wheels[pos].year} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], year: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
                        <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Tyre Size</label><input type="text" value={formData.wheels[pos].tyreSize} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], tyreSize: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
                        <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase">Wheel Alloys</label><input type="text" value={formData.wheels[pos].wheelAlloys} onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], wheelAlloys: e.target.value})} className="p-2 border border-slate-300 rounded bg-white" /></div>
                      </div>
                      <TyreImageUpload label={`Upload ${pos.toUpperCase()} Images`} files={tyreImageFiles[pos]} setFiles={(newFiles) => setTyreImageFiles(prev => ({...prev, [pos]: newFiles}))} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'paintAndBody' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Paint and Body Appraisal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  
                  {/* Left Column: Interactive Diagram */}
                  <div>
                    <InteractiveCarDiagram 
                      selectedParts={formData.paintAndBody.selectedParts} 
                      onPartSelect={handlePartSelect} 
                      activeDefect={activeDefect}
                    />
                    <div className="text-center mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                      <span className="font-bold">Instructions:</span> 
                      <ol className="list-decimal list-inside text-left mx-auto max-w-xs mt-1 space-y-1">
                        <li>Select a defect type on the right (e.g., Chip Off).</li>
                        <li>Click the relevant part on the car diagram.</li>
                        <li>Repeat for other defects.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Right Column: Defect Selector & List */}
                  <div>
                    <div className="mb-6">
                      <label className="text-sm font-bold text-slate-700 uppercase mb-2 block">1. Select Defect Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {DEFECT_TYPES.map(dt => (
                          <button
                            key={dt.id}
                            type="button"
                            onClick={() => setActiveDefect(dt)}
                            className={`px-3 py-2 text-xs font-bold text-left rounded border transition-all ${
                              activeDefect?.id === dt.id 
                                ? "bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-300" 
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {dt.id}. {dt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-bold text-slate-700 uppercase mb-2 block">Selected Defects List</label>
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-700 min-h-[100px] max-h-[200px] overflow-y-auto">
                        {formData.paintAndBody.selectedParts.length > 0 ? (
                          <ul className="space-y-1">
                            {formData.paintAndBody.selectedParts.map((p, idx) => (
                              <li key={idx} className="flex justify-between items-center border-b border-slate-200 pb-1 last:border-0">
                                <span><b>{p.name}</b>: {p.defect}</span>
                                <button type="button" className="text-red-500 hover:text-red-700" onClick={() => {
                                  // Manual remove functionality
                                  const newParts = formData.paintAndBody.selectedParts.filter(part => part.id !== p.id);
                                  setFormData(prev => ({
                                    ...prev,
                                    paintAndBody: {
                                      ...prev.paintAndBody,
                                      selectedParts: newParts,
                                      notes: newParts.map(np => `${np.name}: ${np.defect}`).join(", ")
                                    }
                                  }));
                                }}>×</button>
                              </li>
                            ))}
                          </ul>
                        ) : <span className="text-slate-400 italic">No parts marked yet.</span>}
                      </div>
                    </div>

                    <label className="text-sm font-bold text-slate-700 uppercase block mb-2">Inspection Notes (Auto-Generated)</label>
                    <textarea value={formData.paintAndBody.notes} onChange={(e) => handleSectionChange('paintAndBody', 'notes', e.target.value)} className="w-full p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" rows="4" />
                    <ImageUpload label="Upload Paint & Body Images" files={files.paintBodyImages} setFiles={(newFiles) => setFiles(prev => ({...prev, paintBodyImages: newFiles}))} />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'engine' && <ChecklistSection title="Engine & Transmission Inspection" data={formData.engineTransmission} sectionName="engineTransmission" onChange={handleSectionChange} files={files.engineImages} setFiles={(newFiles) => setFiles(prev => ({...prev, engineImages: newFiles}))} />}
            {activeTab === 'suspension' && <ChecklistSection title="Suspension, Steering and Brake Inspection" data={formData.suspensionSteering} sectionName="suspensionSteering" onChange={handleSectionChange} files={files.suspensionImages} setFiles={(newFiles) => setFiles(prev => ({...prev, suspensionImages: newFiles}))} />}
            {activeTab === 'interiors' && <ChecklistSection title="Interiors, Electricals and Lightings" data={formData.interiors} sectionName="interiors" onChange={handleSectionChange} files={files.interiorImages} setFiles={(newFiles) => setFiles(prev => ({...prev, interiorImages: newFiles}))} />}
            {activeTab === 'battery' && <ChecklistSection title="Battery Analysis" data={formData.batteryAnalysis} sectionName="batteryAnalysis" onChange={handleSectionChange} files={files.batteryImages} setFiles={(newFiles) => setFiles(prev => ({...prev, batteryImages: newFiles}))} />}
            {activeTab === 'specs' && <ChecklistSection title="Other Specifications" data={formData.otherSpecifications} sectionName="otherSpecifications" onChange={handleSectionChange} files={files.specsImages} setFiles={(newFiles) => setFiles(prev => ({...prev, specsImages: newFiles}))} />}
            {activeTab === 'diagnostic' && (
              <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b">Diagnostic Report</h2>
                <div className="space-y-4">
                  <div className="flex flex-col"><label className="font-semibold text-sm text-slate-700">Immediate Attention Required</label><textarea value={formData.diagnosticReport.immediateAttention} onChange={(e) => handleSectionChange('diagnosticReport', 'immediateAttention', e.target.value)} className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" rows="2" /></div>
                  <div className="flex flex-col"><label className="font-semibold text-sm text-slate-700">Diagnostic Comments</label><textarea value={formData.diagnosticReport.comments} onChange={(e) => handleSectionChange('diagnosticReport', 'comments', e.target.value)} className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" rows="3" /></div>
                  <div className="flex flex-col"><label className="font-semibold text-sm text-slate-700">Upload Diagnostic PDF</label><input type="file" accept=".pdf" onChange={(e) => setFiles(prev => ({...prev, diagnosticPdf: [e.target.files[0]]}))} className="mt-2 p-2 border border-slate-300 rounded bg-white w-full" /></div>
                </div>
              </div>
            )}
            {activeTab === 'roadTest' && (
              <div>
                <ChecklistSection title="Road Test Remarks" data={formData.roadTest} sectionName="roadTest" onChange={handleSectionChange} showUpload={false} />
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Ready to Submit</h3>
                  <p className="text-sm text-blue-700 mb-4">Click "Save & Generate PDF" button at the top to save report to database and download PDF.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
              {loading ? <Loader2 className="animate-spin" size={20} /> : null}
              {loading ? "Uploading images, please wait..." : "Generate & Save Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


//START 05-03-26 Working________________________________________________
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Star, Upload, Loader2, CheckCircle } from "lucide-react";
// import { format } from "date-fns";
// import axios from "axios";

// //const API_URL = "http://localhost:5001/api";
// const API_URL = "https://carinspection-1.onrender.com/api";


// const initialState = {
//   reportId: "SYC-" + Math.floor(1000 + Math.random() * 9000),
//   customerName: "Mohammad",
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
//     horsePower: "105HP",
//     externalColor: "BLUE",
//     fuelType: "PATROL",
//     specs: "GCC",
//     vehicleRegNo: "ABC123", // 👈 ADDED
//   },

//   wheels: {
//     frontLhs: { 
//       manufacturer: "NEXEN", 
//       year: "2025", 
//       tyreSize: "225/40ZR18", 
//       condition: "GOOD", 
//       wheelAlloys: "ALLOY WHEELS",
//       images: [] // 👈 ADDED
//     },
//     frontRhs: { 
//       manufacturer: "NEXEN", 
//       year: "2025", 
//       tyreSize: "225/40ZR18", 
//       condition: "GOOD", 
//       wheelAlloys: "ALLOY WHEELS",
//       images: [] // 👈 ADDED
//     },
//     rearLhs: { 
//       manufacturer: "NEXEN", 
//       year: "2025", 
//       tyreSize: "225/40ZR18", 
//       condition: "GOOD", 
//       wheelAlloys: "ALLOY WHEELS",
//       images: [] // 👈 ADDED
//     },
//     rearRhs: { 
//       manufacturer: "NEXEN", 
//       year: "2025", 
//       tyreSize: "225/40ZR18", 
//       condition: "GOOD", 
//       wheelAlloys: "ALLOY WHEELS",
//       images: [] // 👈 ADDED
//     },
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
//     // ABS: "OKAY",
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
//     "AUTO HOLD": "EQUIPPED",
//     "SOUND SYSTEM": "EQUIPPED",
//     "CRUISE CONTROL": "EQUIPPED",
//     "SUNROOF TYPE": "PANOROMIC",
//     "VENTILATED/LEATHER SEATS": "N/A",
//     "FABRIC SEATS": "EQUIPPED",
//     "PUSH START/STOP": "EQUIPPED",
//     "NO OF KEYS": "1",
//     "REAR VIEW CAMERA": "NOT EQUIPPED",
//     "RADAR/ADAS": "NOT EQUIPPED",
//     ABS: "OKAY",
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
//     "BLIND SPOT": "WORKING FINE",
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

// // 👇 NEW: Component to upload images per tyre
// const TyreImageUpload = ({ label, files, setFiles }) => {
//   const [previews, setPreviews] = useState([]);

//   const handleUpload = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     if (!selectedFiles.length) return;

//     const nextFiles = [...files, ...selectedFiles];
//     setFiles(nextFiles);

//     const nextPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
//     setPreviews((prev) => [...prev, ...nextPreviews]);
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//     setPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="mt-3">
//       <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
//         <Upload size={14} /> {label}
//       </label>
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleUpload}
//         className="mt-1 p-1 text-xs border border-slate-300 rounded bg-white w-full"
//       />
//       {previews.length > 0 && (
//         <div className="grid grid-cols-3 gap-1 mt-1">
//           {previews.map((preview, i) => (
//             <div key={i} className="relative">
//               <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-12 object-cover rounded border" />
//               <button
//                 type="button"
//                 onClick={() => removeFile(i)}
//                 className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]"
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
// //new
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

// // const StatusSelector = ({ value, onChange }) => {
// //   const options = ["OKAY", "NOT OKAY", "N/A", "WORKING FINE", "NORMAL", "GOOD", "POOR", "MINOR RUST"];
// //   const isCustom = !options.includes(value) && value !== "";
// //   return (
// //     <div className="flex gap-2">
// //       <select
// //         value={isCustom ? "custom" : value}
// //         onChange={(e) => onChange(e.target.value === "custom" ? "" : e.target.value)}
// //         className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900"
// //       >
// //         <option value="">Select Status</option>
// //         {options.map((opt) => (
// //           <option key={opt} value={opt}>
// //             {opt}
// //           </option>
// //         ))}
// //         <option value="custom">Custom...</option>
// //       </select>
// //       {isCustom && (
// //         <input
// //           type="text"
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           className="w-full p-2 border-blue-400 rounded bg-white text-slate-900"
// //           placeholder="Custom status"
// //         />
// //       )}
// //     </div>
// //   );
// // };
// // ✅ FIXED StatusSelector Component
// const StatusSelector = ({ value, onChange }) => {
//   const options = ["OKAY", "NOT OKAY", "N/A", "WORKING FINE", "NORMAL", "GOOD", "POOR", "MINOR RUST"];
//   const isCustom = !options.includes(value) && value !== "";
  
//   return (
//     <div className="flex gap-2">
//       <select
//         value={isCustom ? "custom" : (value || "")}
//         onChange={(e) => {
//           if (e.target.value === "custom") {
//             onChange(" "); // ✅ Set a default custom value
//           } else {
//             onChange(e.target.value);
//           }
//         }}
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
//           placeholder="Enter custom status"
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
//   const [tyreImageFiles, setTyreImageFiles] = useState({ // 👈 ADDED
//     frontLhs: [],
//     frontRhs: [],
//     rearLhs: [],
//     rearRhs: [],
//   });
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

//       // 👇 Append tyre images
//       Object.entries(tyreImageFiles).forEach(([position, fileArray]) => {
//         if (Array.isArray(fileArray) && fileArray.length > 0) {
//           fileArray.forEach((file) => formDataToSend.append(`tyreImages_${position}`, file));
//         }
//       });

//       formDataToSend.append("reportData", JSON.stringify(formData));

//       console.log("Submitting report...", formData.reportId);
//       // const response = await axios.post(`${API_URL}/reports`, formDataToSend, {
//       //   headers: { "Content-Type": "multipart/form-data" },
//       // });
// const response = await axios.post(`${API_URL}/reports`, formDataToSend, {
//   timeout: 90000,
//   maxContentLength: Infinity,
//   maxBodyLength: Infinity
// });
//       console.log("Raw response:", response.data);

//       // if (response.data.success) {
//       //   const savedId = response.data.report?.report_id || formData.reportId;
//       //   console.log("Report saved, navigating with id:", savedId);

//       //   setSuccess(true);
//       //   setTimeout(() => {
//       //     navigate(`/report/${savedId}`, {
//       //       state: {
//       //         autoDownload: true,
//       //         finalReportData: formData,
//       //       },
//       //     });
//       //   }, 1500);
//       // } 
//       // ✅ REPLACE THIS SECTION IN handleSubmit
// if (response.data.success) {
//   const savedReport = response.data.report;
//   const savedId = savedReport.report_id || formData.reportId;
//   console.log("Report saved, navigating with id:", savedId);

//   setSuccess(true);
//   setTimeout(() => {
//     navigate(`/report/${savedId}`, {
//       state: {
//         autoDownload: true,
//         // ✅ Use the report data FROM BACKEND which has image URLs
//         finalReportData: {
//           ...formData,
//           vehicleSummary: {
//             ...formData.vehicleSummary,
//             vehicleImages: savedReport.vehicle_data?.vehicleImages || []
//           },
//           wheels: savedReport.wheels_data || formData.wheels,
//           paintAndBody: savedReport.paint_body_data || formData.paintAndBody,
//           engineTransmission: savedReport.engine_transmission || formData.engineTransmission,
//           suspensionSteering: savedReport.suspension_steering || formData.suspensionSteering,
//           interiors: savedReport.interiors || formData.interiors,
//           batteryAnalysis: savedReport.battery_analysis || formData.batteryAnalysis,
//           otherSpecifications: savedReport.other_specs || formData.otherSpecifications,
//           diagnosticReport: savedReport.diagnostic_report || formData.diagnosticReport,
//         },
//       },
//     });
//   }, 1500);
// }else {
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

//             {activeTab === 'header' && (
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Report Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Report ID</label><input type="text" name="reportId" value={formData.reportId} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                   <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label><input type="text" name="customerName" value={formData.customerName} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                   <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Date & Time</label><input type="datetime-local" value={format(formData.date, "yyyy-MM-dd'T'HH:mm")} onChange={handleDateChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                   <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Inspection Type</label><input type="text" name="typeOfInspection" value={formData.typeOfInspection} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                   <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Year Make Model</label><input type="text" name="yearMakeModel" value={formData.yearMakeModel} onChange={handleRootChange} className="p-2 border border-slate-300 rounded bg-white" /></div>
//                   <div className="flex flex-col"><label className="text-xs font-bold text-slate-500 uppercase mb-1">Overall Rating</label><StarRating rating={formData.overallRating} setRating={(val) => setFormData(prev => ({...prev, overallRating: val}))} /></div>
//                 </div>
//                 <ImageUpload label="Upload Vehicle External Pictures" files={files.vehicleImages} setFiles={(newFiles) => setFiles(prev => ({...prev, vehicleImages: newFiles}))} />
//               </div>
//             )}

//             {activeTab === 'vehicleSummary' && (
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Vehicle Summary</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {Object.keys(formData.vehicleSummary).map((key) => (
//                     <div key={key} className="flex flex-col">
//                       <label className="text-xs font-bold text-slate-500 uppercase mb-1">
//                         {key.replace(/([A-Z])/g, ' $1').trim()}
//                       </label>
//                       <input 
//                         type="text" 
//                         value={formData.vehicleSummary[key]} 
//                         onChange={(e) => handleSectionChange('vehicleSummary', key, e.target.value)} 
//                         className="p-2 border border-slate-300 rounded bg-white" 
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'wheels' && (
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Wheels and Tyre Condition</h2>
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//                   {['frontLhs', 'frontRhs', 'rearLhs', 'rearRhs'].map((pos) => (
//                     <div key={pos} className="border rounded-lg p-4 bg-slate-50">
//                       <h3 className="font-bold text-blue-700 uppercase mb-4 border-b pb-2">
//                         {pos.replace(/([A-Z])/g, ' $1').toUpperCase()}
//                       </h3>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="col-span-2">
//                           <label className="text-xs font-bold text-slate-500 uppercase">Condition</label>
//                           <StatusSelector 
//                             value={formData.wheels[pos].condition} 
//                             onChange={(val) => handleSectionChange('wheels', pos, {...formData.wheels[pos], condition: val})} 
//                           />
//                         </div>
//                         <div className="flex flex-col">
//                           <label className="text-xs font-bold text-slate-500 uppercase">Manufacturer</label>
//                           <input 
//                             type="text" 
//                             value={formData.wheels[pos].manufacturer} 
//                             onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], manufacturer: e.target.value})} 
//                             className="p-2 border border-slate-300 rounded bg-white" 
//                           />
//                         </div>
//                         <div className="flex flex-col">
//                           <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
//                           <input 
//                             type="text" 
//                             value={formData.wheels[pos].year} 
//                             onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], year: e.target.value})} 
//                             className="p-2 border border-slate-300 rounded bg-white" 
//                           />
//                         </div>
//                         <div className="flex flex-col">
//                           <label className="text-xs font-bold text-slate-500 uppercase">Tyre Size</label>
//                           <input 
//                             type="text" 
//                             value={formData.wheels[pos].tyreSize} 
//                             onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], tyreSize: e.target.value})} 
//                             className="p-2 border border-slate-300 rounded bg-white" 
//                           />
//                         </div>
//                         <div className="flex flex-col">
//                           <label className="text-xs font-bold text-slate-500 uppercase">Wheel Alloys</label>
//                           <input 
//                             type="text" 
//                             value={formData.wheels[pos].wheelAlloys} 
//                             onChange={(e) => handleSectionChange('wheels', pos, {...formData.wheels[pos], wheelAlloys: e.target.value})} 
//                             className="p-2 border border-slate-300 rounded bg-white" 
//                           />
//                         </div>
//                       </div>

//                       {/* 👇 Tyre Image Upload */}
//                       <TyreImageUpload
//                         label={`Upload ${pos.toUpperCase()} Images`}
//                         files={tyreImageFiles[pos]}
//                         setFiles={(newFiles) => setTyreImageFiles(prev => ({
//                           ...prev,
//                           [pos]: newFiles
//                         }))}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'paintAndBody' && (
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b">Paint and Body Appraisal</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
//                   <div>
//                     <InteractiveCarDiagram selectedParts={formData.paintAndBody.selectedParts} onPartSelect={handlePartSelect} />
//                     <p className="text-center text-xs text-slate-400 mt-2">Click numbered areas to select defects</p>
//                   </div>
//                   <div>
//                     <div className="mb-6">
//                       <label className="text-sm font-bold text-slate-700 uppercase mb-2">Selected Defects</label>
//                       <div className="p-3 bg-slate-100 border border-slate-200 rounded text-sm text-slate-700 min-h-[100px]">
//                         {formData.paintAndBody.selectedParts.length > 0 ? formData.paintAndBody.selectedParts.map(p => <p key={p.id}><b>{p.id}. {p.name}</b>: {p.defect}</p>) : <span className="text-slate-400 italic">No parts selected</span>}
//                       </div>
//                     </div>
//                     <label className="text-sm font-bold text-slate-700 uppercase block mb-2">Inspection Notes</label>
//                     <textarea 
//                       value={formData.paintAndBody.notes} 
//                       onChange={(e) => handleSectionChange('paintAndBody', 'notes', e.target.value)} 
//                       className="w-full p-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-900" 
//                       rows="6" 
//                       placeholder="Enter details..." 
//                     />
//                     <ImageUpload 
//                       label="Upload Paint & Body Images" 
//                       files={files.paintBodyImages} 
//                       setFiles={(newFiles) => setFiles(prev => ({...prev, paintBodyImages: newFiles}))} 
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {activeTab === 'engine' && (
//               <ChecklistSection 
//                 title="Engine & Transmission Inspection" 
//                 data={formData.engineTransmission} 
//                 sectionName="engineTransmission" 
//                 onChange={handleSectionChange} 
//                 files={files.engineImages} 
//                 setFiles={(newFiles) => setFiles(prev => ({...prev, engineImages: newFiles}))} 
//               />
//             )}
//             {activeTab === 'suspension' && (
//               <ChecklistSection 
//                 title="Suspension, Steering and Brake Inspection" 
//                 data={formData.suspensionSteering} 
//                 sectionName="suspensionSteering" 
//                 onChange={handleSectionChange} 
//                 files={files.suspensionImages} 
//                 setFiles={(newFiles) => setFiles(prev => ({...prev, suspensionImages: newFiles}))} 
//               />
//             )}
//             {activeTab === 'interiors' && (
//               <ChecklistSection 
//                 title="Interiors, Electricals and Lightings" 
//                 data={formData.interiors} 
//                 sectionName="interiors" 
//                 onChange={handleSectionChange} 
//                 files={files.interiorImages} 
//                 setFiles={(newFiles) => setFiles(prev => ({...prev, interiorImages: newFiles}))} 
//               />
//             )}
//             {activeTab === 'battery' && (
//               <ChecklistSection 
//                 title="Battery Analysis" 
//                 data={formData.batteryAnalysis} 
//                 sectionName="batteryAnalysis" 
//                 onChange={handleSectionChange} 
//                 files={files.batteryImages} 
//                 setFiles={(newFiles) => setFiles(prev => ({...prev, batteryImages: newFiles}))} 
//               />
//             )}
//             {activeTab === 'specs' && (
//               <ChecklistSection 
//                 title="Other Specifications" 
//                 data={formData.otherSpecifications} 
//                 sectionName="otherSpecifications" 
//                 onChange={handleSectionChange} 
//                 files={files.specsImages} 
//                 setFiles={(newFiles) => setFiles(prev => ({...prev, specsImages: newFiles}))} 
//               />
//             )}
//             {activeTab === 'diagnostic' && (
//               <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//                 <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b">Diagnostic Report</h2>
//                 <div className="space-y-4">
//                   <div className="flex flex-col">
//                     <label className="font-semibold text-sm text-slate-700">Immediate Attention Required</label>
//                     <textarea 
//                       value={formData.diagnosticReport.immediateAttention} 
//                       onChange={(e) => handleSectionChange('diagnosticReport', 'immediateAttention', e.target.value)} 
//                       className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" 
//                       rows="2" 
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className="font-semibold text-sm text-slate-700">Diagnostic Comments</label>
//                     <textarea 
//                       value={formData.diagnosticReport.comments} 
//                       onChange={(e) => handleSectionChange('diagnosticReport', 'comments', e.target.value)} 
//                       className="w-full p-2 border-slate-300 rounded bg-slate-50 text-slate-900" 
//                       rows="3" 
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className="font-semibold text-sm text-slate-700">Upload Diagnostic PDF</label>
//                     <input 
//                       type="file" 
//                       accept=".pdf" 
//                       onChange={(e) => setFiles(prev => ({...prev, diagnosticPdf: [e.target.files[0]]}))} 
//                       className="mt-2 p-2 border border-slate-300 rounded bg-white w-full" 
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//             {activeTab === 'roadTest' && (
//               <div>
//                 <ChecklistSection 
//                   title="Road Test Remarks" 
//                   data={formData.roadTest} 
//                   sectionName="roadTest" 
//                   onChange={handleSectionChange} 
//                   showUpload={false} 
//                 />
//                 <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
//                   <h3 className="font-bold text-blue-800 mb-2">Ready to Submit</h3>
//                   <p className="text-sm text-blue-700 mb-4">Click "Save & Generate PDF" button at the top to save report to database and download PDF.</p>
//                 </div>
//               </div>
//             )}

//           </div>

//           <div className="flex justify-end mt-8">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
//             >
//               {loading ? <Loader2 className="animate-spin" size={20} /> : null}
//               {loading ? "Uploading images, please wait..." : "Generate & Save Report"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


//END 05-03-26 Working________________________________________________

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


