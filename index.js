const { generatePDF } = require('./enrollmentVerification');

/**
 * HTTP Cloud Run function.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.helloWorld = (req, res) => {
  const name = req.query.name || 'World';
  console.log(`Your name is ${name}`);
  res.send(`Hello, ${name}!`);
};

exports.enrollmentVerification = (req, res) => {
  return generatePDF(req, res);
};