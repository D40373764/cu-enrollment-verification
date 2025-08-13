const mustache = require('mustache');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');
const { template } = require('./assets/enrollment-verification');

/**
 * Generate enrollment verification letter based on JWT.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const generatePDF = async (req, res) => {
  console.log(`Requesting enrollment verification letter`);

  try {
    let token = String(req.query.token);
    console.log('\ntoken=' + token);
    let data = jwt.verify(token, 'Adtalem123');

    console.log('\ndata=');
    console.log(data);

    let html = mustache.render(template, data);

    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
      timeout: 60000
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true
    });

    await browser.close();

    let currDate = new Date();
    let timestamp = Math.floor(currDate.getTime() / 1000);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=enrollment_verification-${timestamp}.pdf`
    );
    res.end(pdfBuffer);

  } catch (e) {
    console.log(`Enrollment verification error: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { generatePDF };
