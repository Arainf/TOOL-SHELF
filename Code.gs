function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var itemData;
  try {
    itemData = JSON.parse(e.postData.contents);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "message": "Invalid JSON"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Append row matching the exact 14 columns you requested
  sheet.appendRow([
    itemData.productNumber,
    itemData.productSKU,
    itemData.productName,
    itemData.dprice,
    itemData.wprice,
    itemData.price,
    itemData.stocks,
    itemData.expDate,
    itemData.category,
    itemData.brand,
    itemData.sizeVariant,
    itemData.shelfLocation,
    itemData.reorderLevel,
    itemData.notes
  ]);

  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("Inventory App Backend is running. Please use POST to submit data.");
}
