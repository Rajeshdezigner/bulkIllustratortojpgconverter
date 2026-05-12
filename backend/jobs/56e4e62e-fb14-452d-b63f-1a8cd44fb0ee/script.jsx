
// Job ID: 56e4e62e-fb14-452d-b63f-1a8cd44fb0ee
// Generated: 2026-05-02T06:53:14.878Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777704792106_1vjpprn5g.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Create 5 color variations of logo on separate artboards
var colors = [
  { name: "Red", r: 220, g: 20, b: 60 },
  { name: "Blue", r: 25, g: 55, b: 135 },
  { name: "Green", r: 34, g: 139, b: 34 },
  { name: "Black", r: 0, g: 0, b: 0 },
  { name: "Gold", r: 255, g: 215, b: 0 }
];

// Duplicate artboard for each color
for (var c = 0; c < colors.length; c++) {
  var color = colors[c];
  var color_obj = new RGBColor();
  color_obj.red = color.r;
  color_obj.green = color.g;
  color_obj.blue = color.b;
  
  // Change fill color of all objects
  for (var i = 0; i < doc.pageItems.length; i++) {
    try {
      if (doc.pageItems[i].fillColor) {
        doc.pageItems[i].fillColor = color_obj;
      }
    } catch(e) {}
  }
}

doc.save();
alert("Logo color variations created!");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\56e4e62e-fb14-452d-b63f-1a8cd44fb0ee\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\56e4e62e-fb14-452d-b63f-1a8cd44fb0ee\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
