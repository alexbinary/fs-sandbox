
let fs = require('fs')
let path = require('path')

let rimraf = require('rimraf')
let mkdirp = require('mkdirp')
let touchp = require('touchp')

let promisify = require('alexbinary.promisify')

let root = __dirname

let fsSandbox = {
  setRoot (folderpath) {
    root = folderpath
  },
  getRoot () {
    return root
  },
  new (cb) {
    makeSandbox(cb)
  },
  newSync () {
    return makeSandboxSync()
  },
  rm (cb) {
    rimraf(getRmGlobablGlob(), cb)
  },
  rmSync () {
    rimraf.sync(getRmGlobablGlob())
  }
}
fsSandbox.new = promisify(null, fsSandbox.new)
fsSandbox.rm = promisify(null, fsSandbox.rm)

function makeSandbox (cb) {
  fs.mkdtemp(getSandboxBasePath(), (err, fullpath) => {
    if (err) cb(err)
    else cb(null, makeSandboxObject(fullpath))
  })
}

function makeSandboxSync () {
  let fullpath = fs.mkdtempSync(getSandboxBasePath())
  return makeSandboxObject(fullpath)
}

function makeSandboxObject (fullpath) {
  let obj = {
    fullpath,
    path: path.relative(root, fullpath),
    getPath (filepath) {
      return path.join(fullpath, filepath)
    },
    touchp (filepath, cb) {
      return makeFile(fullpath, filepath, cb)
    },
    touchpSync (filepath) {
      return makeFileSync(fullpath, filepath)
    },
    mkdirp (filepath, cb) {
      return makeDir(fullpath, filepath, cb)
    },
    mkdirpSync (filepath) {
      return makeDirSync(fullpath, filepath)
    },
    rm (cb) {
      rimraf(fullpath, cb)
    },
    rmSync () {
      rimraf.sync(fullpath)
    }
  }
  obj.touchp = promisify(null, obj.touchp)
  obj.mkdirp = promisify(null, obj.mkdirp)
  obj.rm = promisify(null, obj.rm)
  return obj
}

function makeFile (sandboxpath, filepath, cb) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  touchp(fullpath, (err) => {
    if (err) cb(err)
    else cb(null, makeFileObject(sandboxpath, fullpath))
  })
}

function makeFileSync (sandboxpath, filepath) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  touchp.sync(fullpath)
  return makeFileObject(sandboxpath, fullpath)
}

function makeDir (sandboxpath, filepath, cb) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  mkdirp(fullpath, (err) => {
    if (err) cb(err)
    else cb(null, makeFileObject(sandboxpath, fullpath))
  })
}

function makeDirSync (sandboxpath, filepath) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  mkdirp.sync(fullpath)
  return makeFileObject(sandboxpath, fullpath)
}

function makeFileObject (sandboxpath, fullpath) {
  let obj = {
    fullpath,
    path: path.relative(sandboxpath, fullpath),
    rm (cb) {
      rimraf(fullpath, cb)
    },
    rmSync () {
      rimraf.sync(fullpath)
    }
  }
  obj.rm = promisify(null, obj.rm)
  return obj
}

function getSandboxBasePath () {
  return path.join(root, 'sandbox')
}

function getPathInSandbox (sandboxpath, filepath) {
  return path.join(sandboxpath, filepath)
}

function getRmGlobablGlob () {
  return getSandboxBasePath() + '*'
}

module.exports = fsSandbox
