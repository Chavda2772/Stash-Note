var pool = require('../config/mySql.js');

module.exports.generateNewSyncID = async (data) => {
  let { uniqueSyncId, hashPassword, clientIp } = data;
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
        return;
      }

      conn.query(
        `call usp_InsertUserInfo (?, ?, ?)`,
        [uniqueSyncId, hashPassword, clientIp],
        function (error, results, fields) {
          conn.release();
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  });
};

module.exports.getUserDetail = async (uniqueSyncId) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
        return;
      }

      conn.query(
        `call usp_getUserDetailByUUID(?);`,
        [uniqueSyncId],
        function (error, results, fields) {
          conn.release();
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  });
};

module.exports.addOrUpdateSyncData = async (UserId, userData) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
        return;
      }

      conn.query(
        `call usp_InsertOrUpdateNotes(?, ?)`,
        [UserId, userData],
        function (error, results, fields) {
          conn.release();
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  });
};

module.exports.deleteUserSyncData = async (UserId) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
        return;
      }

      conn.query(
        `call usp_deleteUserNotes(?)`,
        [UserId],
        function (error, results, fields) {
          conn.release();
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  });
};

module.exports.getUserNoteDetailsById = async (UserId) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
        return;
      }

      conn.query(
        `call usp_getNoteDetailByUserId(?)`,
        [UserId],
        function (error, results, fields) {
          conn.release();
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  });
};

module.exports.addUserIp = async (UserId, clientIp) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
        return;
      }

      conn.query(
        `call usp_addUserIp(?, ?)`,
        [UserId, clientIp],
        function (error, results, fields) {
          conn.release();
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  });
};


module.exports.getDownloadLogPassCode = async (UserId, userData) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, conn) {
      if (err) {
        reject(err);
        return;
      }

      conn.query(
        `call usp_getZipPassKey()`,
        function (error, results, fields) {
          conn.release();
          if (error) {
            reject(error);
          }
          resolve(results[0][0].ConfigValue);
        }
      );
    });
  });
};