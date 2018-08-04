/* eslint-disable no-restricted-globals */
import {
  createAction,
  handleAction,
  reduceReducers,
} from '.';

test('all together (type handle)', () => {
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
  expect([setName('id-1', 'Ken'), incrementFollowers('id-1')].reduce(reducer, undefined)).toEqual({
    'id-1': {
      name: 'Ken',
      followers: 1,
    },
  });
});
