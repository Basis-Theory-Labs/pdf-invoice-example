const fs = require('fs');

const formula = async function (req) {
  const { PDFDocument } = require('pdf-lib');

  const { account_number, user, invoice } = req.args;

  const pdf = await PDFDocument.load(Buffer.from(invoice, 'base64'));
  const pages = pdf.getPages();
  const page = pages[0];

  // draw account number
  page.drawText(account_number, {
    x: 135,
    y: 478,
    size: 10
  });

  // draw name - bill to
  page.drawText(`${user.first_name} ${user.last_name}`, {
    x: 92,
    y: 548,
    size: 10
  });

  // draw name - ship to
  page.drawText(`${user.first_name} ${user.last_name}`, {
    x: 300,
    y: 548,
    size: 10
  });

  // draw address line 1 - bill to
  page.drawText(user.address_line1, {
    x: 92,
    y: 528,
    size: 10
  });

  // draw address line 1 - ship to
  page.drawText(user.address_line1, {
    x: 300,
    y: 528,
    size: 10
  });

  // draw city, state, zip - bill to
  page.drawText(`${user.city}, ${user.state} ${user.zip}`, {
    x: 92,
    y: 508,
    size: 10
  });

  // draw city, state, zip - ship to
  page.drawText(`${user.city}, ${user.state} ${user.zip}`, {
    x: 300,
    y: 508,
    size: 10
  });

  const pdfBytes = await pdf.save();

  return {
    raw: {
      invoice: pdfBytes
    }
  }
}

// If you want to test the formula locally, uncomment this code!
// formula({
//   args: { 
//     account_number: '999999-00', 
//     user: {
//       first_name: 'James',
//       last_name: 'Holden',
//       address_line1: '456 Expanse St.',
//       city: 'New York',
//       state: 'NY',
//       zip: '12345',
//       phone: '(555) 555-5555'
//     }, 
//     invoice: fs.readFileSync('invoice.pdf', {encoding: 'base64'}) 
//   }
// }).then((result) => {
//   fs.writeFileSync('test.pdf', result.raw.invoice);
// });

console.log(JSON.stringify(`module.exports = ${formula}`))