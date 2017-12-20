import '../helpers/setup';
import { createFetchingProgressReducer, createErrorMessageReducer } from '../../src/reducers/common';

test('progress reducer', () => {
  const progress = createFetchingProgressReducer('REQ', 'SUCC', 'FAIL');
  expect(progress(null, { type: 'REQ' })).toBeTruthy();
  expect(progress(null, { type: 'SUCC' })).toBeFalsy();
  expect(progress(null, { type: 'FAIL' })).toBeFalsy();
});

test('status message reducer', () => {
  const errorMsg = createErrorMessageReducer('REQ', 'SUCC', 'FAIL');
  expect(errorMsg(null, { type: 'REQ' })).toBeNull();
  expect(errorMsg(null, { type: 'SUCC' })).toBeNull();
  expect(errorMsg(null, {
    type: 'FAIL',
    statusText: 'test',
  })).toBe('test');
});
