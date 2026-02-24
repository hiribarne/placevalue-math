const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition, loadSubtraction } = require('./setup');

// jsdom objects live in a different realm, so deepEqual fails on cross-realm comparison.
// Use JSON roundtrip to normalize.
function j(obj) { return JSON.parse(JSON.stringify(obj)); }

describe('digits()', () => {
  const win = loadAddition();

  it('decomposes a 3-digit number', () => {
    assert.deepEqual(j(win.digits(345)), { hundreds: 3, tens: 4, ones: 5 });
  });

  it('decomposes a 2-digit number', () => {
    assert.deepEqual(j(win.digits(72)), { hundreds: 0, tens: 7, ones: 2 });
  });

  it('decomposes a 1-digit number', () => {
    assert.deepEqual(j(win.digits(5)), { hundreds: 0, tens: 0, ones: 5 });
  });

  it('decomposes zero', () => {
    assert.deepEqual(j(win.digits(0)), { hundreds: 0, tens: 0, ones: 0 });
  });

  it('decomposes 100', () => {
    assert.deepEqual(j(win.digits(100)), { hundreds: 1, tens: 0, ones: 0 });
  });

  it('decomposes 999', () => {
    assert.deepEqual(j(win.digits(999)), { hundreds: 9, tens: 9, ones: 9 });
  });

  it('decomposes 10', () => {
    assert.deepEqual(j(win.digits(10)), { hundreds: 0, tens: 1, ones: 0 });
  });
});

describe('digitDisplay()', () => {
  const win = loadAddition();

  it('displays 3-digit number with all positions', () => {
    const d = win.digitDisplay(win.digits(345));
    assert.equal(d.hundreds, 3);
    assert.equal(d.tens, '4');
    assert.equal(d.ones, '5');
  });

  it('hides leading zeros for 2-digit numbers', () => {
    const d = win.digitDisplay(win.digits(72));
    assert.equal(d.hundreds, '');
    assert.equal(d.tens, 7);
    assert.equal(d.ones, '2');
  });

  it('hides leading zeros for 1-digit numbers', () => {
    const d = win.digitDisplay(win.digits(5));
    assert.equal(d.hundreds, '');
    assert.equal(d.tens, '');
    assert.equal(d.ones, 5);
  });

  it('shows zero as empty for zero number', () => {
    const d = win.digitDisplay(win.digits(0));
    assert.equal(d.hundreds, '');
    assert.equal(d.tens, '');
    assert.equal(d.ones, '');
  });

  it('displays 100 with zero in tens and ones', () => {
    const d = win.digitDisplay(win.digits(100));
    assert.equal(d.hundreds, 1);
    assert.equal(d.tens, '0');
    assert.equal(d.ones, '0');
  });

  it('displays 300 with zero in tens and ones', () => {
    const d = win.digitDisplay(win.digits(300));
    assert.equal(d.hundreds, 3);
    assert.equal(d.tens, '0');
    assert.equal(d.ones, '0');
  });

  it('displays 50 with zero in ones', () => {
    const d = win.digitDisplay(win.digits(50));
    assert.equal(d.hundreds, '');
    assert.equal(d.tens, 5);
    assert.equal(d.ones, '0');
  });
});

describe('randInt()', () => {
  const win = loadAddition();

  it('returns values within range', () => {
    for (let i = 0; i < 100; i++) {
      const v = win.randInt(1, 10);
      assert.ok(v >= 1 && v <= 10, `${v} should be between 1 and 10`);
    }
  });

  it('returns exact value when min equals max', () => {
    assert.equal(win.randInt(5, 5), 5);
  });
});

describe('digits() — subtraction file', () => {
  const win = loadSubtraction();

  it('decomposes same as addition', () => {
    assert.deepEqual(j(win.digits(345)), { hundreds: 3, tens: 4, ones: 5 });
    assert.deepEqual(j(win.digits(0)), { hundreds: 0, tens: 0, ones: 0 });
  });
});
