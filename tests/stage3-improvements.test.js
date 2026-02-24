const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { loadAddition, loadSubtraction } = require('./setup');

function $(win, id) { return win.document.getElementById(id); }

// ── Service Worker Registration ──
describe('Stage 3: Service Worker registration', () => {
  it('addition.html registers service worker', () => {
    const win = loadAddition();
    // Check that the script element registering sw.js exists
    const scripts = win.document.querySelectorAll('script');
    const swScript = Array.from(scripts).some(s => s.textContent.includes('serviceWorker') && s.textContent.includes('sw.js'));
    assert.ok(swScript, 'Should have a script registering sw.js');
  });

  it('subtraction.html registers service worker', () => {
    const win = loadSubtraction();
    const scripts = win.document.querySelectorAll('script');
    const swScript = Array.from(scripts).some(s => s.textContent.includes('serviceWorker') && s.textContent.includes('sw.js'));
    assert.ok(swScript, 'Should have a script registering sw.js');
  });

  it('index.html registers service worker', () => {
    const { loadHTML } = require('./setup');
    const win = loadHTML('index.html');
    const scripts = win.document.querySelectorAll('script');
    const swScript = Array.from(scripts).some(s => s.textContent.includes('serviceWorker') && s.textContent.includes('sw.js'));
    assert.ok(swScript, 'Should have a script registering sw.js');
  });
});

// ── Discoverable Custom Entry Hint ──
describe('Stage 3: Entry hint', () => {
  it('addition has entry hint element', () => {
    const win = loadAddition();
    const hint = $(win, 'entryHint');
    assert.ok(hint, 'Should have entryHint element');
    assert.ok(hint.textContent.includes('Type your own'), 'Hint should mention typing your own numbers');
  });

  it('subtraction has entry hint element', () => {
    const win = loadSubtraction();
    const hint = $(win, 'entryHint');
    assert.ok(hint, 'Should have entryHint element');
    assert.ok(hint.textContent.includes('Type your own'), 'Hint should mention typing your own numbers');
  });

  it('addition hint has entry-hint class', () => {
    const win = loadAddition();
    const hint = $(win, 'entryHint');
    assert.ok(hint.classList.contains('entry-hint'));
  });

  it('subtraction hint has entry-hint class', () => {
    const win = loadSubtraction();
    const hint = $(win, 'entryHint');
    assert.ok(hint.classList.contains('entry-hint'));
  });

  it('addition dismissEntryHint sets localStorage', () => {
    const win = loadAddition();
    win.localStorage.removeItem('customEntryUsed');
    win.dismissEntryHint();
    assert.strictEqual(win.localStorage.getItem('customEntryUsed'), '1');
  });

  it('subtraction dismissEntryHint sets localStorage', () => {
    const win = loadSubtraction();
    win.localStorage.removeItem('customEntryUsed');
    win.dismissEntryHint();
    assert.strictEqual(win.localStorage.getItem('customEntryUsed'), '1');
  });

  it('addition hint hidden when localStorage already set', () => {
    // This tests the IIFE on load — we load with localStorage pre-set
    const { JSDOM } = require('jsdom');
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.join(__dirname, '..', 'addition.html'), 'utf-8');
    const dom = new JSDOM(html, {
      url: 'http://localhost',
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      beforeParse(window) {
        window.localStorage.setItem('customEntryUsed', '1');
      }
    });
    const hint = dom.window.document.getElementById('entryHint');
    assert.strictEqual(hint.style.display, 'none');
  });
});

// ── Undo on Destructive Actions ──
describe('Stage 3: Undo toast', () => {
  it('addition has undo-toast CSS class', () => {
    const win = loadAddition();
    const styles = Array.from(win.document.querySelectorAll('style'));
    const hasUndoStyle = styles.some(s => s.textContent.includes('.undo-toast'));
    assert.ok(hasUndoStyle, 'Should have .undo-toast CSS');
  });

  it('subtraction has undo-toast CSS class', () => {
    const win = loadSubtraction();
    const styles = Array.from(win.document.querySelectorAll('style'));
    const hasUndoStyle = styles.some(s => s.textContent.includes('.undo-toast'));
    assert.ok(hasUndoStyle, 'Should have .undo-toast CSS');
  });

  it('addition hasPartialWork returns false when no work', () => {
    const win = loadAddition();
    // Clear result cells
    ['g-r-h','g-r-t','g-r-o','carry-h','carry-t'].forEach(id => {
      const el = $(win, id);
      if (el) el.value = '';
    });
    assert.strictEqual(win.hasPartialWork(), false);
  });

  it('addition hasPartialWork returns true when result filled', () => {
    const win = loadAddition();
    $(win, 'g-r-o').value = '5';
    assert.strictEqual(win.hasPartialWork(), true);
  });

  it('subtraction hasPartialWork returns true when carry filled', () => {
    const win = loadSubtraction();
    $(win, 'carry-t').value = '1';
    assert.strictEqual(win.hasPartialWork(), true);
  });

  it('addition showUndoToast creates toast element', () => {
    const win = loadAddition();
    const commit = win.showUndoToast('Test.');
    commit();
    const toast = win.document.querySelector('.undo-toast');
    assert.ok(toast, 'Should create an undo-toast element');
    assert.ok(toast.textContent.includes('Test.'), 'Toast should contain label');
    assert.ok(toast.textContent.includes('Undo'), 'Toast should have Undo button');
    win.dismissUndoToast();
  });

  it('subtraction showUndoToast creates toast element', () => {
    const win = loadSubtraction();
    const commit = win.showUndoToast('Cleared.');
    commit();
    const toast = win.document.querySelector('.undo-toast');
    assert.ok(toast, 'Should create an undo-toast element');
    win.dismissUndoToast();
  });

  it('addition dismissUndoToast removes toast', () => {
    const win = loadAddition();
    const commit = win.showUndoToast('Test.');
    commit();
    assert.ok(win.document.querySelector('.undo-toast'));
    win.dismissUndoToast();
    assert.strictEqual(win.document.querySelector('.undo-toast'), null);
  });

  it('addition undo restores cell values', () => {
    const win = loadAddition();
    // Set up some work
    $(win, 'g-a1-o').value = '5';
    $(win, 'g-a2-o').value = '3';
    $(win, 'g-r-o').value = '8';
    // Take snapshot and clear
    const commit = win.showUndoToast('Cleared.');
    $(win, 'g-a1-o').value = '';
    $(win, 'g-a2-o').value = '';
    $(win, 'g-r-o').value = '';
    commit();
    // Click undo
    const undoBtn = $(win, 'undoBtn');
    assert.ok(undoBtn, 'Should have undo button');
    undoBtn.click();
    assert.strictEqual($(win, 'g-a1-o').value, '5');
    assert.strictEqual($(win, 'g-a2-o').value, '3');
    assert.strictEqual($(win, 'g-r-o').value, '8');
  });
});
