const express = require('express');
const router = express.Router();
var AdmZip = require('adm-zip');
const createHttpError = require('http-errors');
const securedPass = 'Mahesh@6192';

// Test
router.get('/', function (req, res, next) {
  res.send({
    success: true,
    message: 'test successful',
  });
});

router.get('/downloadLogs', function (req, res, next) {
  const { password } = req.query;

  if (password != securedPass) {
    next(createHttpError(500));
    return;
  }
  var zip = new AdmZip();

  // add local file
  zip.addLocalFolder('Logs/');

  // get everything as a buffer
  var zipFileContents = zip.toBuffer();
  const fileName = 'logs.zip';
  const fileType = 'application/zip';
  res.writeHead(200, {
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Content-Type': fileType,
  });
  return res.end(zipFileContents);
});

module.exports = router;
