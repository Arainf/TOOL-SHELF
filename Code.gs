function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var itemData;
  try {
    itemData = JSON.parse(e.postData.contents);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "message": "Invalid JSON"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // --- Auto-Increment Product Number ---
  var lastRow = sheet.getLastRow();
  var newProductNumber = 1; 
  
  if (lastRow > 1) { 
    // Look at the last row, 1st column (ProductNumber)
    var lastProductNumberValue = sheet.getRange(lastRow, 1).getValue();
    var parsedNumber = parseInt(lastProductNumberValue, 10);
    if (!isNaN(parsedNumber)) {
      newProductNumber = parsedNumber + 1;
    } else {
      // Fallback if the previous row was deleted or text was typed manually
      newProductNumber = lastRow; 
    }
  }

  // Append row matching the exact 16 columns
  sheet.appendRow([
    newProductNumber, // Auto-incremented from backend
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
    itemData.notes,
    itemData.batchNumber,
    itemData.dateToday
  ]);

  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("Inventory App Backend is running. Please use POST to submit data.");
}
