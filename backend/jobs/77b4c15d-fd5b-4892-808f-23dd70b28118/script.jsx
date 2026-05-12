
// Job ID: 77b4c15d-fd5b-4892-808f-23dd70b28118
// Generated: 2026-05-08T09:02:45.073Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1778230944982_zzwfyzilb.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Convert all colors to pure black
var blackColor = new RGBColor();
blackColor.red = 0;
blackColor.green = 0;
blackColor.blue = 0;

for (var i = 0; i < doc.pageItems.length; i++) {
  try {
    doc.pageItems[i].fillColor = blackColor;
    doc.pageItems[i].strokeColor = blackColor;
  } catch(e) {}
}

doc.save();
alert("Logo converted to monochrome (black & white)");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\77b4c15d-fd5b-4892-808f-23dd70b28118\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\77b4c15d-fd5b-4892-808f-23dd70b28118\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
