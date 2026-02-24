const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition, loadSubtraction } = require('./setup');

function $(win, id) { return win.document.getElementById(id); }

describe('Stage 1: Enter-to-check in result row', () => {
  it('addition: Enter on result cell triggers checkAnswer', () => {
    const win = loadAddition();
    // Set up a problem: 23 + 14 = 37
    $(win, 'g-a1-t').value = '2'; $(win, 'g-a1-o').value = '3';
    $(win, 'g-a2-t').value = '1'; $(win, 'g-a2-o').value = '4';
    win.syncStateFromGalera();
    // Fill correct result
    $(win, 'g-r-t').value = '3'; $(win, 'g-r-o').value = '7';
    // Simulate Enter keydown on result ones cell
    const event = new win.KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    $(win, 'g-r-o').dispatchEvent(event);
    // Should be marked correct
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('subtraction: Enter on result cell triggers checkAnswer', () => {
    const win = loadSubtraction();
    // Set up: 87 - 23 = 64
    $(win, 'g-a1-t').value = '8'; $(win, 'g-a1-o').value = '7';
    $(win, 'g-a2-t').value = '2'; $(win, 'g-a2-o').value = '3';
    win.syncStateFromGalera();
    $(win, 'g-r-t').value = '6'; $(win, 'g-r-o').value = '4';
    const event = new win.KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    $(win, 'g-r-o').dispatchEvent(event);
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });
});

describe('Stage 1: Carry validation on Check (Addition)', () => {
  function setup(num1, num2) {
    const win = loadAddition();
    const d1 = win.digits(num1), d2 = win.digits(num2);
    const dd1 = win.digitDisplay(d1), dd2 = win.digitDisplay(d2);
    $(win, 'g-a1-h').value = dd1.hundreds;
    $(win, 'g-a1-t').value = dd1.tens;
    $(win, 'g-a1-o').value = dd1.ones;
    $(win, 'g-a2-h').value = dd2.hundreds;
    $(win, 'g-a2-t').value = dd2.tens;
    $(win, 'g-a2-o').value = dd2.ones;
    win.syncStateFromGalera();
    return win;
  }

  it('correct carry marked correct: 57 + 35 (carry tens = 1)', () => {
    const win = setup(57, 35);
    // Fill correct answer: 92 with carry-t = 1
    $(win, 'g-r-t').value = '9'; $(win, 'g-r-o').value = '2';
    $(win, 'carry-t').value = '1';
    win.checkAnswer();
    assert.ok($(win, 'carry-t').classList.contains('correct'));
  });

  it('wrong carry marked incorrect: 57 + 35 (carry tens should be 1, entered 0)', () => {
    const win = setup(57, 35);
    $(win, 'g-r-t').value = '9'; $(win, 'g-r-o').value = '2';
    $(win, 'carry-t').value = '0';
    win.checkAnswer();
    assert.ok($(win, 'carry-t').classList.contains('incorrect'));
  });

  it('empty carry with no carry needed: no feedback shown', () => {
    const win = setup(23, 14);
    $(win, 'g-r-t').value = '3'; $(win, 'g-r-o').value = '7';
    // carry-t left empty (correct — no carry needed)
    win.checkAnswer();
    assert.ok(!$(win, 'carry-t').classList.contains('correct'));
    assert.ok(!$(win, 'carry-t').classList.contains('incorrect'));
  });

  it('entering carry where none needed marked incorrect', () => {
    const win = setup(23, 14);
    $(win, 'g-r-t').value = '3'; $(win, 'g-r-o').value = '7';
    $(win, 'carry-t').value = '1'; // Wrong — no carry needed
    win.checkAnswer();
    assert.ok($(win, 'carry-t').classList.contains('incorrect'));
  });

  it('double carry both marked correctly', () => {
    const win = setup(187, 345);
    // 187 + 345 = 532, carry-t = 1, carry-h = 1
    $(win, 'g-r-h').value = '5'; $(win, 'g-r-t').value = '3'; $(win, 'g-r-o').value = '2';
    $(win, 'carry-t').value = '1'; $(win, 'carry-h').value = '1';
    win.checkAnswer();
    assert.ok($(win, 'carry-t').classList.contains('correct'));
    assert.ok($(win, 'carry-h').classList.contains('correct'));
  });
});
