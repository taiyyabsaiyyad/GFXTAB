const fs = require('fs');

function fixEisDirError(err, filePath) {
  if (err && err.code === 'EISDIR') {
    const newErr = new Error(`EINVAL: invalid argument, readlink '${filePath}'`);
    newErr.code = 'EINVAL';
    newErr.errno = -4071;
    newErr.syscall = 'readlink';
    newErr.path = filePath;
    return newErr;
  }
  return err;
}

// Patch fs.readlinkSync
const originalReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (filePath, options) {
  try {
    return originalReadlinkSync(filePath, options);
  } catch (err) {
    throw fixEisDirError(err, filePath);
  }
};

// Patch fs.readlink (callback)
const originalReadlink = fs.readlink;
fs.readlink = function (filePath, options, callback) {
  let cb = callback;
  let opts = options;
  if (typeof options === 'function') {
    cb = options;
    opts = {};
  }
  originalReadlink(filePath, opts, (err, linkString) => {
    if (err) {
      const fixed = fixEisDirError(err, filePath);
      if (fixed !== err) return cb(fixed);
    }
    cb(err, linkString);
  });
};

// Patch fs.promises.readlink
if (fs.promises && fs.promises.readlink) {
  const originalReadlinkPromise = fs.promises.readlink;
  fs.promises.readlink = async function (filePath, options) {
    try {
      return await originalReadlinkPromise(filePath, options);
    } catch (err) {
      throw fixEisDirError(err, filePath);
    }
  };
}

// Also patch graceful-fs if present
try {
  const gracefulFs = require('graceful-fs');
  if (gracefulFs.readlinkSync && gracefulFs.readlinkSync !== fs.readlinkSync) {
    const origGraceful = gracefulFs.readlinkSync;
    gracefulFs.readlinkSync = function(filePath, options) {
      try { return origGraceful(filePath, options); }
      catch(err) { throw fixEisDirError(err, filePath); }
    };
  }
  if (gracefulFs.readlink && gracefulFs.readlink !== fs.readlink) {
    const origGracefulAsync = gracefulFs.readlink;
    gracefulFs.readlink = function(filePath, options, callback) {
      let cb = callback;
      let opts = options;
      if (typeof options === 'function') { cb = options; opts = {}; }
      origGracefulAsync(filePath, opts, (err, linkString) => {
        if (err) {
          const fixed = fixEisDirError(err, filePath);
          if (fixed !== err) return cb(fixed);
        }
        cb(err, linkString);
      });
    };
  }
} catch(e) {}

console.log('fs.readlink Windows patch successfully applied.');
