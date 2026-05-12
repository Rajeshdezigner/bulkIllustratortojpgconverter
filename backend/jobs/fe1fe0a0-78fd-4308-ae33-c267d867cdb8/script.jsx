
// Job ID: fe1fe0a0-78fd-4308-ae33-c267d867cdb8
// Generated: 2026-05-02T06:02:32.103Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777701730606_a9hcibuaa.ai");
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
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\fe1fe0a0-78fd-4308-ae33-c267d867cdb8\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\fe1fe0a0-78fd-4308-ae33-c267d867cdb8\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
