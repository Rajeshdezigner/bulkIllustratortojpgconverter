
// Job ID: e355ac33-a7c1-4c50-96bc-5d8e12a1ff74
// Generated: 2026-05-02T10:34:32.474Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1777718059300_uigvlbxgm.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Remove unused swatches
var deletedSwatches = 0;
for (var i = doc.swatches.length - 1; i >= 0; i--) {
  try {
    if (doc.swatches[i].name !== "[None]" && 
        doc.swatches[i].name !== "[Registration]") {
      doc.swatches[i].remove();
      deletedSwatches++;
    }
  } catch(e) {}
}

// Remove unused graphic styles
var deletedStyles = 0;
for (var s = doc.graphicStyles.length - 1; s >= 0; s--) {
  try {
    doc.graphicStyles[s].remove();
    deletedStyles++;
  } catch(e) {}
}

doc.save();
alert("Cleanup complete:\n" +
      "Swatches removed: " + deletedSwatches + "\n" +
      "Styles removed: " + deletedStyles);
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\e355ac33-a7c1-4c50-96bc-5d8e12a1ff74\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\e355ac33-a7c1-4c50-96bc-5d8e12a1ff74\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
