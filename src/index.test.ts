import createAction from './create-action';
import handleAction from './handle-action';
import reduceReducers from './reduce-reducers';
import * as index from '.';

test('interface', () => {
  expect(index.createAction).toBe(createAction);
  expect(index.handleAction).toBe(handleAction);
  expect(index.reduceReducers).toBe(reduceReducers);
});
