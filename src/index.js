
let fs = require('fs')
let path = require('path')

let rimraf = require('alexbinary.rimraf')
let mkdirp = require('alexbinary.mkdirp')
let touchp = require('alexbinary.touchp')

let promisify = require('alexbinary.promisify')
let callbackify = require('alexbinary.callbackify')

promisify(fs, ['mkdtemp'])

let root = __dirname

let fsSandbox = {
  setRoot (folderpath) {
    root = folderpath
  },
  getRoot () {
    return root
  },
  new () {
    return makeSandbox()
  },
  newSync () {
    return makeSandboxSync()
  },
  rm () {
    return rimraf(getRmGlobablGlob())
  },
  rmSync () {
    rimraf.sync(getRmGlobablGlob())
  }
}
callbackify(fsSandbox, ['new', 'rm'])

function makeSandbox () {
  return fs.mkdtemp(getSandboxBasePath()).then((fullpath) => {
    return makeSandboxObject(fullpath)
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
    touchp (filepath) {
      if (typeof filepath === 'string') {
        return makeFile(fullpath, filepath)
      } else {
        return Promise.all(filepath.map((item) => {
          return makeFile(fullpath, item)
        }))
      }
    },
    touchpSync (filepath) {
      if (typeof filepath === 'string') {
        return makeFileSync(fullpath, filepath)
      } else {
        return filepath.map((item) => {
          return makeFileSync(fullpath, item)
        })
      }
    },
    mkdirp (filepath) {
      if (typeof filepath === 'string') {
        return makeDir(fullpath, filepath)
      } else {
        return Promise.all(filepath.map((item) => {
          return makeDir(fullpath, item)
        }))
      }
    },
    mkdirpSync (filepath) {
      if (typeof filepath === 'string') {
        return makeDirSync(fullpath, filepath)
      } else {
        return filepath.map((item) => {
          return makeDirSync(fullpath, item)
        })
      }
    },
    rm () {
      return rimraf(fullpath)
    },
    rmSync () {
      rimraf.sync(fullpath)
    }
  }
  callbackify(obj, ['touchp', 'mkdirp', 'rm'])
  return obj
}

function makeFile (sandboxpath, filepath) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  return touchp(fullpath).then(() => {
    return makeFileObject(sandboxpath, fullpath)
  })
}

function makeFileSync (sandboxpath, filepath) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  touchp.sync(fullpath)
  return makeFileObject(sandboxpath, fullpath)
}

function makeDir (sandboxpath, filepath) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  return mkdirp(fullpath).then(() => {
    return makeFileObject(sandboxpath, fullpath)
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
    rm () {
      return rimraf(fullpath)
    },
    rmSync () {
      rimraf.sync(fullpath)
    }
  }
  callbackify(obj, ['rm'])
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
