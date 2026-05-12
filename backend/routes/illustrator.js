const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.ai', '.eps', '.pdf', '.svg', '.psd'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed. Allowed: ${allowed.join(', ')}`));
    }
  }
});

// ================================================================
// POST /api/illustrator/upload
// Upload an Illustrator file
// ================================================================
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    success: true,
    fileName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size,
    uploadedAt: new Date().toISOString()
  });
});

// ================================================================
// POST /api/illustrator/execute
// Execute JSX script on an Illustrator file
// ================================================================
router.post('/execute', async (req, res) => {
  const { filePath, jsxCode, outputPath } = req.body;

  if (!filePath || !jsxCode) {
    return res.status(400).json({
      error: 'filePath and jsxCode are required'
    });
  }

  const jobId = uuidv4();
  const jobDir = path.join(__dirname, '../jobs', jobId);
  const scriptFile = path.join(jobDir, 'script.jsx');
  const logFile = path.join(jobDir, 'execution.log');

  try {
    // Create job directory
    fs.mkdirSync(jobDir, { recursive: true });

    // Prepare the script with file path escape
    const escapedFilePath = filePath.replace(/\\/g, '\\\\');
    const fullScript = `
// Job ID: ${jobId}
// Generated: ${new Date().toISOString()}

try {
  // Open document
  var sourceFile = new File("${escapedFilePath}");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    ${jsxCode}
  }).call(this);

  // Save document
// Save document
${outputPath ? `doc.saveAs(new File("${outputPath.replace(/\\/g, '\\\\')}"));` : 'doc.save();'}
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("${logFile.replace(/\\/g, '\\\\')}");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("${logFile.replace(/\\/g, '\\\\')}");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
`;

    // Write script to file
    fs.writeFileSync(scriptFile, fullScript, 'utf8');

    // Execute in Illustrator
    const illustratorExe = process.env.ILLUSTRATOR_PATH ||
      'C:\\Program Files\\Adobe\\Adobe Illustrator 2024\\Support Files\\Contents\\Windows\\Illustrator.exe';

    const cmd = `"${illustratorExe}" -r "${scriptFile}"`;

    console.log(`[${jobId}] Executing Illustrator script...`);

    exec(cmd, { timeout: 300000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      // Check if log file exists
      let logs = '';
      if (fs.existsSync(logFile)) {
        logs = fs.readFileSync(logFile, 'utf8');
      }

      if (error) {
        console.error(`[${jobId}] Error:`, error);
        return res.status(500).json({
          success: false,
          jobId,
          error: 'Failed to execute script in Illustrator',
          details: error.message,
          logs,
          code: jsxCode
        });
      }

      res.json({
        success: true,
        jobId,
        message: 'Script executed successfully',
        logs,
        code: jsxCode,
        outputPath
      });
    });

  } catch (err) {
    console.error(`[${jobId}] Setup error:`, err);
    res.status(500).json({
      error: err.message,
      jobId
    });
  }
});

// ================================================================
// POST /api/illustrator/preview
// Preview the JSX code without executing
// ================================================================
router.post('/preview', (req, res) => {
  const { jsxCode } = req.body;

  if (!jsxCode) {
    return res.status(400).json({ error: 'jsxCode is required' });
  }

  res.json({
    success: true,
    preview: jsxCode,
    message: 'Script preview ready to execute'
  });
});

// ================================================================
// GET /api/illustrator/jobs/:jobId
// Get job status and details
// ================================================================
router.get('/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const jobDir = path.join(__dirname, '../jobs', jobId);
  const logFile = path.join(jobDir, 'execution.log');

  if (!fs.existsSync(jobDir)) {
    return res.status(404).json({ error: 'Job not found' });
  }

  try {
    const logs = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
    const status = logs.includes('SUCCESS') ? 'completed' : logs.includes('ERROR') ? 'failed' : 'running';

    res.json({
      jobId,
      status,
      logs,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================================================
// GET /api/illustrator/jobs
// List all jobs
// ================================================================
router.get('/jobs', (req, res) => {
  const jobsDir = path.join(__dirname, '../jobs');

  try {
    if (!fs.existsSync(jobsDir)) {
      return res.json({ jobs: [] });
    }

    const jobs = fs.readdirSync(jobsDir)
      .sort()
      .reverse()
      .slice(0, 50)
      .map(jobId => {
        const logFile = path.join(jobsDir, jobId, 'execution.log');
        let logs = '';
        let status = 'running';

        if (fs.existsSync(logFile)) {
          logs = fs.readFileSync(logFile, 'utf8');
          status = logs.includes('SUCCESS') ? 'completed' : 'failed';
        }

        return {
          jobId,
          status,
          hasLogs: !!logs,
          timestamp: fs.statSync(path.join(jobsDir, jobId)).birthtime
        };
      });

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
