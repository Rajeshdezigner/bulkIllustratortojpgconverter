
// Job ID: 9bf7e5a8-7759-471c-bc7f-0b46de04e304
// Generated: 2026-05-02T07:46:45.788Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777708003845_pu8dvd1e0.ai");
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
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\9bf7e5a8-7759-471c-bc7f-0b46de04e304\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\9bf7e5a8-7759-471c-bc7f-0b46de04e304\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
