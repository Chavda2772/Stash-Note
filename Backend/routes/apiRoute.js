const express = require('express');

const { generateUniqueSyncID } = require('../config/commonFunction.js');
const {
  generatePasswordHash,
  comparePassword,
} = require('../config/encryptionUtil.js');
const {
  generateNewSyncID,
  getUserDetail,
  addOrUpdateSyncData,
  deleteUserSyncData,
  getUserNoteDetailsById,
  addUserIp,
} = require('../controller/mySqlController.js');
const createHttpError = require('http-errors');

const router = express.Router();

// Generate Data Synchronously
router.post('/generateNewSync', async (req, res, next) => {
  try {
    const { password } = req.body;
    const clientIp = req.ip;

    // Validate data
    if (!password) throw new Error(`Invalid data`);

    // Preparing data
    const uniqueSyncId = generateUniqueSyncID();
    const hashPassword = await generatePasswordHash(password);

    // saving data
    await generateNewSyncID({ uniqueSyncId, hashPassword, clientIp });

    res.send({
      success: true,
      details: {
        uniqueSyncId,
      },
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Update data
router.post('/syncUserData', async (req, res, next) => {
  try {
    const { password, uniqueSyncId, data } = req.body;
    const clientIp = req.ip;

    // Validating Data
    if (!uniqueSyncId || !data) throw new Error('Invalid Data');

    // Verify user identity
    const userDetail = await getUserDetail(uniqueSyncId);
    const { Password: hashPassword, UserId } = userDetail[0][0];
    const allowIps = userDetail[1].map((row) => row.IpAddress);

    if (!allowIps.includes(clientIp)) {
      if (!password) {
        next(createHttpError(401));
        return;
      }
      // Compare Password
      const isSuccess = await comparePassword(password, hashPassword);
      if (!isSuccess) throw new Error(`Wrong password`);
      else addUserIp(UserId, clientIp);
    }

    // store to database
    await addOrUpdateSyncData(UserId, data);

    res.send({
      success: true,
      details: 'Data sync successfully',
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Remove synchronously data
router.post('/clearSyncData', async (req, res, next) => {
  try {
    const { password, uniqueSyncId } = req.body;
    const clientIp = req.ip;

    // Validating Data
    if (!uniqueSyncId) throw new Error('Invalid Data');

    // Verify user identity
    const userDetail = await getUserDetail(uniqueSyncId);
    const { Password: hashPassword, UserId } = userDetail[0][0];
    const allowIps = userDetail[1].map((row) => row.IpAddress);

    if (!allowIps.includes(clientIp)) {
      if (!password) {
        next(createHttpError(401));
        return;
      }
      // Compare Password
      const isSuccess = await comparePassword(password, hashPassword);
      if (!isSuccess) throw new Error(`Wrong password`);
    }

    // store to database
    await deleteUserSyncData(UserId);

    res.send({
      success: true,
      details: 'Successful clear server data',
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Restore request data
router.post('/restoreSyncData', async (req, res, next) => {
  try {
    const { password, uniqueSyncId } = req.body;
    const clientIp = req.ip;

    // Validating Data
    if (!uniqueSyncId) throw new Error('Invalid Data');

    // Verify user identity
    const userDetail = await getUserDetail(uniqueSyncId);
    const { Password: hashPassword, UserId } = userDetail[0][0];
    const allowIps = userDetail[1].map((row) => row.IpAddress);

    if (!allowIps.includes(clientIp)) {
      if (!password) {
        next(createHttpError(401));
        return;
      }
      // Compare Password
      const isSuccess = await comparePassword(password, hashPassword);
      if (!isSuccess) throw new Error(`Wrong password`);
      else addUserIp(UserId, clientIp);
    }

    // store to database
    const userNoteDetail = await getUserNoteDetailsById(UserId);

    res.send({
      success: true,
      details: userNoteDetail[0][0]?.NoteDetail ?? '',
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
