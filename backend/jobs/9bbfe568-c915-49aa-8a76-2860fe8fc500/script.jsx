
// Job ID: 9bbfe568-c915-49aa-8a76-2860fe8fc500
// Generated: 2026-05-02T06:15:17.637Z

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
    // Get the actual artboard bounds
var artboard = doc.artboards[0];
var bounds = artboard.artboardRect;
var left = bounds[0];
var top = bounds[1];
var right = bounds[2];
var bottom = bounds[3];

var width = right - left;
var height = top - bottom;

// Create RED rectangle that fills HALF the page
var rect1 = doc.pathItems.rectangle(top - 10, left + 10, width/2 - 20, height - 20);
rect1.filled = true;
rect1.stroked = false;
var redColor = new RGBColor();
redColor.red = 255;
redColor.green = 0;
redColor.blue = 0;
rect1.fillColor = redColor;

// Create BLUE rectangle that fills OTHER HALF
var rect2 = doc.pathItems.rectangle(top - 10, left + width/2 + 10, width/2 - 20, height - 20);
rect2.filled = true;
rect2.stroked = false;
var blueColor = new RGBColor();
blueColor.red = 0;
blueColor.green = 0;
blueColor.blue = 255;
rect2.fillColor = blueColor;

// Save
doc.saveAs(new File("C:\\Users\\80095\\Desktop\\proper_sized.ai"));
alert("Shapes now fill the artboard!");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\9bbfe568-c915-49aa-8a76-2860fe8fc500\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\9bbfe568-c915-49aa-8a76-2860fe8fc500\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
