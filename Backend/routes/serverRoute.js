const express = require('express');
const router = express.Router();
const AdmZip = require('adm-zip');
const createHttpError = require('http-errors');

const { getDownloadLogPassCode } = require('../controller/mySqlController.js');

router.get('/downloadLogs', async function (req, res, next) {
  const { password } = req.query;

  // fetch passcode from database
  const securedPass = await getDownloadLogPassCode();

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
