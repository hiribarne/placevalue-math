const { describe, it } = require('node:test');
const assert = require('node:assert');
const { loadAddition, loadSubtraction } = require('./setup');

function $(win, id) { return win.document.getElementById(id); }
function getState(win) { return win.eval('state'); }

// ── Number Line ──
describe('Stage 4: Number line', () => {
  it('addition has numline section', () => {
    const win = loadAddition();
    assert.ok($(win, 'numlineSection'), 'Should have numlineSection');
    assert.ok($(win, 'numlineSvg'), 'Should have numlineSvg');
  });

  it('subtraction has numline section', () => {
    const win = loadSubtraction();
    assert.ok($(win, 'numlineSection'), 'Should have numlineSection');
    assert.ok($(win, 'numlineSvg'), 'Should have numlineSvg');
  });

  it('addition numline starts collapsed', () => {
    const win = loadAddition();
    assert.ok($(win, 'numlineSection').classList.contains('collapsed'));
  });

  it('addition renderNumberLine draws SVG content', () => {
    const win = loadAddition();
    const st = getState(win);
    st.numlineCollapsed = false;
    st.num1 = 23; st.num2 = 14;
    win.renderNumberLine();
    const svg = $(win, 'numlineSvg');
    assert.ok(svg.innerHTML.length > 0, 'SVG should have content');
    assert.ok(svg.innerHTML.includes('+14'), 'Should show +14 jump label');
  });

  it('subtraction renderNumberLine draws SVG with minus label', () => {
    const win = loadSubtraction();
    const st = getState(win);
    st.numlineCollapsed = false;
    st.num1 = 87; st.num2 = 23;
    win.renderNumberLine();
    const svg = $(win, 'numlineSvg');
    assert.ok(svg.innerHTML.length > 0, 'SVG should have content');
    assert.ok(svg.innerHTML.includes('\u221223') || svg.innerHTML.includes('-23'), 'Should show minus jump label');
  });

  it('addition numline toggle works', () => {
    const win = loadAddition();
    assert.ok($(win, 'numlineSection').classList.contains('collapsed'));
    $(win, 'numlineToggle').click();
    assert.ok(!$(win, 'numlineSection').classList.contains('collapsed'));
  });
});

// ── Expanded Notation ──
describe('Stage 4: Expanded notation', () => {
  it('addition has expanded section', () => {
    const win = loadAddition();
    assert.ok($(win, 'expandedSection'));
    assert.ok($(win, 'expandedBody'));
  });

  it('subtraction has expanded section', () => {
    const win = loadSubtraction();
    assert.ok($(win, 'expandedSection'));
    assert.ok($(win, 'expandedBody'));
  });

  it('addition expanded starts collapsed', () => {
    const win = loadAddition();
    assert.ok($(win, 'expandedSection').classList.contains('collapsed'));
  });

  it('addition expandedNotationStr breaks down 345', () => {
    const win = loadAddition();
    const html = win.expandedNotationStr(345);
    assert.ok(html.includes('345'), 'Should contain original number');
    assert.ok(html.includes('300'), 'Should contain hundreds');
    assert.ok(html.includes('40'), 'Should contain tens');
    assert.ok(html.includes('5'), 'Should contain ones');
  });

  it('subtraction expandedNotationStr handles 50 (no ones)', () => {
    const win = loadSubtraction();
    const html = win.expandedNotationStr(50);
    assert.ok(html.includes('50'), 'Should contain original number');
  });

  it('addition expanded toggle works', () => {
    const win = loadAddition();
    assert.ok($(win, 'expandedSection').classList.contains('collapsed'));
    $(win, 'expandedToggle').click();
    assert.ok(!$(win, 'expandedSection').classList.contains('collapsed'));
  });

  it('addition renderExpandedNotation fills body', () => {
    const win = loadAddition();
    const st = getState(win);
    st.expandedCollapsed = false;
    st.num1 = 23; st.num2 = 14;
    win.renderExpandedNotation();
    const body = $(win, 'expandedBody');
    assert.ok(body.innerHTML.includes('23'), 'Should contain 23');
    assert.ok(body.innerHTML.includes('14'), 'Should contain 14');
    assert.ok(body.innerHTML.includes('37'), 'Should contain result 37');
  });
});

