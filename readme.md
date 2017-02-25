## Usage:
### Remove just a comment
```javascript
const groomer = require('js-groomer');
const cleaned = groomer.handleFile(myFileInput, function(comment) {
    if (comment === '// REMOVEME')
        return groomer.RemoveOptions.REMOVE_COMMENT;
});
```
### Remove a block of code after a comment
```javascript
const groomer = require('js-groomer');
const cleaned = groomer.handleFile(myFileInput, function(comment) {
    if (comment === '// REMOVEME')
        return groomer.RemoveOptions.REMOVE_CODE;
});
```
### Replace a comment
```javascript
const groomer = require('js-groomer');
const cleaned = groomer.handleFile(myFileInput, function(comment) {
    if (comment === '// REPLACEME') {
        return {
            action: groomer.RemoveOptions.REPLACE_COMMENT,
            data: 'foobar'
        };
    }
});
```