import handleAction from './handle-action';
import createAction from './create-action';

test('handles specific action (explicit type)', () => {
  const ac1 = createAction('foo');
  const ac2 = createAction('bar');
  const re = handleAction<number>(ac1, state => state + 1);
  expect(re(1, ac1())).toBe(2);
  expect(re(1, ac2())).toBe(1);
});

test('handles specific action (inferred type)', () => {
  const ac1 = createAction('foo');
  const ac2 = createAction('bar');
  const re = handleAction(ac1, (state: number) => state + 1);
  expect(re(1, ac1())).toBe(2);
  expect(re(1, ac2())).toBe(1);
});

test('infers types of payload properties', () => {
  const ac = createAction('baz', (foo: string, bar: boolean, baz: number) => ({ foo, bar, baz }));
  const re = handleAction(ac, (state: number, { payload }) => {
    payload!.foo.toUpperCase();
    payload!.bar.valueOf();
    payload!.baz.toFixed();
    return state;
  });
  expect(re(3, ac('string', true, 3))).toBe(3);
});
