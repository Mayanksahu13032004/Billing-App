import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default async function generatePDF(bill) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  let y = height - 50;

  /* ================= HEADER ================= */
  page.drawText("GURUKRIPA ENGINEERING", {
    x: 150,
    y,
    size: 18,
    font,
  });

  y -= 40;
  page.drawText(`Bill No: ${bill.billNo}`, { x: 50, y, size: 12, font });
  page.drawText(`Date: ${new Date(bill.date).toDateString()}`, {
    x: 400,
    y,
    size: 12,
    font,
  });

  y -= 20;
  page.drawText(`Customer: ${bill.customerName}`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  y -= 30;

  /* ================= TABLE CONFIG ================= */
  const tableTop = y;
  const rowHeight = 25;

  const colX = {
    sno: 50,
    particular: 90,
    qty: 300,
    rate: 360,
    amount: 440,
  };

  /* ================= TABLE HEADER ================= */
  page.drawRectangle({
    x: 45,
    y: tableTop,
    width: 500,
    height: rowHeight,
    color: rgb(0.9, 0.9, 0.9),
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  page.drawText("S.No", { x: colX.sno, y: tableTop + 8, size: 11, font });
  page.drawText("Particular", {
    x: colX.particular,
    y: tableTop + 8,
    size: 11,
    font,
  });
  page.drawText("Qty", { x: colX.qty, y: tableTop + 8, size: 11, font });
  page.drawText("Rate", { x: colX.rate, y: tableTop + 8, size: 11, font });
  page.drawText("Amount", {
    x: colX.amount,
    y: tableTop + 8,
    size: 11,
    font,
  });

  y = tableTop - rowHeight;

  /* ================= TABLE ROWS ================= */
  bill.items.forEach((item, index) => {
    page.drawRectangle({
      x: 45,
      y,
      width: 500,
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    page.drawText(String(index + 1), {
      x: colX.sno,
      y: y + 8,
      size: 11,
      font,
    });

    page.drawText(item.particular, {
      x: colX.particular,
      y: y + 8,
      size: 11,
      font,
    });

    page.drawText(String(item.qty), {
      x: colX.qty,
      y: y + 8,
      size: 11,
      font,
    });

    page.drawText(String(item.rate), {
      x: colX.rate,
      y: y + 8,
      size: 11,
      font,
    });

    page.drawText(String(item.amount), {
      x: colX.amount,
      y: y + 8,
      size: 11,
      font,
    });

    y -= rowHeight;
  });

  /* ================= TOTAL ================= */
  y -= 20;

  page.drawText(`Grand Total: Rs. ${bill.grandTotal}`, {
    x: 350,
    y,
    size: 13,
    font,
  });

  y -= 20;
  page.drawText(`Amount in Words: ${bill.amountInWords}`, {
    x: 50,
    y,
    size: 11,
    font,
  });

  return await pdfDoc.save();
}
