
// Job ID: 8f9a1184-b942-437f-a95f-b5520d84b1d6
// Generated: 2026-05-02T05:58:58.317Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777701534410_cdac3gm71.ai");
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
  doc.save();
  doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\8f9a1184-b942-437f-a95f-b5520d84b1d6\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\8f9a1184-b942-437f-a95f-b5520d84b1d6\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
