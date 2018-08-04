import { Action } from 'redux';

export interface FluxStandardAction<T> extends Action<string> {
  payload?: T;
  error?: Error;
  toString(): string;
}

export interface FluxStandardActionCreator<T, A extends any[] = [T?]> {
  (...args: A): FluxStandardAction<T>;
  (...error: [Error]): FluxStandardAction<T>;
}

export type PayloadCreator<P, A extends any[] = [P?]> = (...args: A) => P;
const identity = <T>(arg: T): T => arg;

// eslint-disable-next-line arrow-parens
export default <P, A extends any[] = [P?]>(
  type: string,
  pc: PayloadCreator<P, A> = identity,
): FluxStandardActionCreator<P, A> => {
  const ac = (...args: any[]): FluxStandardAction<P> => {
    if (args[0] instanceof Error) {
      return {
        type,
        error: args[0],
      };
    }
    return {
      type,
      payload: pc(...args as A),
    };
  };
  ac.toString = () => type;
  return ac;
};
