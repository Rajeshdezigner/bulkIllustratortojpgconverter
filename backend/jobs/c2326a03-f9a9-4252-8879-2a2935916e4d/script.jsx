
// Job ID: c2326a03-f9a9-4252-8879-2a2935916e4d
// Generated: 2026-05-02T07:26:17.216Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777706621434_fjve3iys5.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Step 1: Place a circle on the active artboard
var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect;
var cx = (ab[0] + ab[2]) / 2;
var cy = (ab[1] + ab[3]) / 2;
var w = 120;
var h = 120;

// Illustrator ellipse(top, left, width, height) uses top-left of bounding box
var ell = doc.pathItems.ellipse(cy + h / 2, cx - w / 2, w, h);

// Step 2: Style — solid red fill, no stroke
var red = new RGBColor();
red.red = 220; red.green = 40; red.blue = 60;
ell.fillColor = red;
ell.filled = true;
ell.stroked = false;

// Step 3: Refresh so you can visually follow along
app.redraw();
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\c2326a03-f9a9-4252-8879-2a2935916e4d\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\c2326a03-f9a9-4252-8879-2a2935916e4d\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
