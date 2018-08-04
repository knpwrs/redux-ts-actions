/* eslint-disable no-param-reassign */
import produce, { Draft } from 'immer';
import {
  createAction,
  handleAction,
  reduceReducers,
  FluxStandardAction,
} from '.';

interface State {
  readonly project: string;
  readonly followers: number;
}

test('all together (type handle)', () => {
  const setProject = createAction('setProject', (str: string) => str);
  const addFollowers = createAction('addFollowers', (followers: number) => followers);
  const initialState: State = {
    project: 'redux',
    followers: 15,
  };
  const re = reduceReducers([
    handleAction(
      setProject,
      produce<State>((draft: Draft<State>, { payload }: FluxStandardAction<string>) => {
        draft.project = payload!;
      }),
    ),
    handleAction(
      addFollowers,
      produce<State>((draft: Draft<State>, { payload }: FluxStandardAction<number>) => {
        draft.followers += payload!;
      }),
    ),
  ], initialState);
  const actions = [setProject('immer'), addFollowers(99)];
  expect(actions.reduce(re, undefined)).toEqual({
    project: 'immer',
    followers: 114,
  });
});
