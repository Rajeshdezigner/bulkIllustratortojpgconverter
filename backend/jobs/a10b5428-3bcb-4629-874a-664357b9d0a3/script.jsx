
// Job ID: a10b5428-3bcb-4629-874a-664357b9d0a3
// Generated: 2026-05-02T06:10:56.398Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777702255125_3cdmwc1m4.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Create a LARGE red rectangle
var newRect = doc.pathItems.rectangle(500, 600, 800, 400);
newRect.filled = true;
newRect.stroked = true;
newRect.strokeWidth = 3;

var color = new RGBColor();
color.red = 255;
color.green = 0;
color.blue = 0;
newRect.fillColor = color;

// Save to Desktop
doc.saveAs(new File("C:\\Users\\80095\\Desktop\\modified_logo.ai"));

alert("Large red rectangle created!");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\a10b5428-3bcb-4629-874a-664357b9d0a3\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\a10b5428-3bcb-4629-874a-664357b9d0a3\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
