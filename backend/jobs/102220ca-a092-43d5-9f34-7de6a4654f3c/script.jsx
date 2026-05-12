
// Job ID: 102220ca-a092-43d5-9f34-7de6a4654f3c
// Generated: 2026-05-02T05:56:56.393Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777701351177_8nfzf152a.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Get document information
var info = [];
info.push("Document Name: " + doc.name);
info.push("Width: " + doc.width + " " + doc.rulerUnits);
info.push("Height: " + doc.height + " " + doc.rulerUnits);
info.push("Page Items: " + doc.pageItems.length);
info.push("Layers: " + doc.layers.length);
info.push("Swatches: " + doc.swatches.length);
info.push("Color Mode: " + doc.documentColorSpace);

alert(info.join("\n"));
  }).call(this);

  // Save document
  doc.save();
  doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\102220ca-a092-43d5-9f34-7de6a4654f3c\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\102220ca-a092-43d5-9f34-7de6a4654f3c\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
