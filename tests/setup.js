/**
 * Test setup — loads HTML files via jsdom and exposes their JS globals.
 *
 * Usage:
 *   const { loadAddition, loadSubtraction } = require('./setup');
 *   const win = loadAddition();
 *   win.digits(123) // => { hundreds: 1, tens: 2, ones: 3 }
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

function loadHTML(filename) {
  const html = fs.readFileSync(path.join(__dirname, '..', filename), 'utf-8');
  const dom = new JSDOM(html, {
    url: 'http://localhost',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
  });
  return dom.window;
}

function loadAddition() {
  return loadHTML('addition.html');
}

function loadSubtraction() {
  return loadHTML('subtraction.html');
}

module.exports = { loadAddition, loadSubtraction, loadHTML };
