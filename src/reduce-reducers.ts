import { Reducer } from 'redux';

export default <S>(res: Reducer[], initialState?: S): Reducer<S, any> => (
  (state = initialState, action) => (
    res.reduce(
      (curr, re) => re(curr, action),
      state,
    )
  )
);
