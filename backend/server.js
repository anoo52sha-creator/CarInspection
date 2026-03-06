import express from 'express';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;
const app = express();

// ==============================================
// ✅ Neon PostgreSQL Pool
// ==============================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Neon
  },
});

// ==============================================
// ✅ MIDDLEWARE
// ==============================================

// 1️⃣ CORS — SINGLE configuration (NO duplicates!)
app.use(cors({
  origin: "*",                     // ⚠️ In PRODUCTION replace "*" with your frontend URL(s)
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204
}));

// 2️⃣ Increase body size limits (CRUCIAL for image uploads!)
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: "✅ API Online",
    message: "Car Inspection Backend is running"
  });
});

// ==============================================
// ✅ CLOUDINARY SETUP
// ==============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'car-inspections',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage });

// Multiple file upload middleware
const multipleUpload = upload.fields([
  { name: 'vehicleImages', maxCount: 20 },
  { name: 'paintBodyImages', maxCount: 20 },
  { name: 'engineImages', maxCount: 20 },
  { name: 'suspensionImages', maxCount: 20 },
  { name: 'interiorImages', maxCount: 20 },
  { name: 'batteryImages', maxCount: 20 },
  { name: 'specsImages', maxCount: 20 },
  { name: 'diagnosticPdf', maxCount: 1 },       // ONLY ONE PDF!
  { name: 'tyreImages_frontLhs', maxCount: 20 },
  { name: 'tyreImages_frontRhs', maxCount: 20 },
  { name: 'tyreImages_rearLhs', maxCount: 20 },
  { name: 'tyreImages_rearRhs', maxCount: 20 },
]);

// ==============================================
// ✅ CREATE TABLE (runs on first start)
// ==============================================
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
    console.log('✅ Neon Database table ready');
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
};
createTable();

