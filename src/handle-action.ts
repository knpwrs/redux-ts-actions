import { Reducer } from 'redux';
import {
  // eslint-disable-next-line no-unused-vars
  FluxStandardActionCreator,
  // eslint-disable-next-line no-unused-vars
  FluxStandardAction,
} from './create-action';

export type StandardReducer<S, A extends FluxStandardAction<any>> = (s: S, a: A) => S;

export default function handleAction<S, AC extends FluxStandardActionCreator<any> = any>(
  ac: AC,
  re: StandardReducer<S, ReturnType<AC>>,
  s?: S,
): Reducer<S, ReturnType<AC>> {
  return (state = s, action) => {
    if (state !== undefined && action.type === ac.toString()) {
      return re(state as S, action);
    }
    // cheat codes
    return state as S;
  };
}
