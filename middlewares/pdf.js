const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const columnWidths = [200, 100, 150, 150, 100];
const rowHeight = 30;

function resolveReportsDir() {
  try {
    const { app } = require("electron");
    if (app) {
      const dir = path.join(app.getPath("userData"), "reports");
      fs.mkdirSync(dir, { recursive: true });
      return dir;
    }
  } catch (err) {
    // not running inside Electron
  }
  const dir = path.join(__dirname, "..", "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function cleanupOldReports(dir) {
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  try {
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith("-orders.pdf")) continue;
      const filePath = path.join(dir, file);
      const { mtimeMs } = fs.statSync(filePath);
      if (now - mtimeMs > maxAgeMs) fs.unlinkSync(filePath);
    }
  } catch (err) {
    // best-effort cleanup only
  }
}

function drawTableRow(doc, y, row, isHeader = false) {
  let x = 50; // Starting x position

  // Draw background for headers or alternate row colors
  if (isHeader) {
    doc
      .fillColor("#333333")
      .rect(
        x,
        y,
        columnWidths.reduce((a, b) => a + b, 0),
        rowHeight
      )
      .fill();
  } else {
    const rowColor = y % (rowHeight * 2) === rowHeight ? "#f5f5f5" : "#ffffff";
    doc
      .fillColor(rowColor)
      .rect(
        x,
        y,
        columnWidths.reduce((a, b) => a + b, 0),
        rowHeight
      )
      .fill();
  }

  // Draw cell content
  row.forEach((text, i) => {
    doc
      .fillColor(isHeader ? "#ffffff" : "#000000")
      .font(isHeader ? "Helvetica-Bold" : "Helvetica")
      .fontSize(isHeader ? 12 : 10)
      .text(text, x + 5, y + 5, { width: columnWidths[i] - 10, align: "left" });
    x += columnWidths[i]; // Move to the next column
  });

  // Draw borders
  doc.strokeColor("#cccccc").lineWidth(0.5);
  doc
    .moveTo(50, y)
    .lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke(); // Top border
  doc
    .moveTo(50, y + rowHeight)
    .lineTo(50 + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
    .stroke(); // Bottom border
}

/**
 * Generates a PDF file from an array of records.
 * @param {Array} records - The array of records to include in the PDF.
 * @returns {Promise<string>} - The path to the generated PDF file.
 */
const generatePDF = async (records) => {
  return new Promise((resolve, reject) => {
    const reportsDir = resolveReportsDir();
    cleanupOldReports(reportsDir);

    const doc = new PDFDocument({ margin: 50, size: [800, 1000] });
    const fileName = `${Date.now()}-orders.pdf`;
    const filePath = path.join(reportsDir, fileName);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Set up table headers and column widths
    const headers = ["Brand", "Model", "Price", "Sell Price", "Type"];
    const rowHeight = 30;

    // Add a title
    doc.fontSize(20).text("Sell Report", 50, 50, { align: "center" });

    // Function to draw a table row with alternating colors

    // Draw table headers
    drawTableRow(doc, 100, headers, true);

    // Draw table rows
    let y = 100 + rowHeight; // Start below the headers
    records.forEach((row) => {
      drawTableRow(doc, y, [
        row.brand,
        row.model,
        row.price.toString(),
        row.sellPrice.toString(),
        row.type,
      ]);
      y += rowHeight; // Move to the next row
    });

    const totalPrice = records.reduce((total, row) => total + row.price, 0);
    const totalSellPrice = records.reduce(
      (total, row) => total + row.sellPrice,
      0
    );
    const profit = totalSellPrice - totalPrice;

    // Add a line separator
    doc.moveDown();
    doc.lineWidth(0.5).moveTo(50, y).lineTo(550, y).stroke();
    doc.moveDown();
    doc.fontSize(12).text(`Total Price: ${totalPrice}`, 50, y + 10);
    doc.moveDown();
    doc.lineWidth(0.5).moveTo(50, y).lineTo(550, y).stroke();
    doc.fontSize(12).text(`Total Sell Price: ${totalSellPrice}`, 50, y + 30);
    doc.moveDown();
    doc.lineWidth(0.5).moveTo(50, y).lineTo(550, y).stroke();
    doc.moveDown();
    doc.fontSize(12).text(`Profit: ${profit}`, 50, y + 50);
    // Add a footer
    doc
      .fontSize(10)
      .text("Generated on: " + new Date().toLocaleDateString(), 50, y + 20, {
        align: "center",
      });

    // Finalize the PDF
    doc.end();
    writeStream.on("finish", () => {
      resolve(`/reports/${fileName}`);
    });
    writeStream.on("error", (error) => {
      console.error("Error creating PDF:", error);
      reject(error);
    });
  });
};

module.exports = generatePDF;
module.exports.resolveReportsDir = resolveReportsDir;
