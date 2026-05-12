
// Job ID: 2d1904ef-0102-45a2-be75-e2de3cc8c303
// Generated: 2026-05-02T06:13:26.529Z

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
    // Get artboard dimensions
var artboardWidth = doc.artboards[0].artboardRect[2] - doc.artboards[0].artboardRect[0];
var artboardHeight = doc.artboards[0].artboardRect[1] - doc.artboards[0].artboardRect[3];

// Create RED RECTANGLE (fills left side)
var rect1 = doc.pathItems.rectangle(100, artboardHeight - 100, artboardWidth/2 - 50, artboardHeight - 200);
rect1.filled = true;
rect1.stroked = false;
var redColor = new RGBColor();
redColor.red = 255; redColor.green = 0; redColor.blue = 0;
rect1.fillColor = redColor;

// Create BLUE RECTANGLE (fills right side)
var rect2 = doc.pathItems.rectangle(artboardWidth/2 + 50, artboardHeight - 100, artboardWidth/2 - 50, artboardHeight - 200);
rect2.filled = true;
rect2.stroked = false;
var blueColor = new RGBColor();
blueColor.red = 0; blueColor.green = 0; blueColor.blue = 255;
rect2.fillColor = blueColor;

// Save
doc.saveAs(new File("C:\\Users\\80095\\Desktop\\half_red_half_blue.ai"));
alert("Half RED, Half BLUE created!");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\2d1904ef-0102-45a2-be75-e2de3cc8c303\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\2d1904ef-0102-45a2-be75-e2de3cc8c303\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
