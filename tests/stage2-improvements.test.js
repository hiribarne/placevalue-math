const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition, loadSubtraction } = require('./setup');

function $(win, id) { return win.document.getElementById(id); }
function $$(win, sel) { return win.document.querySelectorAll(sel); }

describe('Stage 2: Kid-friendly mat labels', () => {
  it('addition uses "First Number" and "Second Number"', () => {
    const win = loadAddition();
    const labels = Array.from($$(win, '.mat-row-label')).map(el => el.textContent);
    assert.ok(labels.includes('First Number'), 'should have "First Number"');
    assert.ok(labels.includes('Second Number'), 'should have "Second Number"');
    assert.ok(labels.includes('Result'), 'should have "Result"');
    assert.ok(!labels.includes('Addend 1'), 'should not have "Addend 1"');
    assert.ok(!labels.includes('Addend 2'), 'should not have "Addend 2"');
  });

  it('subtraction uses "First Number" and "Second Number"', () => {
    const win = loadSubtraction();
    const labels = Array.from($$(win, '.mat-row-label')).map(el => el.textContent);
    assert.ok(labels.includes('First Number'), 'should have "First Number"');
    assert.ok(labels.includes('Second Number'), 'should have "Second Number"');
    assert.ok(!labels.includes('Minuend'), 'should not have "Minuend"');
    assert.ok(!labels.includes('Subtrahend'), 'should not have "Subtrahend"');
  });
});

describe('Stage 2: Mat starts expanded on first visit', () => {
  it('addition mat is expanded by default (no localStorage)', () => {
    const win = loadAddition();
    const matSection = $(win, 'matSection');
    assert.ok(!matSection.classList.contains('collapsed'), 'mat should be expanded');
  });

  it('subtraction mat is expanded by default (no localStorage)', () => {
    const win = loadSubtraction();
    const matSection = $(win, 'matSection');
    assert.ok(!matSection.classList.contains('collapsed'), 'mat should be expanded');
  });
});

describe('Stage 2: Problem counter', () => {
  it('addition shows "Solved: 0" initially', () => {
    const win = loadAddition();
    assert.equal($(win, 'problemCounter').textContent, 'Solved: 0');
  });

  it('subtraction shows "Solved: 0" initially', () => {
    const win = loadSubtraction();
    assert.equal($(win, 'problemCounter').textContent, 'Solved: 0');
  });

  it('addition counter increments on celebrate', () => {
    const win = loadAddition();
    win.celebrate();
    assert.equal($(win, 'problemCounter').textContent, 'Solved: 1');
    win.celebrate();
    assert.equal($(win, 'problemCounter').textContent, 'Solved: 2');
  });

  it('subtraction counter increments on celebrate', () => {
    const win = loadSubtraction();
    win.celebrate();
    assert.equal($(win, 'problemCounter').textContent, 'Solved: 1');
  });
});

describe('Stage 2: Hint toast CSS fix', () => {
  it('addition hint-toast has max-width and normal wrapping', () => {
    const win = loadAddition();
    // Check that the stylesheet includes the fix
    const styles = Array.from(win.document.querySelectorAll('style'));
    const cssText = styles.map(s => s.textContent).join('');
    assert.ok(cssText.includes('max-width: 90vw'), 'should have max-width');
    assert.ok(cssText.includes('white-space: normal'), 'should have white-space: normal');
  });

  it('subtraction hint-toast has max-width and normal wrapping', () => {
    const win = loadSubtraction();
    const styles = Array.from(win.document.querySelectorAll('style'));
    const cssText = styles.map(s => s.textContent).join('');
    assert.ok(cssText.includes('max-width: 90vw'), 'should have max-width');
    assert.ok(cssText.includes('white-space: normal'), 'should have white-space: normal');
  });
});

describe('Stage 2: ARIA live regions', () => {
  it('addition guide prompt has aria-live', () => {
    const win = loadAddition();
    assert.equal($(win, 'guidePrompt').getAttribute('aria-live'), 'polite');
  });

  it('addition narration bar has aria-live', () => {
    const win = loadAddition();
    assert.equal($(win, 'narrationBar').getAttribute('aria-live'), 'polite');
  });

  it('addition feedback overlay has role=alert and aria-live', () => {
    const win = loadAddition();
    assert.equal($(win, 'feedbackOverlay').getAttribute('role'), 'alert');
    assert.equal($(win, 'feedbackOverlay').getAttribute('aria-live'), 'assertive');
  });

  it('subtraction guide prompt has aria-live', () => {
    const win = loadSubtraction();
    assert.equal($(win, 'guidePrompt').getAttribute('aria-live'), 'polite');
  });

  it('subtraction narration bar has aria-live', () => {
    const win = loadSubtraction();
    assert.equal($(win, 'narrationBar').getAttribute('aria-live'), 'polite');
  });

  it('subtraction feedback overlay has role=alert and aria-live', () => {
    const win = loadSubtraction();
    assert.equal($(win, 'feedbackOverlay').getAttribute('role'), 'alert');
    assert.equal($(win, 'feedbackOverlay').getAttribute('aria-live'), 'assertive');
  });
});
