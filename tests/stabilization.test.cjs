const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { runtime, ROOT, KEY, MARKER } = require('./helpers/runtime.cjs');

function startCase(index = 0) {
  const r = runtime({ seed: { [MARKER]: '1' } });
  // Fixture: earlier cases completed, as required by the sequential map.
  r.run(`MP().completed=Array.from({length:${index}},(_,i)=>i);MP().results=MP().completed.map(i=>({i,name:C()[i].name,action:C()[i].answer,correct:true,scores:{listen:100,criterion:100,conversation:90,recommendation:100}}));S.view='map';startClient(${index});beginChat()`);
  return r;
}
function choice(r, index) {
  r.run(r.context.ACADEMY_PHASE1
    ? `chooseLine(MP().node+':${index}',actionToken('chat'))`
    : `chooseLine(${index})`);
  r.advance();
}
function decision(r, action) {
  r.run(r.context.ACADEMY_PHASE1
    ? `decide(${JSON.stringify(action)},actionToken('decision'))`
    : `decide(${JSON.stringify(action)})`);
}

test('legacy M01 content remains unchanged (ignoring checkout line endings)', () => {
  const hashes = {
    'data/clients.js': '3e34ce97c90cff0c1cef652a09d8ddc6b06f5e34e273a2fb48afb69e76ddf594',
    'data/modules.js': 'cabdfabb5d00e150ea3ea81588923f823f608f9bf8ba54ec1d0215cc2b5058be',
    'data/products.js': '7a05fcbc58cd7b7b53f2b5dc7c8dadbd155046f8168cf4a9d807e17d78a21c4d'
  };
  for (const [file, expected] of Object.entries(hashes)) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
    assert.equal(actual, expected, file);
  }
});

test('effective legacy outcomes for every complete conversation route and terminal action', () => {
  const rows = [];
  for (let c = 0; c < 6; c++) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let d = 0; d < 2; d++) {
    for (const action of ['RECOMMEND_PRODUCT', 'RECOMMEND_CATEGORY', 'DEFER_SUPPLEMENT']) {
      const r = startCase(c);
      for (const i of [a, b, d]) choice(r, i);
      if (r.run('!!MP().lostPending')) {
        rows.push([c, a, b, d, action, r.json('MP().lostPending')]);
      } else {
        decision(r, action);
        const pending = r.json('MP().pending');
        delete pending.unlockAt;
        rows.push([c, a, b, d, action, pending]);
      }
    }
  }
  assert.equal(rows.length, 324);
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex'), 'ab9f435946e2bfe4f12c1777d9aee0db8c570a7cce207001a7af501d41307977');
});

test('effective legacy early outcomes include zero-question override and partial context', () => {
  const rows = [];
  for (let c = 0; c < 6; c++) for (const first of [null, 0, 1, 2]) {
    for (const action of ['RECOMMEND_PRODUCT', 'RECOMMEND_CATEGORY', 'DEFER_SUPPLEMENT']) {
      const r = startCase(c);
      if (first !== null) choice(r, first);
      decision(r, action);
      const pending = r.json('MP().pending');
      delete pending.unlockAt;
      rows.push([c, first, action, pending]);
    }
  }
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex'), '05f71570fb7764cfdf4096afb302d21550927744933d3d3c0362254cbf35822c');
});

test('legacy ASK_MORE is non-terminal, including at the end of the fixed tree', () => {
  const r = startCase();
  decision(r, 'ASK_MORE');
  assert.equal(r.run('S.view'), 'chat');
  assert.equal(r.run('MP().pending'), null);
  for (const i of [0, 0, 0]) choice(r, i);
  decision(r, 'ASK_MORE');
  assert.equal(r.run('S.view'), 'chat');
  assert.equal(r.run('MP().node'), 'end');
  assert.equal(r.run('MP().completed.length'), 0);
});

test('legacy aggregate weights, rank boundaries, and Boss Check bonus remain unchanged', () => {
  const r = startCase();
  r.run('MP().results=[{i:0,scores:{listen:40,criterion:60,conversation:80,recommendation:100}}];MP().bossCheck=0');
  assert.deepEqual(r.json('scoreSummary()'), { listen: 40, criterion: 65, conversation: 80, recommendation: 100, total: 70, rank: 'OBSERVADOR' });
  for (const [n, rank] of [[67,'NOVATO'],[68,'OBSERVADOR'],[79,'OBSERVADOR'],[80,'DETECTOR'],[89,'DETECTOR'],[90,'ASESOR']]) {
    r.run(`MP().bossCheck=null;MP().results=[{i:0,scores:{listen:${n},criterion:${n},conversation:${n},recommendation:${n}}}]`);
    assert.equal(r.run('scoreSummary().rank'), rank);
  }
});

module.exports = { startCase, choice, decision };
