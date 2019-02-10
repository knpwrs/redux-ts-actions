# DEPRECATED IN FAVOR OF [`redux-ts-utils`][utils]. PLEASE USE THAT LIBRARY!

# redux-ts-actions

[![Dependency Status](https://img.shields.io/david/knpwrs/redux-ts-actions.svg)](https://david-dm.org/knpwrs/redux-ts-actions)
[![devDependency Status](https://img.shields.io/david/dev/knpwrs/redux-ts-actions.svg)](https://david-dm.org/knpwrs/redux-ts-actions#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/knpwrs/redux-ts-actions.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/knpwrs/redux-ts-actions.svg)](https://travis-ci.org/knpwrs/redux-ts-actions)
[![Npm Version](https://img.shields.io/npm/v/redux-ts-actions.svg)](https://www.npmjs.com/package/redux-ts-actions)
[![TypeScript 3](https://img.shields.io/badge/TypeScript-3-blue.svg)](http://shields.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Badges](https://img.shields.io/badge/badges-8-orange.svg)](http://shields.io/)

Type-safe action creators and reducers for redux. Action creators infer input
and payload types and reducers infer payload type based on respective action
creators. Requires TypeScript 3+.

## Example Usage

```ts
import {
  createAction,
  handleAction,
  reduceReducers,
} from 'redux-ts-actions';

// Action Creators
const setName = createAction('user/SET_NAME', (id: string, name: string) => ({ id, name }));
const incrementFollowers = createAction<string>('user/INCREMENT_FOLLOWERS');

// Users Reducer
interface User {
  readonly name: string,
  readonly followers: number,
}
interface State {
  readonly [id: string]: User;
}

const initialState: State = {};
const emptyUser: User = { name: '', followers: 0 };

const reducer = reduceReducers<State>([
  handleAction(setName, (state, { payload }) => ({
    ...state,
    [payload!.id]: {
      ...(state[payload!.id] || emptyUser),
      name: payload!.name,
    },
  })),
  handleAction(incrementFollowers, (state, { payload }) => ({
    ...state,
    [payload!]: {
      ...(state[payload!] || emptyUser),
      followers: state[payload!].followers + 1,
    },
  })),
], initialState);

// Use the reducer:
[setName('id-1', 'Ken'), incrementFollowers('id-1')].reduce(reducer, undefined);
```

## API

### `createAction`

This function creates an action creator. It optionally accepts a payload
customizer function. The payload type of the resulting action creator and the
arguments the action creator accepts are inferred from the payload creator function.

```ts
import { createAction } from 'redux-ts-actions';

interface User {
  readonly name: string;
  readonly followers: number;
}

// Fully-implicit typing
const createUser = createAction('user/CREATE_USER', (name: string, followers: number) => ({ name, followers }));
createUser('Ken', 15); // Compiles and returns an object with a known shape of { type: 'user/CREATE_USER', payload?: User }
createUser('Ken', false); // Fails to compile. `boolean` is not assignable to `number`.

// Identity typing
const createUser = createAction<User>('user/CREATE_USER');
createUser({ name: 'Ken', followers: 15 }); // Compiles and returns the same object as before
createUser({ name: 'Ken', followers: false }); // Fails to compile. `boolean` is not assignable to `number`.

// Fully-explicit typing
const createUser = createAction<User, string, number>('user/CREATE_USER', (name, followers) => ({ name, followers }));
createUser('Ken', 15); // Compiles and returns an object with a known shape of { type: 'user/CREATE_USER', payload?: { name, followers }}
createUser('Ken', false); // Fails to compile. `boolean` is not assignable to `number`.

// No Payload
const increment = createAction('inc');
increment(); // Creates an action with no payload

// Error Handling
// All of the above action creators can accept an Error as their only argument.
// Payload customizers will not be called and the resulting actions will have
// their `error` property set to `true` and their payload will be the error
// object.
createUser(new Error('Foo')); // { type: 'user/CREATE_USER', payload?: Error, error: true }
```

### `handleAction`

This function creates a type-safe reducer given an action creator and a reducer
function. The state argument must be typed (unless this is used in the context
of `reduceReducers` documented below) but the action argument will be inferred
based on the action creator.

```ts
import { handleAction } from 'redux-ts-actions';

const reducer = handleAction(createUser, (state: State, action) => {
  // action.payload is `User | undefined`
});

// Or

const reducer = handleAction<State>(createUser, (state, action) => {
  // action.payload is `User | undefined`
});
```

#### A Note About [Flux Standard Actions][fsa]

The `payload` property on [Flux Standard Actions][fsa] is optional. In
TypeScript you can work with these actions in one of two ways:

```ts
const reducer = handleAction(createUser, (state: State, action) => {
  // Method 1:
  if (action.payload) {
    action.payload.name;
  }
  // Method 2:
  action.payload!.name;
});

// Method 2 also works with destructuring:
const reducer = handleAction(createUser, (state: State, { payload }) => {
  payload!.name;
});
```

### `reduceReducers`

This function composes reducers together into a single reducer. It takes an
array of reducer functions and an optional default state. If you specify a type
then you don't need to specify state types for any child reducers.

```ts
import { reduceReducers } from 'redux-ts-actions';

const increment = createAction('counter/INCREMENT');
const decrement = createAction('counter/DECREMENT');
const add = createAction<number>('counter/ADD');

// Passing a type to `reduceReducers` allows everything below to be typesafe:

const reducer = reduceReducers<number>([
  handleAction(inc, i => i + 1),
  handleAction(dec, i => i - 1),
  handleAction(add, (i, { payload = 0 }) => i + payload),
], 0);
```

## License

**MIT**

[fsa]: https://github.com/redux-utilities/flux-standard-action "Flux Standard Action Spec"
[utils]: https://github.com/knpwrs/redux-ts-utils
