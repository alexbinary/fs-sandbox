# fs-sandbox
Filesystem sandbox for your fs-related tests 📝

## Install

Install with npm/yarn :

```
$ npm install https://github.com/alexbinary/fs-sandbox.git

$ yarn add https://github.com/alexbinary/fs-sandbox.git
```

## Usage

```javascript
let fsSandbox = require('alexbinary.fs-sandbox')

// will create sandbox folders in /tmp
fsSandbox.setRoot('/tmp')

// create a new sandbox folder
let sandbox = fsSandbox.new()
console.log(sandbox.path)     // e.g. sandboxEaE3zj
console.log(sandbox.fullpath) // /tmp/sandboxEaE3zj

// get path inside sandbox
sandbox.getPath('foo/bar')    // /tmp/sandboxEaE3zj/foo/bar

// create a file
let file = sandbox.touchp('foo/file')
console.log(file.path)        // foo/file
console.log(file.fullpath)    // /tmp/sandboxEaE3zj/foo/file

// create a directory
let dir = sandbox.mkdirp('foo/dir')
console.log(dir.path)        // foo/dir
console.log(dir.fullpath)    // /tmp/sandboxEaE3zj/foo/dir

// delete sandbox folder and all its content
sandbox.rm()

// delete all sandbox folders
fsSandbox.rm()
```

## Licence

MIT
