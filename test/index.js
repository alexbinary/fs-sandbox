
let chai = require('chai')
chai.use(require('chai-string'))
chai.use(require('chai-fs'))

let expect = chai.expect
let path = require('path')

let fsSandbox = require('./../src/index')

describe('fs-sandbox', function () {
  describe('module', function () {
    it('setRoot()', function () {
      // ## TEST
      fsSandbox.setRoot(__dirname)
      // ## Assert
      expect(fsSandbox.getRoot()).to.equal(__dirname)
      // ## End
    })
    it('getRoot()', function () {
      // ## Setup
      fsSandbox.setRoot(__dirname)
      // ## TEST
      let root = fsSandbox.getRoot()
      // ## Assert
      expect(root).to.equal(__dirname)
      // ## End
    })
    describe('new()', function () {
      it('callback', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        // ## TEST
        fsSandbox.new((err, sandbox) => {
          // ## Assert
          expect(err).to.be.null
          expect(sandbox.fullpath).to.have.dirname(fsSandbox.getRoot())
          expect(sandbox.fullpath).to.be.a.directory()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
          done()
        })
      })
      it('promise', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        // ## TEST
        fsSandbox.new().then((sandbox) => {
          // ## Assert
          expect(sandbox.fullpath).to.have.dirname(fsSandbox.getRoot())
          expect(sandbox.fullpath).to.be.a.directory()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('sync', function () {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        // ## TEST
        let sandbox = fsSandbox.newSync()
        // ## Assert
        expect(sandbox.fullpath).to.have.dirname(fsSandbox.getRoot())
        expect(sandbox.fullpath).to.be.a.directory()
        // ## Teardown
        fsSandbox.rmSync()
        // ## End
      })
    })
    describe('rm()', function () {
      it('callback', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        fsSandbox.rm((err) => {
          // ## Assert
          expect(err).to.be.null
          expect(sandbox.fullpath).to.not.be.a.path()
          // ## End
          done()
        })
      })
      it('promise', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        fsSandbox.rm().then(() => {
          // ## Assert
          expect(sandbox.fullpath).to.not.be.a.path()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('sync', function () {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        fsSandbox.rmSync()
        // ## Assert
        expect(sandbox.fullpath).to.not.be.a.path()
        // ## End
      })
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
      expect(filepath).to.have.dirname(fsSandbox.getRoot())
      expect(path.basename(filepath)).to.startWith('sandbox')
      // ## Teardown
      fsSandbox.rmSync()
      // ## End
    })
    it('getPath()', function () {
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
    describe('touchp()', function () {
      it('callback', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        sandbox.touchp('foo/bar', (err, file) => {
          // ## Assert
          expect(err).to.be.null
          expect(file.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
          expect(file.fullpath).to.be.a.file().and.not.empty
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
          done()
        })
      })
      it('promise', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        sandbox.touchp('foo/bar').then((file) => {
          // ## Assert
          expect(file.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
          expect(file.fullpath).to.be.a.file().and.not.empty
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('sync', function () {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        let file = sandbox.touchpSync('foo/bar')
        // ## Assert
        expect(file.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
        expect(file.fullpath).to.be.a.file().and.not.empty
        // ## Teardown
        fsSandbox.rmSync()
        // ## End
      })
      describe('with array', function () {
        it('callback', function (done) {
          // ## Setup
          fsSandbox.setRoot(__dirname)
          let sandbox = fsSandbox.newSync()
          // ## TEST
          sandbox.touchp(['foo/bar', 'foo/baz'], (err, files) => {
            // ## Assert
            expect(err).to.be.null
            expect(files).to.be.an('array').with.lengthOf(2)
            expect(files[0].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
            expect(files[1].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/baz'))
            expect(files[0].fullpath).to.be.a.file().and.not.empty
            expect(files[1].fullpath).to.be.a.file().and.not.empty
            // ## Teardown
            fsSandbox.rmSync()
            // ## End
            done()
          })
        })
        it('promise', function (done) {
          // ## Setup
          fsSandbox.setRoot(__dirname)
          let sandbox = fsSandbox.newSync()
          // ## TEST
          sandbox.touchp(['foo/bar', 'foo/baz']).then((files) => {
            // ## Assert
            expect(files).to.be.an('array').with.lengthOf(2)
            expect(files[0].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
            expect(files[1].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/baz'))
            expect(files[0].fullpath).to.be.a.file().and.not.empty
            expect(files[1].fullpath).to.be.a.file().and.not.empty
            // ## Teardown
            fsSandbox.rmSync()
            // ## End
          }).then(() => done()).catch(done)
        })
        it('sync', function () {
          // ## Setup
          fsSandbox.setRoot(__dirname)
          let sandbox = fsSandbox.newSync()
          // ## TEST
          let files = sandbox.touchpSync(['foo/bar', 'foo/baz'])
          // ## Assert
          expect(files).to.be.an('array')
          expect(files).to.have.lengthOf(2)
          expect(files[0].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
          expect(files[1].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/baz'))
          expect(files[0].fullpath).to.be.a.file().and.not.empty
          expect(files[1].fullpath).to.be.a.file().and.not.empty
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        })
      })
    })
    describe('mkdirp()', function () {
      it('callback', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        sandbox.mkdirp('foo/bar', (err, dir) => {
          // ## Assert
          expect(err).to.be.null
          expect(dir.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
          expect(dir.fullpath).to.be.a.directory()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
          done()
        })
      })
      it('promise', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        sandbox.mkdirp('foo/bar').then((dir) => {
          // ## Assert
          expect(dir.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
          expect(dir.fullpath).to.be.a.directory()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('sync', function () {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        let dir = sandbox.mkdirpSync('foo/bar')
        // ## Assert
        expect(dir.fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
        expect(dir.fullpath).to.be.a.directory()
        // ## Teardown
        fsSandbox.rmSync()
        // ## End
      })
      describe('with array', function () {
        it('callback', function (done) {
          // ## Setup
          fsSandbox.setRoot(__dirname)
          let sandbox = fsSandbox.newSync()
          // ## TEST
          sandbox.mkdirp(['foo/bar', 'foo/baz'], (err, dirs) => {
            // ## Assert
            expect(err).to.be.null
            expect(dirs).to.be.an('array').with.lengthOf(2)
            expect(dirs[0].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
            expect(dirs[1].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/baz'))
            expect(dirs[0].fullpath).to.be.a.directory()
            expect(dirs[1].fullpath).to.be.a.directory()
            // ## Teardown
            fsSandbox.rmSync()
            // ## End
            done()
          })
        })
        it('promise', function (done) {
          // ## Setup
          fsSandbox.setRoot(__dirname)
          let sandbox = fsSandbox.newSync()
          // ## TEST
          sandbox.mkdirp(['foo/bar', 'foo/baz']).then((dirs) => {
            // ## Assert
            expect(dirs).to.be.an('array').with.lengthOf(2)
            expect(dirs[0].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
            expect(dirs[1].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/baz'))
            expect(dirs[0].fullpath).to.be.a.directory()
            expect(dirs[1].fullpath).to.be.a.directory()
            // ## Teardown
            fsSandbox.rmSync()
            // ## End
          }).then(() => done()).catch(done)
        })
        it('sync', function () {
          // ## Setup
          fsSandbox.setRoot(__dirname)
          let sandbox = fsSandbox.newSync()
          // ## TEST
          let dirs = sandbox.mkdirpSync(['foo/bar', 'foo/baz'])
          // ## Assert
          expect(dirs).to.be.an('array').with.lengthOf(2)
          expect(dirs[0].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/bar'))
          expect(dirs[1].fullpath).to.equal(path.join(sandbox.fullpath, 'foo/baz'))
          expect(dirs[0].fullpath).to.be.a.directory()
          expect(dirs[1].fullpath).to.be.a.directory()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        })
      })
    })
    describe('rm()', function () {
      it('callback', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        sandbox.rm((err) => {
          // ## Assert
          expect(err).to.be.null
          expect(sandbox.fullpath).to.not.be.a.path()
          // ## End
          done()
        })
      })
      it('promise', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        sandbox.rm().then(() => {
          // ## Assert
          expect(sandbox.fullpath).to.not.be.a.path()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('sync', function () {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        // ## TEST
        sandbox.rmSync()
        // ## Assert
        expect(sandbox.fullpath).to.not.be.a.path()
        // ## End
      })
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
    describe('rm()', function () {
      it('callback', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        let file = sandbox.touchpSync('foo/bar')
        // ## TEST
        file.rm((err) => {
          // ## Assert
          expect(err).to.be.null
          expect(file.fullpath).to.not.be.a.path()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
          done()
        })
      })
      it('promise', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        let file = sandbox.touchpSync('foo/bar')
        // ## TEST
        file.rm().then(() => {
          // ## Assert
          expect(file.fullpath).to.not.be.a.path()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('sync', function () {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        let file = sandbox.touchpSync('foo/bar')
        // ## TEST
        file.rmSync()
        // ## Assert
        expect(file.fullpath).to.not.be.a.path()
        // ## Teardown
        fsSandbox.rmSync()
        // ## End
      })
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
    describe('rm()', function () {
      it('callback', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        let dir = sandbox.mkdirpSync('foo/bar')
        // ## TEST
        dir.rm((err) => {
          // ## Assert
          expect(err).to.be.null
          expect(dir.fullpath).to.not.be.a.path()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
          done()
        })
      })
      it('promise', function (done) {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        let dir = sandbox.mkdirpSync('foo/bar')
        // ## TEST
        dir.rm().then(() => {
          // ## Assert
          expect(dir.fullpath).to.not.be.a.path()
          // ## Teardown
          fsSandbox.rmSync()
          // ## End
        }).then(() => done()).catch(done)
      })
      it('sync', function () {
        // ## Setup
        fsSandbox.setRoot(__dirname)
        let sandbox = fsSandbox.newSync()
        let dir = sandbox.mkdirpSync('foo/bar')
        // ## TEST
        dir.rmSync()
        // ## Assert
        expect(dir.fullpath).to.not.be.a.path()
        // ## Teardown
        fsSandbox.rmSync()
        // ## End
      })
    })
  })
  after(function () {
    fsSandbox.rmSync()
  })
})
