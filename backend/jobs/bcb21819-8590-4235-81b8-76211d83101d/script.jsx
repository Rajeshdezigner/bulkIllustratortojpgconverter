
// Job ID: bcb21819-8590-4235-81b8-76211d83101d
// Generated: 2026-05-08T09:24:54.980Z

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
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\bcb21819-8590-4235-81b8-76211d83101d\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\bcb21819-8590-4235-81b8-76211d83101d\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
