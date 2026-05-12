
// Job ID: 0d52af5e-4c7a-47af-afe4-ea445bf1e648
// Generated: 2026-05-02T06:09:36.778Z

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
    // Create a red rectangle so you can see the changes
var newRect = doc.pathItems.rectangle(200, 100, 300, 200);
newRect.filled = true;
newRect.stroked = false;

var color = new RGBColor();
color.red = 255;
color.green = 0;
color.blue = 0;
newRect.fillColor = color;

// Save to Desktop
doc.saveAs(new File("C:\\Users\\80095\\Desktop\\modified_logo.ai"));

alert("Red rectangle created and saved!");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\0d52af5e-4c7a-47af-afe4-ea445bf1e648\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\0d52af5e-4c7a-47af-afe4-ea445bf1e648\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
