
// Job ID: c89ea027-ffec-4de7-817c-65de9a6dbc7c
// Generated: 2026-05-02T06:07:01.325Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777702016526_icp8qr0n0.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Change fill color to red (adjust RGB values as needed)
var color = new RGBColor();
color.red = 255;
color.green = 0;
color.blue = 0;

for (var i = 0; i < doc.pageItems.length; i++) {
  try {
    doc.pageItems[i].fillColor = color;
  } catch (e) {}
}

alert("Fill color changed on " + doc.pageItems.length + " objects");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\c89ea027-ffec-4de7-817c-65de9a6dbc7c\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\c89ea027-ffec-4de7-817c-65de9a6dbc7c\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
