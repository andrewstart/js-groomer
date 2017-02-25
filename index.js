"use strict";

const RemoveOptions = {
    NONE: 'NONE',
    REMOVE_COMMENT: 'REMOVE_COMMENT',
    REMOVE_CODE: 'REMOVE_CODE',
    REPLACE_COMMENT: 'REPLACE_COMMENT'
};

//finds block and line comments - has trouble with comment stuff included in regex or strings, but
//such is life
const commentFinder = /^([\t ]*)(\/\*[\s\S]*?\*\/|\/\/.*$)/gm;
//basic regex for finding the end of a line, regardless of line ending type
const lineEnd = /$/gm;
//regex for finding the start or end of code blocks, including single lines
const blockFinder = /[\{\};]/gm;

function handleFile(fileContents, commentCallback) {
    //reset the global regexp
    commentFinder.lastIndex = 0;
    
    //storage for what we find
    let found = null;
    //keep going through the entire file until we have found all of the comments
    while ((found = commentFinder.exec(fileContents)) != null) {
        //get where our line starts
        let removeStartIndex = found.index;
        //get where the line ends - this variable will end up being the end index for overall removal
        let endIndex = removeStartIndex;
        //track text in case we want to replace a comment
        let textToInsert = '';
        //if task is to make a public release, and the code is private, then remove that bit of code, and the comment
        const action = commentCallback(found[2]);
        //if nothing returned, then don't do anything
        if (!action) {
            continue;
        }
        switch (action.action || action) {
            case RemoveOptions.REMOVE_COMMENT:
                //set the removal index to be the last character of the comment we found
                endIndex = commentFinder.lastIndex;
                //if it is the last line, then remove the preceding newline character
                if (endIndex === fileContents.length) {
                    removeStartIndex -= 1;
                }
                break;
            case RemoveOptions.REMOVE_CODE:
                //find the end of the block that starts on the next line, even if it is
                //a single line rather than a block
                let braceDepth = 0;
                let foundChar = null;
                blockFinder.lastIndex = commentFinder.lastIndex;
                while ((foundChar = blockFinder.exec(fileContents)) != null) {
                    const char = foundChar[0];
                    if (char === ';' && braceDepth === 0) {
                        //find the end of the line
                        lineEnd.lastIndex = blockFinder.lastIndex;
                        const end = lineEnd.exec(fileContents);
                        if (end) {
                            endIndex = lineEnd.lastIndex;
                        } else {
                            //this should not happen, but just in case
                            endIndex = foundChar.index;
                        }
                        //break the while loop
                        break;
                    } else if (char === '{') {
                        //if a block opens up, keep track of that
                        braceDepth++;
                    } else if (char === '}') {
                        //a block closed, track that and if it was our starting block, then
                        //do other stuff
                        if(--braceDepth <= 0) {
                            //find the end of the line where our block ends
                            lineEnd.lastIndex = blockFinder.lastIndex;
                            const end = lineEnd.exec(fileContents);
                            if (end) {
                                endIndex = lineEnd.lastIndex;
                            } else {
                                //this should not happen, but just in case
                                endIndex = foundChar.index;
                            }
                            //break the while loop
                            break;
                        }
                    }
                }
                break;
            case RemoveOptions.REPLACE_COMMENT:
                //set the removal index to be the last character of the comment we found
                endIndex = commentFinder.lastIndex - 1;
                //replace the leading whitespace in each line of the doc with the leading
                //whitespace of the comment we are replacing, to at least be close to the right
                //indentation
                const leadingWhitespace = /^([ \t](?!\S))*[ \t]/gm;
                //replace the empty insertion string with the actual text
                textToInsert = found[1] + action.data.replace(leadingWhitespace, found[1]);
                break;
        }
        //cut out the correct amount of text. Insert any text as appropriate.
        if (removeStartIndex !== endIndex) {
            fileContents = fileContents.substring(0, removeStartIndex) + textToInsert + fileContents.substring(endIndex + 1);
            //start the next search at the end of the text we removed (and after any inserted text)
            commentFinder.lastIndex = removeStartIndex + textToInsert.length;
        }
    }
    return fileContents;
}

module.exports = {
    RemoveOptions,
    handleFile
};