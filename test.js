const PDFDocument = require("pdfkit");
const fs = require("fs");

// Sample data for the table
const data = [
  {
    _id: "679e3a810c6337456449ee7a",
    brand: "OnePlus",
    model: "9 Pro",
    price: 20000,
    sellPrice: 40000,
    type: "old",
    userId: "679e1f51728535bd6b85dc0e",
    customerName: "jdhdjh",
    customerPhone: "837387383",
    customerCnic: "87837387383",
    createdAt: "2025-02-01T15:15:13.673Z",
    updatedAt: "2025-02-01T15:15:13.673Z",
    __v: 0,
  },
  {
    _id: "679e3a470c6337456449ee75",
    brand: "Apple",
    model: "IPhone 12",
    price: 2000,
    sellPrice: 30000,
    type: "new",
    userId: "679e1f51728535bd6b85dc0e",
    customerName: "KKjk jdhd",
    customerPhone: "387387387383",
    customerCnic: "",
    createdAt: "2025-02-01T15:14:15.508Z",
    updatedAt: "2025-02-01T15:14:15.508Z",
    __v: 0,
  },
  {
    _id: "679e3a2e0c6337456449ee71",
    brand: "Apple",
    model: "IPhone 12",
    price: 2000,
    sellPrice: 29999,
    type: "new",
    userId: "679e1f51728535bd6b85dc0e",
    customerName: "Customer",
    customerPhone: "38738378373",
    customerCnic: "",
    createdAt: "2025-02-01T15:13:50.308Z",
    updatedAt: "2025-02-01T15:13:50.308Z",
    __v: 0,
  },
];

// Create a new PDF document
const doc = new PDFDocument({ margin: 50, size: [800, 1000] });

// Pipe the PDF to a file
doc.pipe(fs.createWriteStream("fancy_table.pdf"));

// Set up table headers and column widths
const headers = ["Brand", "Model", "Price", "Sell Price", "Type"];
const columnWidths = [200, 100, 150, 150, 100];
const rowHeight = 30;

// Add a title
doc.fontSize(20).text("Sell Report", 50, 50, { align: "center" });

// Function to draw a table row with alternating colors
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

// Draw table headers
drawTableRow(doc, 100, headers, true);

// Draw table rows
let y = 100 + rowHeight; // Start below the headers
data.forEach((row) => {
  drawTableRow(doc, y, [
    row.brand,
    row.model,
    row.price.toString(),
    row.sellPrice.toString(),
    row.type,
  ]);
  y += rowHeight; // Move to the next row
});

const totalPrice = data.reduce((total, row) => total + row.price, 0);
const totalSellPrice = data.reduce((total, row) => total + row.sellPrice, 0);
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

console.log("Fancy PDF created successfully: fancy_table.pdf");
