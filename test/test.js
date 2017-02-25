"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const groomer = require("../");

describe("Comment Removal", function() {
    it("Remove Single Line Comment", function() {
        const input = fs.readFileSync(path.join(__dirname, "input/removeSingleLine.js"), "utf8");
        const output = fs.readFileSync(path.join(__dirname, "output/removeSingleLine.js"), "utf8");
        
        const cleaned = groomer.handleFile(input, function(comment) {
            return groomer.RemoveOptions.REMOVE_COMMENT;
        });
        
        assert.equal(cleaned, output, "output should be correct");
    });
    it("Remove Block Line Comment", function() {
        const input = fs.readFileSync(path.join(__dirname, "input/removeBlockComment.js"), "utf8");
        const output = fs.readFileSync(path.join(__dirname, "output/removeBlockComment.js"), "utf8");
        
        const cleaned = groomer.handleFile(input, function(comment) {
            return groomer.RemoveOptions.REMOVE_COMMENT;
        });
        
        assert.equal(cleaned, output, "output should be correct");
    });
    it("Leave Comments", function() {
        const input = fs.readFileSync(path.join(__dirname, "input/leaveComment.js"), "utf8");
        const output = fs.readFileSync(path.join(__dirname, "output/leaveComment.js"), "utf8");
        
        const cleaned = groomer.handleFile(input, function(comment) {
            return groomer.RemoveOptions.NONE;
        });
        
        assert.equal(cleaned, output, "output should be correct");
    });
});

describe("Comment Replacement", function() {
    it("Replace Single Line Comment", function() {
        const input = fs.readFileSync(path.join(__dirname, "input/replaceSingleLine.js"), "utf8");
        const output = fs.readFileSync(path.join(__dirname, "output/replaceSingleLine.js"), "utf8");
        
        const cleaned = groomer.handleFile(input, function(comment) {
            return {
                action: groomer.RemoveOptions.REPLACE_COMMENT,
                data: "foobar"
            };
        });
        
        assert.equal(cleaned, output, "output should be correct");
    });
    it("Replace Block Line Comment", function() {
        const input = fs.readFileSync(path.join(__dirname, "input/replaceBlockComment.js"), "utf8");
        const output = fs.readFileSync(path.join(__dirname, "output/replaceBlockComment.js"), "utf8");
        
        const cleaned = groomer.handleFile(input, function(comment) {
            return {
                action: groomer.RemoveOptions.REPLACE_COMMENT,
                data: "/**\n    * foobar\n    */"
            };
        });
        
        assert.equal(cleaned, output, "output should be correct");
    });
});

describe("Code Removal", function() {
    it("Replace Single Line of Code", function() {
        const input = fs.readFileSync(path.join(__dirname, "input/removeSingleLineCode.js"), "utf8");
        const output = fs.readFileSync(path.join(__dirname, "output/removeSingleLineCode.js"), "utf8");
        
        const cleaned = groomer.handleFile(input, function(comment) {
            return groomer.RemoveOptions.REMOVE_CODE;
        });
        
        assert.equal(cleaned, output, "output should be correct");
    });
    it("Remove Block of Code", function() {
        const input = fs.readFileSync(path.join(__dirname, "input/removeBlockCode.js"), "utf8");
        const output = fs.readFileSync(path.join(__dirname, "output/removeBlockCode.js"), "utf8");
        
        const cleaned = groomer.handleFile(input, function(comment) {
            return groomer.RemoveOptions.REMOVE_CODE;
        });
        
        assert.equal(cleaned, output, "output should be correct");
    });
});