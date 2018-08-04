import createAction from './create-action';
import handleAction from './handle-action';
import reduceReducers from './reduce-reducers';

test('all together (type handle)', () => {
  const inc = createAction('inc');
  const dec = createAction('dec');
  const add = createAction<number>('add');
  const re = reduceReducers([
    handleAction<number>(inc, i => i + 1),
    handleAction<number>(dec, i => i - 1),
    handleAction<number>(add, (i, { payload = 0 }) => i + payload),
  ], 0);
  const actions = [inc(), dec(), dec(), inc(), inc(), add(5)];
  expect(actions.reduce(re, undefined)).toBe(6);
});

test('all together (type reducer)', () => {
  const inc = createAction('inc');
  const dec = createAction('dec');
  const add = createAction<number>('add');
  const re = reduceReducers([
    handleAction(inc, (i: number) => i + 1),
    handleAction(dec, (i: number) => i - 1),
    handleAction(add, (i: number, { payload = 0 }) => i + payload),
  ], 0);
  const actions = [inc(), dec(), dec(), inc(), inc()];
  expect(actions.reduce(re, undefined)).toBe(1);
});

test('all together (type reducerReducers)', () => {
  const inc = createAction('inc');
  const dec = createAction('dec');
  const add = createAction<number>('add');
  const re = reduceReducers<number>([
    handleAction(inc, i => i + 1),
    handleAction(dec, i => i - 1),
    handleAction(add, (i, { payload = 0 }) => i + payload),
  ], 0);
  const actions = [inc(), dec(), dec(), inc(), inc()];
  expect(actions.reduce(re, undefined)).toBe(1);
});
