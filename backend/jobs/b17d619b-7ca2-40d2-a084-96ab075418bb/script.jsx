
// Job ID: b17d619b-7ca2-40d2-a084-96ab075418bb
// Generated: 2026-05-02T06:12:37.817Z

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
    // Create multiple colorful shapes that are visible

// Red Circle
var circle = doc.pathItems.ellipse(100, 700, 150, 150);
circle.filled = true;
circle.stroked = false;
var redColor = new RGBColor();
redColor.red = 255; redColor.green = 0; redColor.blue = 0;
circle.fillColor = redColor;

// Blue Square
var square = doc.pathItems.rectangle(300, 700, 150, 150);
square.filled = true;
square.stroked = false;
var blueColor = new RGBColor();
blueColor.red = 0; blueColor.green = 0; blueColor.blue = 255;
square.fillColor = blueColor;

// Yellow Triangle (approximate)
var triangle = doc.pathItems.polygon(500, 700, 3, 75);
triangle.filled = true;
triangle.stroked = false;
var yellowColor = new RGBColor();
yellowColor.red = 255; yellowColor.green = 255; yellowColor.blue = 0;
triangle.fillColor = yellowColor;

// Save
doc.saveAs(new File("C:\\Users\\80095\\Desktop\\colorful_shapes.ai"));
alert("Colorful shapes created!");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\b17d619b-7ca2-40d2-a084-96ab075418bb\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\b17d619b-7ca2-40d2-a084-96ab075418bb\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
