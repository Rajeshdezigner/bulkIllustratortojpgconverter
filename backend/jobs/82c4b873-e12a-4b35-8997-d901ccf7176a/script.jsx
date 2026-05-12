
// Job ID: 82c4b873-e12a-4b35-8997-d901ccf7176a
// Generated: 2026-05-08T08:59:59.734Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1778230794747_7dnvqzjkh.ai");
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
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\82c4b873-e12a-4b35-8997-d901ccf7176a\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\82c4b873-e12a-4b35-8997-d901ccf7176a\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
