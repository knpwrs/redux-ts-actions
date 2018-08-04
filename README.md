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
## License

**MIT**
