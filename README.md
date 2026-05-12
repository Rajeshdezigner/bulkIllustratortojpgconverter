# 🎨 Illustrator Automation Studio v2.0

**Complete, production-ready application to automate ANY Adobe Illustrator task using JSX scripts.**

Write or load pre-built JSX scripts and execute them instantly on your Illustrator files — no limits, full Illustrator API access.

---

## ✨ Features

✅ **Execute ANY Illustrator JSX script** — Full access to ExtendScript API
✅ **Pre-built Templates** — 15+ ready-to-use scripts for common tasks
✅ **File Upload** — Support for .ai, .eps, .pdf, .svg files
✅ **Script Editor** — Write and test code directly
✅ **Job History** — Track all executed scripts
✅ **Real-time Feedback** — Execution logs and error messages
✅ **No Ollama/AI required** — Pure JSX execution, instant response

---

## 📋 System Requirements

- **Windows 10/11** (ExtendScript requires Windows)
- **Node.js v14+** (https://nodejs.org)
- **Adobe Illustrator 2020+** (Licensed & installed)
- **RAM**: 4GB minimum
- **Disk Space**: 500MB

---

## 🚀 Quick Start (3 Steps)

### Step 1: Extract & Navigate
```bash
# Extract zip to: C:\Projects\illustrator-full
# Then:
cd C:\Projects\illustrator-full
```

### Step 2: Install Everything
```bash
# Install backend
cd backend
npm install

# Install frontend (in another terminal)
cd ../frontend
npm install
```

### Step 3: Configure & Run
Edit `backend/.env` — Update ILLUSTRATOR_PATH:
```
ILLUSTRATOR_PATH=C:\Program Files\Adobe\Adobe Illustrator 2024\Support Files\Contents\Windows\Illustrator.exe
```

Then run both in separate terminals:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

**Done!** App opens at http://localhost:3000

---

## 📖 Complete Installation Guide

### Part 1: Install Node.js

1. Go to https://nodejs.org
2. Download **LTS version** (green button)
3. Run installer → Next → Next → Finish
4. Verify: Open Command Prompt → type `node --version` → should show `v18.x.x` or higher

### Part 2: Extract Project

1. Download the zip file
2. Extract to folder: `C:\Projects\illustrator-full`
3. Open Command Prompt
4. Navigate: `cd C:\Projects\illustrator-full`

### Part 3: Find Illustrator Path

1. Right-click Adobe Illustrator shortcut on desktop
2. Click **Properties**
3. Copy the **Target** field completely
4. Example: `C:\Program Files\Adobe\Adobe Illustrator 2024\Support Files\Contents\Windows\Illustrator.exe`

### Part 4: Setup Backend

**Open Command Prompt:**
```bash
cd C:\Projects\illustrator-full\backend
```

**Edit `.env` file** (open with Notepad):
```
PORT=5000
NODE_ENV=development
ILLUSTRATOR_PATH=YOUR_COPIED_PATH_HERE
```

**Save and install:**
```bash
npm install
```

### Part 5: Setup Frontend

**Open NEW Command Prompt:**
```bash
cd C:\Projects\illustrator-full\frontend
npm install
```

### Part 6: Run Application

**Terminal 1 (Backend):**
```bash
cd C:\Projects\illustrator-full\backend
npm run dev
```

**You should see:**
```
╔════════════════════════════════════════════════════════════╗
║   🎨 Illustrator Automation Backend v2.0.0                 ║
║   Running on: http://localhost:5000                        ║
║   Environment: development                                 ║
╚════════════════════════════════════════════════════════════╝
```

**Terminal 2 (Frontend):**
```bash
cd C:\Projects\illustrator-full\frontend
npm start
```

Browser automatically opens → http://localhost:3000

---

## 🎯 How to Use

### 1. Upload Your File
- Click upload box or drag & drop
- Supports: .ai, .eps, .pdf, .svg

### 2. Choose Your Script
**Option A — Use a Template:**
- Click one of 15+ pre-built templates
- Code loads automatically

**Option B — Write Your Own:**
- Edit the code editor
- Write any valid JSX code

### 3. Execute
- Click **"▶ Execute in Illustrator"**
- Illustrator opens automatically
- Script runs
- Results appear below

---

## 📚 Pre-Built Templates Included

### Colors & Effects
- ✅ Change Fill Color
- ✅ Change Stroke Color
- ✅ Remove Stroke
- ✅ Make Black & White (Grayscale)
- ✅ Set Opacity
- ✅ Remove Unused Swatches

### Transform & Scale
- ✅ Scale Objects (50%, 150%, etc.)
- ✅ Move Objects to Center

### Layers
- ✅ List All Layers
- ✅ Toggle Layer Visibility
- ✅ Lock All Layers
- ✅ Unlock All Layers
- ✅ Delete Empty Layers

### Text & Selection
- ✅ Convert Text to Outline
- ✅ Select All Objects
- ✅ Deselect All Objects

### Advanced
- ✅ Release Clipping Masks
- ✅ Flatten Transparency
- ✅ Get Document Info
- ✅ Ungroup All Objects

---

## 💻 ExtendScript (JSX) Examples

### Example 1: Change All Colors to Red
```javascript
var color = new RGBColor();
color.red = 255;
color.green = 0;
color.blue = 0;

for (var i = 0; i < doc.pageItems.length; i++) {
  try {
    doc.pageItems[i].fillColor = color;
  } catch (e) {}
}

alert("Color changed!");
```

### Example 2: Show All Layer Names
```javascript
var names = [];
for (var i = 0; i < doc.layers.length; i++) {
  names.push(doc.layers[i].name);
}
alert("Layers: " + names.join(", "));
```

### Example 3: Scale All Objects to 80%
```javascript
for (var i = 0; i < doc.pageItems.length; i++) {
  doc.pageItems[i].resize(80, 80);
}
```

### Example 4: Change Stroke Width
```javascript
for (var i = 0; i < doc.pageItems.length; i++) {
  try {
    doc.pageItems[i].strokeWidth = 2;
  } catch (e) {}
}
```

### Example 5: Hide Specific Layer
```javascript
var layerName = "Background";
for (var i = 0; i < doc.layers.length; i++) {
  if (doc.layers[i].name === layerName) {
    doc.layers[i].visible = false;
    break;
  }
}
```

---

## 🔧 API Reference

### Execute Script
```
POST /api/illustrator/execute
Body: {
  "filePath": "C:\\path\\to\\file.ai",
  "jsxCode": "var doc = app.activeDocument; ..."
}
```

### Upload File
```
POST /api/illustrator/upload
Form Data: file (multipart)
```

### Get Job History
```
GET /api/illustrator/jobs
Returns: Array of all executed jobs
```

### Get Template
```
GET /api/templates/:id
Returns: Template with code
```

---

## ⚠️ Important Notes

1. **Always backup your files!** Scripts modify documents permanently.

2. **Illustrator must be CLOSED** before executing scripts. The app opens it automatically.

3. **Script Editor Tips:**
   - Use `doc.pageItems` to access all objects
   - Use `doc.layers` to access layers
   - Use `RGBColor()` for colors
   - Use `alert()` to show messages
   - Wrap risky code in try/catch

4. **Error Handling:**
   - Check job history for execution logs
   - Each job gets a unique ID for tracking
   - Logs show what went wrong

5. **Illustrator Path:**
   - Different versions have different paths
   - Adjust based on your installation
   - Ask in forums if path is different

---

## 🐛 Troubleshooting

### "Backend Offline" (Red dot)
- Check backend terminal is running with `npm run dev`
- Verify port 5000 is not blocked
- Check ILLUSTRATOR_PATH in .env

### "Failed to execute script"
- Verify ILLUSTRATOR_PATH is correct
- Ensure Illustrator is completely closed
- Check if Adobe Illustrator is installed

### "Script runs but nothing changes"
- Add alert() to debug:
  ```javascript
  alert("Starting script...");
  // your code
  alert("Done!");
  ```
- Check if objects exist: `alert(doc.pageItems.length);`

### "Cannot write to file"
- Make sure you have write permissions
- File is not open in another app
- Path has no special characters

---

## 📞 Support Resources

**Adobe ExtendScript Documentation:**
- https://github.com/Adobe-CEP/CEP-Resources
- https://extendscript.docsforadobe.dev/

**Illustrator DOM:**
- In Illustrator: Help → Scripting → JavaScript Tools Guide

**Common Patterns:**
- Loop through objects: `for (var i = 0; i < doc.pageItems.length; i++)`
- Loop through layers: `for (var i = 0; i < doc.layers.length; i++)`
- Change color: Create RGBColor(), set .red, .green, .blue (0-255)
- Save: `doc.save();` → Close: `doc.close();`

---

## 📦 Project Structure

```
illustrator-full/
├── backend/
│   ├── server.js               ← Express server
│   ├── routes/
│   │   ├── illustrator.js      ← Script execution API
│   │   └── templates.js        ← Template library
│   ├── uploads/                ← Uploaded files
│   ├── jobs/                   ← Job logs & scripts
│   ├── .env                    ← Configuration
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.js              ← Main React component
    │   ├── App.css             ← Styling
    │   └── index.js            ← Entry point
    ├── public/
    │   └── index.html
    └── package.json
```

---

## 🚀 Advanced Usage

### Custom Templates
Edit `backend/routes/templates.js` and add your own template:

```javascript
'my-custom-script': {
  name: 'My Custom Script',
  description: 'What this does',
  category: 'Custom',
  code: `// Your JSX code here`
}
```

### Batch Processing
Create a loop in your JSX to process multiple items:

```javascript
for (var i = 0; i < 100; i++) {
  var item = doc.pageItems[i];
  // Process each item
}
```

### Save to Specific Path
Instead of doc.save(), use:

```javascript
var outputPath = new File("C:\\Users\\Rajesh\\Desktop\\output.ai");
doc.saveAs(outputPath);
```

---

## 📝 License

This application is provided as-is for use with Adobe Illustrator.

---

**Built with ❤️ for Rajesh — Complete Illustrator Automation Solution**

v2.0.0 | Last Updated: 2024
