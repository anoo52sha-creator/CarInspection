import express from "express";
import cors from "cors";
import pg from "pg";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "✅ API Online",
    message: "Car Inspection Backend is running",
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "car-inspections",
    resource_type: "auto",
    type: "upload",
    access_mode: "public",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  }),
});

const upload = multer({ storage });

const multipleUpload = upload.fields([
  { name: "vehicleImages", maxCount: 20 },
  { name: "paintBodyImages", maxCount: 20 },
  { name: "engineImages", maxCount: 20 },
  { name: "suspensionImages", maxCount: 20 },
  { name: "interiorImages", maxCount: 20 },
  { name: "batteryImages", maxCount: 20 },
  { name: "specsImages", maxCount: 20 },
  { name: "diagnosticPdf", maxCount: 20 },
  { name: "tyreImages_frontLhs", maxCount: 20 },
  { name: "tyreImages_frontRhs", maxCount: 20 },
  { name: "tyreImages_rearLhs", maxCount: 20 },
  { name: "tyreImages_rearRhs", maxCount: 20 },
]);

const createTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS inspection_reports (
        id SERIAL PRIMARY KEY,
        report_id VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(100),
        overall_rating INTEGER,
        inspection_date TIMESTAMP,
        inspection_type VARCHAR(100),
        year_make_model VARCHAR(200),
        vehicle_data JSONB,
        wheels_data JSONB,
        paint_body_data JSONB,
        engine_transmission JSONB,
        suspension_steering JSONB,
        interiors JSONB,
        battery_analysis JSONB,
        other_specs JSONB,
        diagnostic_report JSONB,
        road_test JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log("✅ Neon Database table ready");
  } catch (err) {
    console.error("❌ Failed to connect to Neon / create table:", err);
  }
};

createTable();

