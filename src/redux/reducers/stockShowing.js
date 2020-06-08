import { SET_STOCK } from "../actionTypes";

const initialState = "";

const stockShowing = (state = initialState, action) => {
  switch (action.type) {
    case SET_STOCK: {
      return action.payload.stock;
    }
    default: {
      return state;
    }
  }
};

export default stockShowing;
