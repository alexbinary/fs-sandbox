
let fs = require('fs')
let path = require('path')
let rimraf = require('rimraf')
let mkdirp = require('mkdirp')
let touchp = require('touchp')

let root = __dirname

module.exports = {
  setRoot: (folderpath) => {
    root = folderpath
  },
  getRoot: () => {
    return root
  },
  newSync: () => {
    return makeSandboxObject()
  },
  rmSync: () => {
    rimraf.sync(getSandboxBasePath() + '*')
  }
}

function makeSandboxObject () {
  let fullpath = fs.mkdtempSync(getSandboxBasePath())
  return {
    fullpath,
    path: path.relative(root, fullpath),
    getPath: (filepath) => {
      return path.join(fullpath, filepath)
    },
    touchpSync: (filepath) => {
      return makeFileObject(fullpath, filepath)
    },
    mkdirpSync: (filepath) => {
      return makeDirObject(fullpath, filepath)
    },
    rmSync: () => {
      rimraf.sync(fullpath)
    }
  }
}

function makeFileObject (sandboxpath, filepath) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  touchp.sync(fullpath)
  return {
    fullpath,
    path: path.relative(sandboxpath, fullpath),
    rmSync: () => {
      rimraf.sync(fullpath)
    }
  }
}

function makeDirObject (sandboxpath, filepath) {
  let fullpath = getPathInSandbox(sandboxpath, filepath)
  mkdirp.sync(fullpath)
  return {
    fullpath,
    path: path.relative(sandboxpath, fullpath),
    rmSync: () => {
      rimraf.sync(fullpath)
    }
  }
}

function getSandboxBasePath () {
  return path.join(root, 'sandbox')
}

function getPathInSandbox (sandboxpath, filepath) {
  return path.join(sandboxpath, filepath)
}
