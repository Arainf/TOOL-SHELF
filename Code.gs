function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var itemData;
  try {
    itemData = JSON.parse(e.postData.contents);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "message": "Invalid JSON"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // --- FAST Idempotency Check (Prevent Duplicates) ---
  if (itemData.uuid) {
    // Use TextFinder on Column 17 (Q) which is blazing fast in Google Sheets
    var finder = sheet.getRange("Q:Q").createTextFinder(itemData.uuid).matchEntireCell(true);
    if (finder.findNext()) {
      // Duplicate submission found! Return success instantly without adding a new row.
      return ContentService.createTextOutput(JSON.stringify({"result":"success", "message":"Duplicate prevented"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // --- Auto-Increment Product Number ---
  var lastRow = sheet.getLastRow();
  var newProductNumber = 1; 
  
  if (lastRow > 1) { 
    var lastProductNumberValue = sheet.getRange(lastRow, 1).getValue();
    var parsedNumber = parseInt(lastProductNumberValue, 10);
    if (!isNaN(parsedNumber)) {
      newProductNumber = parsedNumber + 1;
    } else {
      newProductNumber = lastRow; 
    }
  }

  // Append row matching the exact 17 columns (Added UUID at the end)
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
    itemData.dateToday,
    itemData.uuid // Column 17 (Q) - Hidden UUID to prevent duplicates
  ]);

  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("Inventory App Backend is running. Please use POST to submit data.");
}
