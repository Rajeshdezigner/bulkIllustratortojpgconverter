
// Job ID: 4c6987a4-205d-4b73-90c7-89aef6d5b7a7
// Generated: 2026-05-08T08:58:55.739Z

try {
  // Open document
  var sourceFile = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\uploads\\1778230657440_deh3hauhr.ai");
  if (!sourceFile.exists) {
    throw new Error("File not found: " + sourceFile.toString());
  }

  var doc = app.open(sourceFile);
  if (!doc) {
    throw new Error("Could not open document");
  }

  // Execute user script
  (function() {
    // Export print-ready PDF
var pdfFile = new File("C:\\Users\\80095\\Desktop\\Print_Ready.pdf");
var opts = new PDFSaveOptions();

opts.compatibility = PDFCompatibility.ACROBAT7;
opts.colorCompression = CompressionQuality.MAXIMUM;
opts.enablePlaidWrapping = false;

doc.saveAs(pdfFile, opts);

alert("Print-ready PDF exported");
  }).call(this);

  // Save document
// Save document
doc.save();
// Keep file open to see changes - don't close it
// doc.close();

  // Write success log
  var log = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\4c6987a4-205d-4b73-90c7-89aef6d5b7a7\\execution.log");
  log.open("w");
  log.write("SUCCESS: Script executed successfully at " + new Date().toString());
  log.close();

} catch(error) {
  // Write error log
  var errorLog = new File("C:\\Users\\80095\\Pictures\\illustrator-full\\backend\\jobs\\4c6987a4-205d-4b73-90c7-89aef6d5b7a7\\execution.log");
  errorLog.open("w");
  errorLog.write("ERROR: " + error.toString() + "\n" + error.stack);
  errorLog.close();
  alert("Error: " + error.toString());
}
