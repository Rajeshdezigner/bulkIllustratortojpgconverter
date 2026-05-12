
// Job ID: 933a02c0-3c11-4aed-8674-15c0f9297472
// Generated: 2026-05-08T08:57:49.275Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1778230657440_deh3hauhr.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Add stroke to all text objects
var strokeColor = new RGBColor();
strokeColor.red = 0;
strokeColor.green = 0;
strokeColor.blue = 0;

for (var i = 0; i < doc.textFrames.length; i++) {
  try {
    var textObj = doc.textFrames[i];
    textObj.strokeColor = strokeColor;
    textObj.strokeWidth = 2;
  } catch(e) {}
}

doc.save();
alert("Text outlines added");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\933a02c0-3c11-4aed-8674-15c0f9297472\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\933a02c0-3c11-4aed-8674-15c0f9297472\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
