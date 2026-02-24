const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition, loadSubtraction } = require('./setup');

function $(win, id) { return win.document.getElementById(id); }

function clearCells(win) {
  ['g-a1-h','g-a1-t','g-a1-o','g-a2-h','g-a2-t','g-a2-o','g-r-h','g-r-t','g-r-o'].forEach(id => {
    $(win, id).value = '';
  });
}

describe('Calculator-style entry — Addition', () => {
  let win;

  beforeEach(() => {
    win = loadAddition();
    clearCells(win);
  });

  describe('pushDigit()', () => {
    it('first digit goes to ones', () => {
      win.pushDigit('a1', '5');
      assert.equal($(win, 'g-a1-o').value, '5');
      assert.equal($(win, 'g-a1-t').value, '');
      assert.equal($(win, 'g-a1-h').value, '');
    });

    it('second digit shifts first to tens', () => {
      win.pushDigit('a1', '5');
      win.pushDigit('a1', '3');
      assert.equal($(win, 'g-a1-o').value, '3');
      assert.equal($(win, 'g-a1-t').value, '5');
      assert.equal($(win, 'g-a1-h').value, '');
    });

    it('third digit shifts to hundreds', () => {
      win.pushDigit('a1', '1');
      win.pushDigit('a1', '2');
      win.pushDigit('a1', '3');
      assert.equal($(win, 'g-a1-o').value, '3');
      assert.equal($(win, 'g-a1-t').value, '2');
      assert.equal($(win, 'g-a1-h').value, '1');
    });

    it('fourth digit is ignored (max 3)', () => {
      win.pushDigit('a1', '1');
      win.pushDigit('a1', '2');
      win.pushDigit('a1', '3');
      win.pushDigit('a1', '4');
      assert.equal($(win, 'g-a1-o').value, '3');
      assert.equal($(win, 'g-a1-t').value, '2');
      assert.equal($(win, 'g-a1-h').value, '1');
    });

    it('works on a2 prefix', () => {
      win.pushDigit('a2', '7');
      win.pushDigit('a2', '8');
      assert.equal($(win, 'g-a2-o').value, '8');
      assert.equal($(win, 'g-a2-t').value, '7');
    });
  });

  describe('popDigit()', () => {
    it('removes ones digit', () => {
      win.pushDigit('a1', '5');
      win.popDigit('a1');
      assert.equal($(win, 'g-a1-o').value, '');
    });

    it('shifts tens back to ones on pop', () => {
      win.pushDigit('a1', '5');
      win.pushDigit('a1', '3');
      win.popDigit('a1');
      assert.equal($(win, 'g-a1-o').value, '5');
      assert.equal($(win, 'g-a1-t').value, '');
    });

    it('shifts hundreds back through', () => {
      win.pushDigit('a1', '1');
      win.pushDigit('a1', '2');
      win.pushDigit('a1', '3');
      win.popDigit('a1');
      assert.equal($(win, 'g-a1-o').value, '2');
      assert.equal($(win, 'g-a1-t').value, '1');
      assert.equal($(win, 'g-a1-h').value, '');
    });

    it('pop on empty does nothing', () => {
      win.popDigit('a1');
      assert.equal($(win, 'g-a1-o').value, '');
      assert.equal($(win, 'g-a1-t').value, '');
      assert.equal($(win, 'g-a1-h').value, '');
    });
  });

  describe('shiftDigitLeft()', () => {
    it('shifts ones to tens, tens to hundreds', () => {
      $(win, 'g-a1-o').value = '5';
      $(win, 'g-a1-t').value = '3';
      win.shiftDigitLeft('a1');
      assert.equal($(win, 'g-a1-h').value, '3');
      assert.equal($(win, 'g-a1-t').value, '5');
      assert.equal($(win, 'g-a1-o').value, '');
    });
  });

  describe('shiftDigitRight()', () => {
    it('shifts hundreds to tens, tens to ones', () => {
      $(win, 'g-a1-h').value = '1';
      $(win, 'g-a1-t').value = '2';
      $(win, 'g-a1-o').value = '3';
      win.shiftDigitRight('a1');
      assert.equal($(win, 'g-a1-h').value, '');
      assert.equal($(win, 'g-a1-t').value, '1');
      assert.equal($(win, 'g-a1-o').value, '2');
    });
  });
});

describe('Calculator-style entry — Subtraction', () => {
  let win;

  beforeEach(() => {
    win = loadSubtraction();
    clearCells(win);
  });

  describe('pushDigit()', () => {
    it('builds up a 3-digit number', () => {
      win.pushDigit('a1', '3');
      win.pushDigit('a1', '0');
      win.pushDigit('a1', '0');
      assert.equal($(win, 'g-a1-h').value, '3');
      assert.equal($(win, 'g-a1-t').value, '0');
      assert.equal($(win, 'g-a1-o').value, '0');
    });
  });

  describe('popDigit()', () => {
    it('reverses digits correctly', () => {
      win.pushDigit('a1', '3');
      win.pushDigit('a1', '0');
      win.pushDigit('a1', '0');
      win.popDigit('a1');
      assert.equal($(win, 'g-a1-h').value, '');
      assert.equal($(win, 'g-a1-t').value, '3');
      assert.equal($(win, 'g-a1-o').value, '0');
    });
  });
});
