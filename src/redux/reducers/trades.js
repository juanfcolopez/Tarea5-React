import { ADD_TRADE } from "../actionTypes";

const initialState = [];

const trades = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRADE: {
      const { trade } = action.payload;
      return [trade, ...state.slice(0,20)];
    }
    default: {
      return state;
    }
  }
};

export default trades;
