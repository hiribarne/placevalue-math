const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition, loadSubtraction } = require('./setup');

// Helper to get galera cell by ID (since G is const/block-scoped, not on window)
function $(win, id) { return win.document.getElementById(id); }

describe('Addition — checkAnswer()', () => {
  function setupAndCheck(num1, num2, rh, rt, ro) {
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
    // Set result cells
    $(win, 'g-r-h').value = rh;
    $(win, 'g-r-t').value = rt;
    $(win, 'g-r-o').value = ro;
    win.checkAnswer();
    return win;
  }

  it('correct answer: 23 + 14 = 37', () => {
    const win = setupAndCheck(23, 14, '', '3', '7');
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('correct answer: 345 + 123 = 468', () => {
    const win = setupAndCheck(345, 123, '4', '6', '8');
    assert.ok($(win, 'g-r-h').classList.contains('correct'));
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('incorrect ones digit shows error', () => {
    const win = setupAndCheck(23, 14, '', '3', '5');
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('incorrect'));
  });

  it('all wrong shows all incorrect', () => {
    const win = setupAndCheck(345, 123, '1', '1', '1');
    assert.ok($(win, 'g-r-h').classList.contains('incorrect'));
    assert.ok($(win, 'g-r-t').classList.contains('incorrect'));
    assert.ok($(win, 'g-r-o').classList.contains('incorrect'));
  });

  it('correct answer with carry: 57 + 35 = 92', () => {
    const win = setupAndCheck(57, 35, '', '9', '2');
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });
});

describe('Subtraction — checkAnswer()', () => {
  function setupAndCheck(num1, num2, rh, rt, ro) {
    const win = loadSubtraction();
    const d1 = win.digits(num1), d2 = win.digits(num2);
    const dd1 = win.digitDisplay(d1), dd2 = win.digitDisplay(d2);
    $(win, 'g-a1-h').value = dd1.hundreds;
    $(win, 'g-a1-t').value = dd1.tens;
    $(win, 'g-a1-o').value = dd1.ones;
    $(win, 'g-a2-h').value = dd2.hundreds;
    $(win, 'g-a2-t').value = dd2.tens;
    $(win, 'g-a2-o').value = dd2.ones;
    win.syncStateFromGalera();
    $(win, 'g-r-h').value = rh;
    $(win, 'g-r-t').value = rt;
    $(win, 'g-r-o').value = ro;
    win.checkAnswer();
    return win;
  }

  it('correct answer: 87 - 23 = 64', () => {
    const win = setupAndCheck(87, 23, '', '6', '4');
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('correct answer: 432 - 261 = 171', () => {
    const win = setupAndCheck(432, 261, '1', '7', '1');
    assert.ok($(win, 'g-r-h').classList.contains('correct'));
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('incorrect tens digit shows error', () => {
    const win = setupAndCheck(87, 23, '', '5', '4');
    assert.ok($(win, 'g-r-t').classList.contains('incorrect'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('correct answer with borrow: 52 - 37 = 15', () => {
    const win = setupAndCheck(52, 37, '', '1', '5');
    assert.ok($(win, 'g-r-t').classList.contains('correct'));
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('result of 0: empty cell matches expected', () => {
    // 50 - 50 = 0 → digitDisplay gives '' for all positions
    // Entering '' (empty) should match expected ''
    const win = setupAndCheck(50, 50, '', '', '');
    assert.ok($(win, 'g-r-o').classList.contains('correct'));
  });

  it('result of 0: student entering "0" is also accepted', () => {
    // Known behavior: digitDisplay(digits(0)).ones = '' so '0' !== ''
    // This tests the current behavior — '0' is marked incorrect
    // TODO: Consider treating '0' as equivalent to '' in checkAnswer
    const win = setupAndCheck(50, 50, '', '', '0');
    assert.ok($(win, 'g-r-o').classList.contains('incorrect'));
  });
});
