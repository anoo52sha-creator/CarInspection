import express from 'express';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } =  pg;
const app = express();

// ==============================================
// ✅ Neon PostgreSQL Pool initialized FIRST before any database code
// ❌ Delete the old commented out pool config, and delete the pool you had at the bottom of the file
// ==============================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Required for Neon connections to work properly
    rejectUnauthorized: false,
  },
});

// Middleware
//app.use(cors());
// ❌ DELETE OLD: app.use(cors());
// ✅ USE THIS:
app.use(cors({
  // Allow your live frontend + local dev frontend
  origin: ["https://car-inspection-jmi3.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}))
// Add this right after your CORS middleware, before all other API routes
app.get('/', (req, res) => {
  res.json({
    status: "✅ API Online",
    message: "Car Inspection Backend is running"
  })
})
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'car-inspections',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage });

// Multiple file upload middleware
const multipleUpload = upload.fields([
  { name: 'vehicleImages', maxCount: 10 },
  { name: 'paintBodyImages', maxCount: 10 },
  { name: 'engineImages', maxCount: 10 },
  { name: 'suspensionImages', maxCount: 10 },
  { name: 'interiorImages', maxCount: 10 },
  { name: 'batteryImages', maxCount: 10 },
  { name: 'specsImages', maxCount: 10 },
  { name: 'diagnosticPdf', maxCount: 1 },
  { name: 'tyreImages_frontLhs', maxCount: 5 },
  { name: 'tyreImages_frontRhs', maxCount: 5 },
  { name: 'tyreImages_rearLhs', maxCount: 5 },
  { name: 'tyreImages_rearRhs', maxCount: 5 },
]);

// Auto create database table on first run
const createTable = async () => {
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
};
createTable();

// Save Report Endpoint
app.post('/api/reports', multipleUpload, async (req, res) => {
  console.log("📥 Received report submission");
  console.log("📁 Files received:", req.files ? Object.keys(req.files) : "No files");
  console.log("📝 Body received:", req.body.reportData ? "Yes" : "No");

  try {
    if (!req.body.reportData) {
      return res.status(400).json({ success: false, error: "No report data received" });
    }

    const reportData = JSON.parse(req.body.reportData);
    console.log("✅ Parsed report data, reportId:", reportData.reportId);

    // Get uploaded file URLs SAFELY
    const files = req.files || {};
    const getUrls = (field) => {
      if (files[field] && Array.isArray(files[field])) {
        return files[field].map(f => f.path || f.secure_url);
      }
      return [];
    };

    const vehicleImages = getUrls('vehicleImages');
    console.log("📸 Vehicle images:", vehicleImages.length);

    // ✅ store vehicleImages inside vehicleSummary
    reportData.vehicleSummary = reportData.vehicleSummary || {};
    reportData.vehicleSummary.vehicleImages = vehicleImages;

    // Wheels and Tyre Images
    reportData.wheels = reportData.wheels || {};
    reportData.wheels.frontLhs = reportData.wheels.frontLhs || {};
    reportData.wheels.frontRhs = reportData.wheels.frontRhs || {};
    reportData.wheels.rearLhs = reportData.wheels.rearLhs || {};
    reportData.wheels.rearRhs = reportData.wheels.rearRhs || {};
    
    reportData.wheels.frontLhs.images = getUrls('tyreImages_frontLhs');
    reportData.wheels.frontRhs.images = getUrls('tyreImages_frontRhs');
    reportData.wheels.rearLhs.images = getUrls('tyreImages_rearLhs');
    reportData.wheels.rearRhs.images = getUrls('tyreImages_rearRhs');

    console.log("🛞 Tyre images attached:", reportData.wheels.frontLhs.images.length);

    // Store other section images
    reportData.paintAndBody = reportData.paintAndBody || { images: [], selectedParts: [], notes: "" };
    reportData.paintAndBody.images = getUrls('paintBodyImages');

    reportData.engineTransmission = reportData.engineTransmission || { comments: "", images: [] };
    reportData.engineTransmission.images = getUrls('engineImages');

    reportData.suspensionSteering = reportData.suspensionSteering || { comments: "", images: [] };
    reportData.suspensionSteering.images = getUrls('suspensionImages');

    reportData.interiors = reportData.interiors || { comments: "", images: [] };
    reportData.interiors.images = getUrls('interiorImages');

    reportData.batteryAnalysis = reportData.batteryAnalysis || { comments: "", images: [] };
    reportData.batteryAnalysis.images = getUrls('batteryImages');

    reportData.otherSpecifications = reportData.otherSpecifications || { comments: "", images: [] };
    reportData.otherSpecifications.images = getUrls('specsImages');

    if (files.diagnosticPdf && files.diagnosticPdf[0]) {
      reportData.diagnosticReport = reportData.diagnosticReport || {};
      reportData.diagnosticReport.pdfFile = files.diagnosticPdf[0].path;
    }

    console.log("💾 Saving to Neon database...");

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
      reportData.customerName,
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
    console.log("✅ Report saved to Neon database:", result.rows[0].report_id);

    res.json({
      success: true,
      message: 'Report saved successfully',
      report: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Report by ID
app.get('/api/reports/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM inspection_reports WHERE report_id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.json({ success: true, report: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all reports
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, report_id, customer_name, inspection_date, year_make_model FROM inspection_reports ORDER BY created_at DESC'
    );
    res.json({ success: true, reports: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Uncomment this block ONLY for local development
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

export default app;
// import express from 'express';
// import cors from 'cors';
// import pg from 'pg';
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { v2 as cloudinary } from 'cloudinary';

// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } =  pg;
// //NEW
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // PostgreSQL Pool
// // const pool = new Pool({
// //   user: process.env.DB_USER,
// //   host: process.env.DB_HOST,
// //   database: process.env.DB_NAME,
// //   password: process.env.DB_PASSWORD,
// //   port: process.env.DB_PORT,
// // });

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
//   { name: 'vehicleImages', maxCount: 10 },
//   { name: 'paintBodyImages', maxCount: 10 },
//   { name: 'engineImages', maxCount: 10 },
//   { name: 'suspensionImages', maxCount: 10 },
//   { name: 'interiorImages', maxCount: 10 },
//   { name: 'batteryImages', maxCount: 10 },
//   { name: 'specsImages', maxCount: 10 },
//   { name: 'diagnosticPdf', maxCount: 1 },
//   // Add the new tyre image fields
//   { name: 'tyreImages_frontLhs', maxCount: 5 },
//   { name: 'tyreImages_frontRhs', maxCount: 5 },
//   { name: 'tyreImages_rearLhs', maxCount: 5 },
//   { name: 'tyreImages_rearRhs', maxCount: 5 },
// ]);

// // Create Reports Table
// const createTable = async () => {
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
//   console.log('Database table ready');
// };
// createTable();

// // Save Report Endpoint
// app.post('/api/reports', multipleUpload, async (req, res) => {
//   console.log("📥 Received report submission");
//   console.log("📁 Files received:", req.files ? Object.keys(req.files) : "No files");
//   console.log("📝 Body received:", req.body.reportData ? "Yes" : "No");

//   try {
//     if (!req.body.reportData) {
//       return res.status(400).json({ success: false, error: "No report data received" });
//     }

//     const reportData = JSON.parse(req.body.reportData);
//     console.log("✅ Parsed report data, reportId:", reportData.reportId);

//     // Get uploaded file URLs SAFELY
//     const files = req.files || {};
//     const getUrls = (field) => {
//       if (files[field] && Array.isArray(files[field])) {
//         return files[field].map(f => f.path || f.secure_url);
//       }
//       return [];
//     };

//     const vehicleImages = getUrls('vehicleImages');
//     console.log("📸 Vehicle images:", vehicleImages.length);

//     // ✅ IMPORTANT FIX: store vehicleImages inside vehicleSummary so it is saved in vehicle_data JSONB
//     reportData.vehicleSummary = reportData.vehicleSummary || {};
//     reportData.vehicleSummary.vehicleImages = vehicleImages;
// // 👇=============== THIS IS THE NEW CODE BLOCK ===============👇
//     // 2. Wheels and Tyre Images
//     reportData.wheels = reportData.wheels || {};
//     reportData.wheels.frontLhs = reportData.wheels.frontLhs || {};
//     reportData.wheels.frontRhs = reportData.wheels.frontRhs || {};
//     reportData.wheels.rearLhs = reportData.wheels.rearLhs || {};
//     reportData.wheels.rearRhs = reportData.wheels.rearRhs || {};
    
//     reportData.wheels.frontLhs.images = getUrls('tyreImages_frontLhs');
//     reportData.wheels.frontRhs.images = getUrls('tyreImages_frontRhs');
//     reportData.wheels.rearLhs.images = getUrls('tyreImages_rearLhs');
//     reportData.wheels.rearRhs.images = getUrls('tyreImages_rearRhs');

//     console.log(" tyre images attached:", reportData.wheels.frontLhs.images.length);
//     // 👆=============== END OF NEW CODE BLOCK ===============👆
//     // Store other section images as you already do
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
//       reportData.diagnosticReport.pdfFile = files.diagnosticPdf[0].path;
//     }

//     console.log("💾 Saving to database...");

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
//       JSON.stringify(reportData.vehicleSummary),      // ✅ now includes vehicleImages
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
//     console.log("✅ Report saved to database:", result.rows[0].report_id);

//     res.json({
//       success: true,
//       message: 'Report saved successfully',
//       report: result.rows[0],
//     });
//   } catch (error) {
//     console.error("❌ Database error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get Report by ID
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

// // Get all reports
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

// // const PORT = process.env.PORT || 5001;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
 
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
// export default app;

