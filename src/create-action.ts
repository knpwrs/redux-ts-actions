import { Action } from 'redux';

export interface FluxStandardAction<T> extends Action<string> {
  payload?: T;
  error?: Error;
}

export type FluxStandardActionCreator<T, A extends any[] = [any?]>
  = ((...args: A) => FluxStandardAction<T>);

export type PayloadCreator<P, A extends any[] = [any?]> = (...args: A) => P;
const identity = <T>(arg: T): T => arg;

export default <P, A extends any[] = [any?]>(
  type: string,
  pc: PayloadCreator<P, A> = identity,
): FluxStandardActionCreator<P, A> => (...args: A): FluxStandardAction<P> => {
  if (args[0] instanceof Error) {
    return {
      type,
      error: args[0],
    };
  }
  return {
    type,
    payload: pc(...args),
  };
};