// ==============================================
// ✅ SAVE REPORT ENDPOINT
// ==============================================
app.post(
  '/api/reports',
  // 1️⃣ Multer middleware (handles file uploads)
  (req, res, next) => {
    multipleUpload(req, res, (err) => {
      if (err) {
        console.error("❌ Multer Error:", err);
        return res.status(400).json({
          success: false,
          error: `File upload failed: ${err.message}`
        });
      }
      next();
    });
  },
  // 2️⃣ Main handler
  async (req, res) => {
    console.log("📥 Received report submission");
    console.log("📁 Files:", req.files ? Object.keys(req.files) : "No files");
    console.log("📝 reportData present:", !!req.body.reportData);

    try {
      // ------------------------------
      // Validate incoming data
      // ------------------------------
      if (!req.body.reportData) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing reportData" 
        });
      }

      let reportData;
      try {
        reportData = JSON.parse(req.body.reportData);
      } catch (e) {
        console.error("❌ JSON Parse Error:", e);
        return res.status(400).json({ 
          success: false, 
          error: "Invalid JSON in reportData" 
        });
      }

      console.log(`✅ Parsed data. ReportID: ${reportData.reportId}`);

      // ------------------------------
      // Helper: Get Cloudinary URLs
      // ------------------------------
      const getUrls = (fieldName) => {
        const files = req.files?.[fieldName];
        if (Array.isArray(files)) {
          return files.map(f => f.secure_url);
        }
        return [];
      };

      // ------------------------------
      // ATTACH IMAGE URLS TO reportData
      // ------------------------------

      // Vehicle Images
      reportData.vehicleSummary = reportData.vehicleSummary || {};
      reportData.vehicleSummary.vehicleImages = getUrls('vehicleImages');
      console.log(`📸 Vehicle images: ${reportData.vehicleSummary.vehicleImages.length}`);

      // Tyre Images
      reportData.wheels = reportData.wheels || {};
      const tyreFields = ['frontLhs', 'frontRhs', 'rearLhs', 'rearRhs'];
      tyreFields.forEach(pos => {
        const field = `tyreImages_${pos}`;
        reportData.wheels[pos] = reportData.wheels[pos] || {};
        reportData.wheels[pos].images = getUrls(field);
      });
      console.log(`🛞 Tyre images (frontLhs): ${reportData.wheels.frontLhs.images.length}`);

      // Other sections
      reportData.paintAndBody = reportData.paintAndBody || { images: [] };
      reportData.paintAndBody.images = getUrls('paintBodyImages');

      reportData.engineTransmission = reportData.engineTransmission || { images: [] };
      reportData.engineTransmission.images = getUrls('engineImages');

      reportData.suspensionSteering = reportData.suspensionSteering || { images: [] };
      reportData.suspensionSteering.images = getUrls('suspensionImages');

      reportData.interiors = reportData.interiors || { images: [] };
      reportData.interiors.images = getUrls('interiorImages');

      reportData.batteryAnalysis = reportData.batteryAnalysis || { images: [] };
      reportData.batteryAnalysis.images = getUrls('batteryImages');

      reportData.otherSpecifications = reportData.otherSpecifications || { images: [] };
      reportData.otherSpecifications.images = getUrls('specsImages');

      // Diagnostic PDF (single file!)
      if (req.files.diagnosticPdf?.[0]) {
        reportData.diagnosticReport = reportData.diagnosticReport || {};
        reportData.diagnosticReport.pdfFile = req.files.diagnosticPdf[0].secure_url;
      }

      // ------------------------------
      // SAVE TO NEON DATABASE
      // ------------------------------
      console.log("💾 Saving to Neon DB...");
      const query = `
        INSERT INTO inspection_reports (
          report_id, customer_name, overall_rating, inspection_date,
          inspection_type, year_make_model, vehicle_data, wheels_data,
          paint_body_data, engine_transmission, suspension_steering,
          interiors, battery_analysis, other_specs, diagnostic_report, road_test
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        ON CONFLICT (report_id) DO UPDATE SET
          customer_name         = EXCLUDED.customer_name,
          overall_rating        = EXCLUDED.overall_rating,
          inspection_date       = EXCLUDED.inspection_date,
          inspection_type       = EXCLUDED.inspection_type,
          year_make_model       = EXCLUDED.year_make_model,
          vehicle_data          = EXCLUDED.vehicle_data,
          wheels_data           = EXCLUDED.wheels_data,
          paint_body_data       = EXCLUDED.paint_body_data,
          engine_transmission   = EXCLUDED.engine_transmission,
          suspension_steering   = EXCLUDED.suspension_steering,
          interiors             = EXCLUDED.interiors,
          battery_analysis      = EXCLUDED.battery_analysis,
          other_specs           = EXCLUDED.other_specs,
          diagnostic_report     = EXCLUDED.diagnostic_report,
          road_test             = EXCLUDED.road_test,
          created_at            = CURRENT_TIMESTAMP
        RETURNING id, report_id
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
      console.log(`✅ Report saved! ID: ${result.rows[0].report_id}`);

      // =================================================================
      // ⚡ LIGHTWEIGHT RESPONSE (PREVENTS TIMEOUT!)
      // =================================================================
      res.json({
        success: true,
        message: "Report saved successfully",
        reportId: reportData.reportId
      });

    } catch (error) {
      console.error("❌ SERVER ERROR:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// ==============================================
// ✅ GET REPORT BY ID
// ==============================================
app.get('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM inspection_reports WHERE report_id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, report: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================
// ✅ GET ALL REPORTS (LIST)
// ==============================================
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, report_id, customer_name, inspection_date, year_make_model 
       FROM inspection_reports 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, reports: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================
// ✅ START SERVER
// ==============================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
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
//   allowedHeaders: ["Content-Type"],
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
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'car-inspections',
//     allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
//     resource_type: 'auto',
//   },
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

// app.post('/api/reports', (req, res, next) => {
//   // ✅ Catch upload errors first, no more generic Network Errors
//   multipleUpload(req, res, (err) => {
//     if (err) {
//       console.error("❌ File Upload Error:", err);
//       return res.status(400).json({ 
//         success: false, 
//         error: `File upload failed: ${err.message}` 
//       });
//     }
//     next();
//   })
// }, async (req, res) => {
//   console.log("📥 Received report submission.");
//   console.log("📁 Files received:", req.files ? Object.keys(req.files) : "No files");
//   console.log("📝 Body has reportData:", !!req.body.reportData);

//   try {
//     if (!req.body.reportData) {
//       return res.status(400).json({ success: false, error: "No report data received" });
//     }

//     // Catch invalid JSON errors in submitted report data
//     let reportData;
//     try {
//       reportData = JSON.parse(req.body.reportData);
//     } catch (parseErr) {
//       console.error("❌ Invalid JSON in reportData:", parseErr)
//       return res.status(400).json({ success: false, error: "Invalid report data format" })
//     }
    
//     console.log("✅ Parsed report data, reportId:", reportData.reportId);

//     // Get uploaded file URLs, always use HTTPS secure urls from Cloudinary
//     const files = req.files || {};
//     const getUrls = (field) => {
//       if (files[field] && Array.isArray(files[field])) {
//         return files[field].map(f => f.secure_url || f.path);
//       }
//       return [];
//     };

//     const vehicleImages = getUrls('vehicleImages');
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
//       report: result.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Database / Server Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });
// // GET report by ID
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
