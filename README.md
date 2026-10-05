# Simple Inventory App

A lightweight, mobile-friendly web application for taking inventory, backed by Google Sheets.

## Components
*   `inventory-app.html`: A responsive web interface for data entry.
*   `Code.gs`: A Google Apps Script to receive data and append it to a Google Sheet.

## Setup Instructions

1.  Create a new Google Sheet.
2.  Set the following headers in Row 1 (A to N):
    *   ProductNumber
    *   ProductSKU
    *   ProductName
    *   Dprice
    *   Wprice
    *   Price
    *   Stocks
    *   ExpDate
    *   Category
    *   Brand
    *   Size/Variant
    *   Shelf Location
    *   Reorder Level
    *   Notes
3.  Click **Extensions > Apps Script**.
4.  Copy the contents of `Code.gs` and paste it into the editor.
5.  Click **Deploy > New deployment**.
6.  Select **Web app**. Set "Execute as" to **Me** and "Who has access" to **Anyone**.
7.  Deploy and copy the Web App URL.
8.  Open `inventory-app.html` and replace `YOUR_WEB_APP_URL_HERE` on line 133 with your copied URL.
9.  Host `inventory-app.html` anywhere (GitHub Pages, Netlify, or just open it locally on your device).
