import createAction from './create-action';
import handleAction from './handle-action';
import reduceReducers from './reduce-reducers';

test('all together (type handle)', () => {
  const inc = createAction('inc');
  const dec = createAction('dec');
  const re = reduceReducers([
    handleAction<number>(inc, i => i + 1),
    handleAction<number>(dec, i => i - 1),
  ], 0);
  const actions = [inc(), dec(), dec(), inc(), inc()];
  expect(actions.reduce(re, undefined)).toBe(1);
});

test('all together (type reducer)', () => {
  const inc = createAction('inc');
  const dec = createAction('dec');
  const re = reduceReducers([
    handleAction(inc, (i: number) => i + 1),
    handleAction(dec, (i: number) => i - 1),
  ], 0);
  const actions = [inc(), dec(), dec(), inc(), inc()];
  expect(actions.reduce(re, undefined)).toBe(1);
});
