import test from 'ava';

import { createFetchingProgressReducer, createErrorMessageReducer } from '../../src/reducers/common';

test('progress reducer', (t) => {
  const progress = createFetchingProgressReducer('REQ', 'SUCC', 'FAIL');
  t.true(progress(null, { type: 'REQ' }));
  t.false(progress(null, { type: 'SUCC' }));
  t.false(progress(null, { type: 'FAIL' }));
});

test('status message reducer', (t) => {
  const errorMsg = createErrorMessageReducer('REQ', 'SUCC', 'FAIL');
  t.is(null, errorMsg(null, { type: 'REQ' }));
  t.is(null, errorMsg(null, { type: 'SUCC' }));
  t.is('test', errorMsg(null, {
    type: 'FAIL',
    statusText: 'test',
  }));
});
