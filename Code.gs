function doPost(e) {
  // Get the active sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Parse the incoming JSON data from our web app
  var itemData;
  try {
    itemData = JSON.parse(e.postData.contents);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "message": "Invalid JSON"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Create a timestamp
  var timestamp = new Date();

  // Append the data as a new row in the sheet
  // Make sure the order matches your column headers!
  sheet.appendRow([
    timestamp,
    itemData.itemName,
    itemData.quantity,
    itemData.location,
    itemData.notes
  ]);

  // Return a success response back to the web app
  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

// A simple GET request handler just to verify the script is accessible
function doGet(e) {
  return ContentService.createTextOutput("Inventory App Backend is running. Please use POST to submit data.");
}
