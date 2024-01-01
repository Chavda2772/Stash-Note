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
} = require('../controller/mySqlController.js');

const router = express.Router();

// Test
router.get('/', function (req, res, next) {
  res.send({
    success: true,
    message: 'test successful',
  });
});

// Generate Data Synchronously
router.post('/generateNewSync', async (req, res, next) => {
  try {
    const { password } = req.body;

    // Validate data
    if (!password) throw new Error(`Invalid data`);

    // Preparing data
    const uniqueSyncId = generateUniqueSyncID();
    const hashPassword = await generatePasswordHash(password);

    // saving data
    await generateNewSyncID({ uniqueSyncId, hashPassword });

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

    // Validating Data
    if (!password || !uniqueSyncId || !data) throw new Error('Invalid Data');

    // Verify user identity
    const userDetail = await getUserDetail(uniqueSyncId);
    const { Password: hashPassword, UserId } = userDetail[0];
    const isSuccess = await comparePassword(password, hashPassword);
    if (!isSuccess) throw new Error(`Wrong password`);

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

    // Validating Data
    if (!password || !uniqueSyncId) throw new Error('Invalid Data');

    // Verify user identity
    const userDetail = await getUserDetail(uniqueSyncId);
    const { Password: hashPassword, UserId } = userDetail[0];
    const isSuccess = await comparePassword(password, hashPassword);
    if (!isSuccess) throw new Error(`Wrong password`);

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

    // Validating Data
    if (!password || !uniqueSyncId) throw new Error('Invalid Data');

    // Verify user identity
    const userDetail = await getUserDetail(uniqueSyncId);
    const { Password: hashPassword, UserId } = userDetail[0];
    const isSuccess = await comparePassword(password, hashPassword);
    if (!isSuccess) throw new Error(`Wrong password`);

    // store to database
    const userNoteDetail = await getUserNoteDetailsById(UserId);

    res.send({
      success: true,
      details: userNoteDetail[0][0].NoteDetail ?? '',
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
