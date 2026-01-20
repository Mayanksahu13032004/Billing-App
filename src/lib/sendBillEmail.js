import nodemailer from "nodemailer";

export async function sendBillEmail({ 
  to, 
  customerName, 
  billNo, 
  businessName, 
  pdfBuffer 
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${businessName}" <${process.env.EMAIL_USER}>`,   // ✅ FIXED
    to,
    subject: `${customerName} Invoice #${billNo} from ${businessName}`,  // ✅ FIXED
    html: `
      <p>Hi ${customerName},</p>
      <p><b>${businessName}</b> - Your invoice (Bill No: <b>${billNo}</b>) is attached.</p>
      <p>Thank you for your business.</p>
    `,
    attachments: [
      {
        filename: `invoice-${billNo}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
