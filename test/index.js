
let chai = require('chai')
chai.use(require('chai-string'))

let expect = chai.expect
let path = require('path')

let fileexists = require('alexbinary.file-exists')
let fsSandbox = require('./../src/index')

describe('fs-sandbox', function () {
  describe('module', function () {
    it('setRoot', function () {
      // ## TEST
      fsSandbox.setRoot(__dirname)
      // ## Assert
      expect(fsSandbox.getRoot()).to.equal(__dirname)
      // ## End
    })
    it('getRoot', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      // ## TEST
      let root = fsSandbox.getRoot()
      // ## Assert
      expect(root).to.equal(__dirname)
      // ## End
    })
    it('new', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      // ## TEST
      let sandbox = fsSandbox.newSync()
      // ## Assert
      expect(sandbox.fullpath).to.startWith(fsSandbox.getRoot())
      expect(fileexists.sync(sandbox.fullpath)).to.be.true
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('rm', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      fsSandbox.rmSync()
      // ## Assert
      expect(fileexists.sync(sandbox.fullpath)).to.be.false
      // ## End
    })
  })
  describe('sandbox', function () {
    it('path', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      let filepath = sandbox.path
      // ## Assert
      expect(filepath).to.startWith('sandbox')
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('fullpath', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      let filepath = sandbox.fullpath
      // ## Assert
      expect(filepath).to.startWith(fsSandbox.getRoot() + '/sandbox')
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('getPath', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      let filepath = sandbox.getPath('foo/bar')
      // ## Assert
      expect(filepath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('touchp', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      let file = sandbox.touchpSync('foo/bar')
      // ## Assert
      expect(file.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
      expect(fileexists.sync(file.fullpath)).to.be.true
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('touchp /', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      let file = sandbox.touchpSync('/foo/bar')
      // ## Assert
      expect(file.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
      expect(fileexists.sync(file.fullpath)).to.be.true
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('touchp fullpath', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let filepath = sandbox.getPath('foo/bar')
      // ## TEST
      let file = sandbox.touchpSync(filepath)
      // ## Assert
      expect(file.fullpath).to.equal(path.join(sandbox.fullpath, filepath))
      expect(fileexists.sync(file.fullpath)).to.be.true
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('mkdirp', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      let dir = sandbox.mkdirpSync('foo/bar')
      // ## Assert
      expect(dir.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
      expect(fileexists.sync(dir.fullpath)).to.be.true
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('mkdirp /', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      let dir = sandbox.mkdirpSync('/foo/bar')
      // ## Assert
      expect(dir.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
      expect(fileexists.sync(dir.fullpath)).to.be.true
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('mkdirp fullpath', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let filepath = sandbox.getPath('foo/bar')
      // ## TEST
      let dir = sandbox.mkdirpSync(filepath)
      // ## Assert
      expect(dir.fullpath).to.equal(path.join(sandbox.fullpath, filepath))
      expect(fileexists.sync(dir.fullpath)).to.be.true
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('rm', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      // ## TEST
      fsSandbox.rmSync()
      // ## Assert
      expect(fileexists.sync(sandbox.fullpath)).to.be.false
      // ## End
    })
  })
  describe('file', function () {
    it('path', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let file = sandbox.touchpSync('foo/bar')
      // ## TEST
      let filepath = file.path
      // ## Assert
      expect(filepath).to.equal('foo/bar')
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('fullpath', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let file = sandbox.touchpSync('foo/bar')
      // ## TEST
      let filepath = file.fullpath
      // ## Assert
      expect(filepath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('rm', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let file = sandbox.touchpSync('foo/bar')
      // ## TEST
      file.rmSync()
      // ## Assert
      expect(fileexists.sync(file.fullpath)).to.be.false
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
  })
  describe('dir', function () {
    it('path', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let dir = sandbox.mkdirpSync('foo/bar')
      // ## TEST
      let filepath = dir.path
      // ## Assert
      expect(filepath).to.equal('foo/bar')
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('fullpath', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let dir = sandbox.mkdirpSync('foo/bar')
      // ## TEST
      let filepath = dir.fullpath
      // ## Assert
      expect(filepath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('rm', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      let sandbox = fsSandbox.newSync()
      let dir = sandbox.mkdirpSync('foo/bar')
      // ## TEST
      dir.rmSync()
      // ## Assert
      expect(fileexists.sync(dir.fullpath)).to.be.false
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
  })
})
