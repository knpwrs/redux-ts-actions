import createAction from './create-action';
import * as index from '.';

test('interface', () => {
  expect(index.createAction).toBe(createAction);
});
