import { SET_INFO } from "../actionTypes";

const initialState = {
  volume: "",
  variation: "",
  high: "",
  low: "",
  last: ""
};

const stockInfo = (state = initialState, action) => {
  switch (action.type) {
    case SET_INFO: {
      return action.payload.info;
    }
    default: {
      return state;
    }
  }
};

export default stockInfo;
