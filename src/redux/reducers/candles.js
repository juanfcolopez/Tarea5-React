import { ADD_CANDLE, SET_CANDLES } from "../actionTypes";

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_CANDLE: {
      const { candle } = action.payload;
      if (state.length > 0 && state[state.length-1].time === candle.time){
        return [...state.slice(0, -1), candle];
      }  else {
        return [...state, candle];
      }
    }
    case SET_CANDLES: {
      const { candles } = action.payload;
      return candles;
    }
    default:
      return state;
  }
}
