import { bindActionCreators } from 'redux';
import createAction from './create-action';

test('creates flux standard actions with constant payload creator', () => {
  const ac = createAction<string>('foo', () => 'bar');
  expect(ac()).toEqual({
    type: 'foo',
    payload: 'bar',
  });
});

test('creates flux standard actions with identity payload creator', () => {
  const ac = createAction<string, [string]>('foo');
  expect(ac('bar')).toEqual({
    type: 'foo',
    payload: 'bar',
  });
});

test('creates flux standard actions with untyped identity payload creator', () => {
  const ac = createAction<string>('foo');
  expect(ac('bar')).toEqual({
    type: 'foo',
    payload: 'bar',
  });
});

test('create flux standard actions with explicit payload creator', () => {
  const ac = createAction<string, [number]>('foo', num => `${num}`);
  expect(ac(4)).toEqual({
    type: 'foo',
    payload: '4',
  });
});

test('create flux standard actions with explicit payload creator (many args)', () => {
  const ac = createAction<string, [number, boolean, string]>('foo', num => `${num * 2}`);
  expect(ac(4, true, 'bar')).toEqual({
    type: 'foo',
    payload: '8',
  });
});

test('creates an error action when given an error', () => {
  const ac = createAction<string>('foo');
  const error = new Error('Foo Error');
  expect(ac(error)).toEqual({
    type: 'foo',
    error,
  });
});

test('creates an error action when given an error', () => {
  const ac = createAction<string, [string]>('foo', str => str.toUpperCase());
  const error = new Error('Foo Error');
  expect(ac(error)).toEqual({
    type: 'foo',
    error,
  });
});

test('works with bindActionCreators from redux', () => {
  const ac1 = createAction<string>('foo', () => 'baz');
  const ac2 = createAction<string, [string]>('bar', s => s);
  const acs = bindActionCreators({
    ac1,
    ac2,
  }, (action) => {
    expect(action.type).toBe('foo');
    return action;
  });
  acs.ac1();
});

test('infers types and supports errors', () => {
  const error = new Error('The Error');
  const ac1 = createAction('foo');
  expect(ac1()).toEqual({
    type: 'foo',
  });
  expect(ac1(error)).toEqual({
    type: 'foo',
    error,
  });
  const ac2 = createAction('bar', (str: string) => str.toUpperCase());
  expect(ac2('baz')).toEqual({
    type: 'bar',
    payload: 'BAZ',
  });
  expect(ac2(error)).toEqual({
    type: 'bar',
    error,
  });
  const ac3 = createAction('baz', (str: string, flag?: boolean) => (flag ? str.toUpperCase() : str));
  expect(ac3('foo', true)).toEqual({
    type: 'baz',
    payload: 'FOO',
  });
  expect(ac3('foo')).toEqual({
    type: 'baz',
    payload: 'foo',
  });
  expect(ac3(error)).toEqual({
    type: 'baz',
    error,
  });
});

test('toString', () => {
  expect(createAction('foo').toString()).toBe('foo');
});