app.post(
  "/api/reports",
  (req, res, next) => {
    req.setTimeout(120000);

    multipleUpload(req, res, (err) => {
      if (err) {
        console.error("❌ File Upload Error:", err);
        return res.status(400).json({
          success: false,
          error: `File upload failed: ${err.message}`,
        });
      }
      next();
    });
  },
  async (req, res) => {
    console.log("📥 Received report submission.");
    console.log("📁 Files received:", req.files ? Object.keys(req.files) : "No files");
    console.log("📝 Body has reportData:", !!req.body.reportData);

    try {
      if (!req.body.reportData) {
        return res.status(400).json({ success: false, error: "No report data received" });
      }

      let reportData;
      try {
        reportData = JSON.parse(req.body.reportData);
      } catch (parseErr) {
        console.error("❌ Invalid JSON in reportData:", parseErr);
        return res.status(400).json({ success: false, error: "Invalid report data format" });
      }

      const files = req.files || {};
      console.log("Example uploaded file object:", files.vehicleImages?.[0]);

      const getUrls = (field) => {
        if (!files[field] || !Array.isArray(files[field])) return [];
        return files[field]
          .map((f) => f.path || f.secure_url || f.url || null)
          .filter(Boolean);
      };

      const vehicleImages = getUrls("vehicleImages");
      console.log("📸 Extracted vehicle image URLs:", vehicleImages);

      reportData.vehicleSummary = reportData.vehicleSummary || {};
      reportData.vehicleSummary.vehicleImages = vehicleImages;

      reportData.wheels = reportData.wheels || {};
      reportData.wheels.frontLhs = reportData.wheels.frontLhs || {};
      reportData.wheels.frontRhs = reportData.wheels.frontRhs || {};
      reportData.wheels.rearLhs = reportData.wheels.rearLhs || {};
      reportData.wheels.rearRhs = reportData.wheels.rearRhs || {};

      reportData.wheels.frontLhs.images = getUrls("tyreImages_frontLhs");
      reportData.wheels.frontRhs.images = getUrls("tyreImages_frontRhs");
      reportData.wheels.rearLhs.images = getUrls("tyreImages_rearLhs");
      reportData.wheels.rearRhs.images = getUrls("tyreImages_rearRhs");

      reportData.paintAndBody = reportData.paintAndBody || { images: [], selectedParts: [], notes: "" };
      reportData.paintAndBody.images = getUrls("paintBodyImages");

      reportData.engineTransmission = reportData.engineTransmission || { comments: "", images: [] };
      reportData.engineTransmission.images = getUrls("engineImages");

      reportData.suspensionSteering = reportData.suspensionSteering || { comments: "", images: [] };
      reportData.suspensionSteering.images = getUrls("suspensionImages");

      reportData.interiors = reportData.interiors || { comments: "", images: [] };
      reportData.interiors.images = getUrls("interiorImages");

      reportData.batteryAnalysis = reportData.batteryAnalysis || { comments: "", images: [] };
      reportData.batteryAnalysis.images = getUrls("batteryImages");

      reportData.otherSpecifications = reportData.otherSpecifications || { comments: "", images: [] };
      reportData.otherSpecifications.images = getUrls("specsImages");

      reportData.diagnosticReport = reportData.diagnosticReport || {};
      if (files.diagnosticPdf?.[0]) {
        reportData.diagnosticReport.pdfFile =
          files.diagnosticPdf[0].path ||
          files.diagnosticPdf[0].secure_url ||
          files.diagnosticPdf[0].url ||
          null;
      }

      const query = `
        INSERT INTO inspection_reports (
          report_id, customer_name, overall_rating, inspection_date,
          inspection_type, year_make_model, vehicle_data, wheels_data,
          paint_body_data, engine_transmission, suspension_steering,
          interiors, battery_analysis, other_specs, diagnostic_report, road_test
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (report_id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          overall_rating = EXCLUDED.overall_rating,
          inspection_date = EXCLUDED.inspection_date,
          inspection_type = EXCLUDED.inspection_type,
          year_make_model = EXCLUDED.year_make_model,
          vehicle_data = EXCLUDED.vehicle_data,
          wheels_data = EXCLUDED.wheels_data,
          paint_body_data = EXCLUDED.paint_body_data,
          engine_transmission = EXCLUDED.engine_transmission,
          suspension_steering = EXCLUDED.suspension_steering,
          interiors = EXCLUDED.interiors,
          battery_analysis = EXCLUDED.battery_analysis,
          other_specs = EXCLUDED.other_specs,
          diagnostic_report = EXCLUDED.diagnostic_report,
          road_test = EXCLUDED.road_test,
          created_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      const values = [
        reportData.reportId,
        reportData.customerName || null,
        reportData.overallRating,
        reportData.date,
        reportData.typeOfInspection,
        reportData.yearMakeModel,
        JSON.stringify(reportData.vehicleSummary),
        JSON.stringify(reportData.wheels),
        JSON.stringify(reportData.paintAndBody),
        JSON.stringify(reportData.engineTransmission),
        JSON.stringify(reportData.suspensionSteering),
        JSON.stringify(reportData.interiors),
        JSON.stringify(reportData.batteryAnalysis),
        JSON.stringify(reportData.otherSpecifications),
        JSON.stringify(reportData.diagnosticReport),
        JSON.stringify(reportData.roadTest),
      ];

      const result = await pool.query(query, values);

      console.log("✅ Report saved successfully to Neon, Report ID:", result.rows[0].report_id);

      res.json({
        success: true,
        message: "Report saved successfully",
        report_id: result.rows[0].report_id,
      });
    } catch (error) {
      console.error("❌ Database / Server Error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

app.get("/api/reports/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inspection_reports WHERE report_id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, report: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, report_id, customer_name, inspection_date, year_make_model FROM inspection_reports ORDER BY created_at DESC"
    );
    res.json({ success: true, reports: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
// import express from 'express';
// import cors from 'cors';
// import pg from 'pg';
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';


// dotenv.config();
// const { Pool } =  pg;
// const app = express();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     // Required for Neon connections to work properly
//     rejectUnauthorized: false,
//   },
// });
// // ✅ ADD THIS HERE AND NOWHERE ELSE
// app.options('*', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.sendStatus(204);
// });

// app.use(cors({
//   origin: "*", // Allow all origins for testing, lock this down later when you use a custom domain
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type" ,  "Authorization"],
//   optionsSuccessStatus: 204
// }))
// app.use(express.json());
// // Add this right after your CORS middleware, before all other API routes
// app.get('/', (req, res) => {
//   res.json({
//     status: "✅ API Online",
//     message: "Car Inspection Backend is running"
//   })
// })


// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Multer Storage for Cloudinary
// // const storage = new CloudinaryStorage({
// //   cloudinary: cloudinary,
// //   params: {
// //     folder: 'car-inspections',
// //     allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
// //     resource_type: 'auto',
// //   },
// // });
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => ({
//     folder: "car-inspections",
//     resource_type: "auto",
//     type: "upload",          // IMPORTANT: public delivery
//     access_mode: "public",   // IMPORTANT
//     allowed_formats: ["jpg", "png", "jpeg", "pdf"],
//   }),
// });
// const upload = multer({ storage });

// // Multiple file upload middleware
// const multipleUpload = upload.fields([
//   { name: 'vehicleImages', maxCount: 20 },
//   { name: 'paintBodyImages', maxCount: 20},
//   { name: 'engineImages', maxCount: 20 },
//   { name: 'suspensionImages', maxCount: 20 },
//   { name: 'interiorImages', maxCount: 20 },
//   { name: 'batteryImages', maxCount: 20 },
//   { name: 'specsImages', maxCount: 20 },
//   { name: 'diagnosticPdf', maxCount: 20 },
//   { name: 'tyreImages_frontLhs', maxCount: 20},
//   { name: 'tyreImages_frontRhs', maxCount: 20 },
//   { name: 'tyreImages_rearLhs', maxCount: 20 },
//   { name: 'tyreImages_rearRhs', maxCount: 20},
// ]);

// // Auto create database table on first run
// const createTable = async () => {
//   try {
//   const query = `
//     CREATE TABLE IF NOT EXISTS inspection_reports (
//       id SERIAL PRIMARY KEY,
//       report_id VARCHAR(50) UNIQUE NOT NULL,
//       customer_name VARCHAR(100),
//       overall_rating INTEGER,
//       inspection_date TIMESTAMP,
//       inspection_type VARCHAR(100),
//       year_make_model VARCHAR(200),
//       vehicle_data JSONB,
//       wheels_data JSONB,
//       paint_body_data JSONB,
//       engine_transmission JSONB,
//       suspension_steering JSONB,
//       interiors JSONB,
//       battery_analysis JSONB,
//       other_specs JSONB,
//       diagnostic_report JSONB,
//       road_test JSONB,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;
//   await pool.query(query);
//   console.log('✅ Neon Database table ready');
//   } catch (err) {
//     console.error("❌ Failed to connect to Neon / create table:", err)
//   }
// };
// createTable();

// // app.post('/api/reports', (req, res, next) => {
// //    req.setTimeout(120000); // 2 min timeout
// //   // ✅ Catch upload errors first, no more generic Network Errors
// //   multipleUpload(req, res, (err) => {
// //     if (err) {
// //       console.error("❌ File Upload Error:", err);
// //       return res.status(400).json({ 
// //         success: false, 
// //         error: `File upload failed: ${err.message}` 
// //       });
// //     }
// //     next();
// //   })
// // }, async (req, res) => {
// //   console.log("📥 Received report submission.");
// //   const files = req.files || {};

// //   // ✅ ADD THIS LOG RIGHT HERE
// //   console.log("Example uploaded file object:", files.vehicleImages?.[0]);

// //   console.log("📁 Files received:", req.files ? Object.keys(req.files) : "No files");
// //   console.log("📝 Body has reportData:", !!req.body.reportData);

// //   try {
// //     if (!req.body.reportData) {
// //       return res.status(400).json({ success: false, error: "No report data received" });
// //     }

// //     // Catch invalid JSON errors in submitted report data
// //     let reportData;
// //     try {
// //       reportData = JSON.parse(req.body.reportData);
// //     } catch (parseErr) {
// //       console.error("❌ Invalid JSON in reportData:", parseErr)
// //       return res.status(400).json({ success: false, error: "Invalid report data format" })
// //     }
    
// //     console.log("✅ Parsed report data, reportId:", reportData.reportId);

// //     // Get uploaded file URLs, always use HTTPS secure urls from Cloudinary
// //     const files = req.files || {};
// //     // const getUrls = (field) => {
// //     //   if (files[field] && Array.isArray(files[field])) {
// //     //     return files[field].map(f => f.secure_url || f.path || f.url);
// //     //   }
// //     //   return [];
// //     // };

// //  const getUrls = (field) => {
// //   if (files[field] && Array.isArray(files[field])) {
// //     return files[field].map(f => f.path || f.secure_url || f.url).filter(Boolean);
// //   }
// //   return [];
// // };
// //     const vehicleImages = getUrls('vehicleImages');
// //     console.log("📸 Vehicle images uploaded:", vehicleImages.length);

// //     // ✅ store vehicleImages inside vehicleSummary
// //     reportData.vehicleSummary = reportData.vehicleSummary || {};
// //     reportData.vehicleSummary.vehicleImages = vehicleImages;

// //     // Wheels and Tyre Images
// //     reportData.wheels = reportData.wheels || {};
// //     reportData.wheels.frontLhs = reportData.wheels.frontLhs || {};
// //     reportData.wheels.frontRhs = reportData.wheels.frontRhs || {};
// //     reportData.wheels.rearLhs = reportData.wheels.rearLhs || {};
// //     reportData.wheels.rearRhs = reportData.wheels.rearRhs || {};
    
// //     reportData.wheels.frontLhs.images = getUrls('tyreImages_frontLhs');
// //     reportData.wheels.frontRhs.images = getUrls('tyreImages_frontRhs');
// //     reportData.wheels.rearLhs.images = getUrls('tyreImages_rearLhs');
// //     reportData.wheels.rearRhs.images = getUrls('tyreImages_rearRhs');

// //     console.log("🛞 Tyre images attached:", reportData.wheels.frontLhs.images.length);

// //     // Store other section images
// //     reportData.paintAndBody = reportData.paintAndBody || { images: [], selectedParts: [], notes: "" };
// //     reportData.paintAndBody.images = getUrls('paintBodyImages');

// //     reportData.engineTransmission = reportData.engineTransmission || { comments: "", images: [] };
// //     reportData.engineTransmission.images = getUrls('engineImages');

// //     reportData.suspensionSteering = reportData.suspensionSteering || { comments: "", images: [] };
// //     reportData.suspensionSteering.images = getUrls('suspensionImages');

// //     reportData.interiors = reportData.interiors || { comments: "", images: [] };
// //     reportData.interiors.images = getUrls('interiorImages');

// //     reportData.batteryAnalysis = reportData.batteryAnalysis || { comments: "", images: [] };
// //     reportData.batteryAnalysis.images = getUrls('batteryImages');

// //     reportData.otherSpecifications = reportData.otherSpecifications || { comments: "", images: [] };
// //     reportData.otherSpecifications.images = getUrls('specsImages');

// //     if (files.diagnosticPdf && files.diagnosticPdf[0]) {
// //       reportData.diagnosticReport = reportData.diagnosticReport || {};
// //       reportData.diagnosticReport.pdfFile = files.diagnosticPdf[0].secure_url || files.diagnosticPdf[0].path;
// //     }

// //     console.log("💾 Saving report to Neon database...");

// //     const query = `
// //       INSERT INTO inspection_reports (
// //         report_id, customer_name, overall_rating, inspection_date,
// //         inspection_type, year_make_model, vehicle_data, wheels_data,
// //         paint_body_data, engine_transmission, suspension_steering,
// //         interiors, battery_analysis, other_specs, diagnostic_report, road_test
// //       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
// //       ON CONFLICT (report_id) DO UPDATE SET
// //         customer_name = EXCLUDED.customer_name,
// //         overall_rating = EXCLUDED.overall_rating,
// //         inspection_date = EXCLUDED.inspection_date,
// //         inspection_type = EXCLUDED.inspection_type,
// //         year_make_model = EXCLUDED.year_make_model,
// //         vehicle_data = EXCLUDED.vehicle_data,
// //         wheels_data = EXCLUDED.wheels_data,
// //         paint_body_data = EXCLUDED.paint_body_data,
// //         engine_transmission = EXCLUDED.engine_transmission,
// //         suspension_steering = EXCLUDED.suspension_steering,
// //         interiors = EXCLUDED.interiors,
// //         battery_analysis = EXCLUDED.battery_analysis,
// //         other_specs = EXCLUDED.other_specs,
// //         diagnostic_report = EXCLUDED.diagnostic_report,
// //         road_test = EXCLUDED.road_test,
// //         created_at = CURRENT_TIMESTAMP
// //       RETURNING *
// //     `;

// //     const values = [
// //       reportData.reportId,
// //       reportData.customerName,
// //       reportData.overallRating,
// //       reportData.date,
// //       reportData.typeOfInspection,
// //       reportData.yearMakeModel,
// //       JSON.stringify(reportData.vehicleSummary),
// //       JSON.stringify(reportData.wheels),
// //       JSON.stringify(reportData.paintAndBody),
// //       JSON.stringify(reportData.engineTransmission),
// //       JSON.stringify(reportData.suspensionSteering),
// //       JSON.stringify(reportData.interiors),
// //       JSON.stringify(reportData.batteryAnalysis),
// //       JSON.stringify(reportData.otherSpecifications),
// //       JSON.stringify(reportData.diagnosticReport),
// //       JSON.stringify(reportData.roadTest),
// //     ];

// //     const result = await pool.query(query, values);
// //     console.log("✅ Report saved successfully to Neon, Report ID:", result.rows[0].report_id);

// //     res.json({
// //       success: true,
// //       message: 'Report saved successfully',
// //       // report: result.rows[0],
// //       report_id: result.rows[0].report_id,
// //     });
// //   } catch (error) {
// //     console.error("❌ Database / Server Error:", error);
// //     res.status(500).json({ 
// //       success: false, 
// //       error: error.message 
// //     });
// //   }
// // });
// // GET report by ID


// app.post('/api/reports', (req, res, next) => {
//   req.setTimeout(120000);

//   multipleUpload(req, res, (err) => {
//     if (err) {
//       console.error("❌ File Upload Error:", err);
//       return res.status(400).json({
//         success: false,
//         error: `File upload failed: ${err.message}`
//       });
//     }
//     next();
//   });
// }, async (req, res) => {
//   console.log("📥 Received report submission.");
//   console.log("📁 Files received:", req.files ? Object.keys(req.files) : "No files");
//   console.log("📝 Body has reportData:", !!req.body.reportData);

//   try {
//     if (!req.body.reportData) {
//       return res.status(400).json({ success: false, error: "No report data received" });
//     }

//     let reportData;
//     try {
//       reportData = JSON.parse(req.body.reportData);
//     } catch (parseErr) {
//       console.error("❌ Invalid JSON in reportData:", parseErr);
//       return res.status(400).json({ success: false, error: "Invalid report data format" });
//     }

//     const files = req.files || {};

//     console.log("Example uploaded file object:", files.vehicleImages?.[0]);

//     const getUrls = (field) => {
//       if (!files[field] || !Array.isArray(files[field])) return [];
//       return files[field]
//         .map((f) => f.path || f.secure_url || f.url || null)
//         .filter(Boolean);
//     };

//        const vehicleImages = getUrls('vehicleImages');
//     console.log("📸 Vehicle images uploaded:", vehicleImages.length);

//     // ✅ store vehicleImages inside vehicleSummary
//     reportData.vehicleSummary = reportData.vehicleSummary || {};
//     reportData.vehicleSummary.vehicleImages = vehicleImages;

//     // Wheels and Tyre Images
//     reportData.wheels = reportData.wheels || {};
//     reportData.wheels.frontLhs = reportData.wheels.frontLhs || {};
//     reportData.wheels.frontRhs = reportData.wheels.frontRhs || {};
//     reportData.wheels.rearLhs = reportData.wheels.rearLhs || {};
//     reportData.wheels.rearRhs = reportData.wheels.rearRhs || {};
    
//     reportData.wheels.frontLhs.images = getUrls('tyreImages_frontLhs');
//     reportData.wheels.frontRhs.images = getUrls('tyreImages_frontRhs');
//     reportData.wheels.rearLhs.images = getUrls('tyreImages_rearLhs');
//     reportData.wheels.rearRhs.images = getUrls('tyreImages_rearRhs');

//     console.log("🛞 Tyre images attached:", reportData.wheels.frontLhs.images.length);

//     // Store other section images
//     reportData.paintAndBody = reportData.paintAndBody || { images: [], selectedParts: [], notes: "" };
//     reportData.paintAndBody.images = getUrls('paintBodyImages');

//     reportData.engineTransmission = reportData.engineTransmission || { comments: "", images: [] };
//     reportData.engineTransmission.images = getUrls('engineImages');

//     reportData.suspensionSteering = reportData.suspensionSteering || { comments: "", images: [] };
//     reportData.suspensionSteering.images = getUrls('suspensionImages');

//     reportData.interiors = reportData.interiors || { comments: "", images: [] };
//     reportData.interiors.images = getUrls('interiorImages');

//     reportData.batteryAnalysis = reportData.batteryAnalysis || { comments: "", images: [] };
//     reportData.batteryAnalysis.images = getUrls('batteryImages');

//     reportData.otherSpecifications = reportData.otherSpecifications || { comments: "", images: [] };
//     reportData.otherSpecifications.images = getUrls('specsImages');

//     if (files.diagnosticPdf && files.diagnosticPdf[0]) {
//       reportData.diagnosticReport = reportData.diagnosticReport || {};
//       reportData.diagnosticReport.pdfFile = files.diagnosticPdf[0].secure_url || files.diagnosticPdf[0].path;
//     }

//     console.log("💾 Saving report to Neon database...");

//     const query = `
//       INSERT INTO inspection_reports (
//         report_id, customer_name, overall_rating, inspection_date,
//         inspection_type, year_make_model, vehicle_data, wheels_data,
//         paint_body_data, engine_transmission, suspension_steering,
//         interiors, battery_analysis, other_specs, diagnostic_report, road_test
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
//       ON CONFLICT (report_id) DO UPDATE SET
//         customer_name = EXCLUDED.customer_name,
//         overall_rating = EXCLUDED.overall_rating,
//         inspection_date = EXCLUDED.inspection_date,
//         inspection_type = EXCLUDED.inspection_type,
//         year_make_model = EXCLUDED.year_make_model,
//         vehicle_data = EXCLUDED.vehicle_data,
//         wheels_data = EXCLUDED.wheels_data,
//         paint_body_data = EXCLUDED.paint_body_data,
//         engine_transmission = EXCLUDED.engine_transmission,
//         suspension_steering = EXCLUDED.suspension_steering,
//         interiors = EXCLUDED.interiors,
//         battery_analysis = EXCLUDED.battery_analysis,
//         other_specs = EXCLUDED.other_specs,
//         diagnostic_report = EXCLUDED.diagnostic_report,
//         road_test = EXCLUDED.road_test,
//         created_at = CURRENT_TIMESTAMP
//       RETURNING *
//     `;

//     const values = [
//       reportData.reportId,
//       reportData.customerName,
//       reportData.overallRating,
//       reportData.date,
//       reportData.typeOfInspection,
//       reportData.yearMakeModel,
//       JSON.stringify(reportData.vehicleSummary),
//       JSON.stringify(reportData.wheels),
//       JSON.stringify(reportData.paintAndBody),
//       JSON.stringify(reportData.engineTransmission),
//       JSON.stringify(reportData.suspensionSteering),
//       JSON.stringify(reportData.interiors),
//       JSON.stringify(reportData.batteryAnalysis),
//       JSON.stringify(reportData.otherSpecifications),
//       JSON.stringify(reportData.diagnosticReport),
//       JSON.stringify(reportData.roadTest),
//     ];

//     const result = await pool.query(query, values);
//     console.log("✅ Report saved successfully to Neon, Report ID:", result.rows[0].report_id);

//     res.json({
//       success: true,
//       message: 'Report saved successfully',
//       // report: result.rows[0],
//       report_id: result.rows[0].report_id,
//     });
//   } catch (error) {
//     console.error("❌ Database / Server Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });
// app.get('/api/reports/:id', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM inspection_reports WHERE report_id = $1',
//       [req.params.id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Report not found' });
//     }
//     res.json({ success: true, report: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get all reports list
// app.get('/api/reports', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, report_id, customer_name, inspection_date, year_make_model FROM inspection_reports ORDER BY created_at DESC'
//     );
//     res.json({ success: true, reports: result.rows });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