// ── Adaptive Difficulty ──
describe('Stage 4: Adaptive difficulty', () => {
  it('addition state starts with streak 0', () => {
    const win = loadAddition();
    assert.strictEqual(getState(win).streak, 0);
  });

  it('subtraction state starts with streak 0', () => {
    const win = loadSubtraction();
    assert.strictEqual(getState(win).streak, 0);
  });

  it('addition has difficulty-suggestion CSS', () => {
    const win = loadAddition();
    const styles = Array.from(win.document.querySelectorAll('style'));
    assert.ok(styles.some(s => s.textContent.includes('.difficulty-suggestion')));
  });

  it('addition checkAdaptiveDifficulty shows suggestion after 5 correct on easy', () => {
    const win = loadAddition();
    const st = getState(win);
    st.difficulty = 'easy';
    st.streak = 5;
    win.checkAdaptiveDifficulty();
    const suggestion = win.document.querySelector('.difficulty-suggestion');
    assert.ok(suggestion, 'Should show suggestion');
    assert.ok(suggestion.textContent.includes('Medium'), 'Should suggest Medium');
    suggestion.remove();
  });

  it('addition checkAdaptiveDifficulty shows suggestion after 3 wrong on hard', () => {
    const win = loadAddition();
    const st = getState(win);
    st.difficulty = 'hard';
    st.streak = -3;
    win.checkAdaptiveDifficulty();
    const suggestion = win.document.querySelector('.difficulty-suggestion');
    assert.ok(suggestion, 'Should show suggestion');
    assert.ok(suggestion.textContent.includes('Medium'), 'Should suggest Medium');
    suggestion.remove();
  });

  it('addition no suggestion when streak not enough', () => {
    const win = loadAddition();
    const st = getState(win);
    st.difficulty = 'medium';
    st.streak = 2;
    win.checkAdaptiveDifficulty();
    assert.strictEqual(win.document.querySelector('.difficulty-suggestion'), null);
  });

  it('subtraction checkAdaptiveDifficulty works', () => {
    const win = loadSubtraction();
    const st = getState(win);
    st.difficulty = 'easy';
    st.streak = 5;
    win.checkAdaptiveDifficulty();
    const suggestion = win.document.querySelector('.difficulty-suggestion');
    assert.ok(suggestion);
    suggestion.remove();
  });
});

// ── Estimation Prompt ──
describe('Stage 4: Estimation prompt', () => {
  it('addition has estimate prompt elements', () => {
    const win = loadAddition();
    assert.ok($(win, 'estimatePrompt'));
    assert.ok($(win, 'estimateInput'));
    assert.ok($(win, 'estimateResult'));
  });

  it('subtraction has estimate prompt elements', () => {
    const win = loadSubtraction();
    assert.ok($(win, 'estimatePrompt'));
    assert.ok($(win, 'estimateInput'));
    assert.ok($(win, 'estimateResult'));
  });

  it('addition estimate prompt shown after newProblem', () => {
    const win = loadAddition();
    assert.strictEqual(getState(win).estimateShown, true);
    assert.ok($(win, 'estimatePrompt').classList.contains('show'));
  });

  it('addition dismissEstimate hides prompt', () => {
    const win = loadAddition();
    win.dismissEstimate();
    assert.strictEqual(getState(win).estimateShown, false);
    assert.ok(!$(win, 'estimatePrompt').classList.contains('show'));
  });

  it('addition checkEstimate with close answer shows "Close!"', () => {
    const win = loadAddition();
    const st = getState(win);
    st.num1 = 50; st.num2 = 30;
    $(win, 'estimateInput').value = '82'; // actual is 80, within 20%
    win.checkEstimate();
    assert.strictEqual($(win, 'estimateResult').textContent, 'Close!');
  });

  it('addition checkEstimate with far answer shows "Not quite!"', () => {
    const win = loadAddition();
    const st = getState(win);
    st.num1 = 50; st.num2 = 30;
    $(win, 'estimateInput').value = '200'; // actual is 80, way off
    win.checkEstimate();
    assert.strictEqual($(win, 'estimateResult').textContent, 'Not quite!');
  });

  it('subtraction checkEstimate works', () => {
    const win = loadSubtraction();
    const st = getState(win);
    st.num1 = 87; st.num2 = 23;
    $(win, 'estimateInput').value = '65'; // actual is 64, close
    win.checkEstimate();
    assert.strictEqual($(win, 'estimateResult').textContent, 'Close!');
  });
});
