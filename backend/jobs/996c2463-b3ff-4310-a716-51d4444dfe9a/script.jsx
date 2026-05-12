
// Job ID: 996c2463-b3ff-4310-a716-51d4444dfe9a
// Generated: 2026-05-02T10:33:06.333Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777717888283_ppq96ac7m.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    var doc = app.activeDocument; var artboard = doc.artboards[0]; var radius = 150; // moderate size, adjust as needed
var color = RGBColor.red;
var path = PathItem.new();
path.addCircle(artboard.bounds.left + radius, artboard.bounds.top + radius, radius);
path.fillColor = color;
doc.layers.items[0].contents = path;
app.redraw();
if (app.activeDocument.printing) {
  var printMode = app.activeDocument.printing.colorMode;
  if (printMode == 'CMYK') {
    color = CMYKColor.fromRGB(RGBColor.red);
  }
}
app.redraw();
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\996c2463-b3ff-4310-a716-51d4444dfe9a\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\996c2463-b3ff-4310-a716-51d4444dfe9a\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
