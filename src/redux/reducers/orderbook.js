import { UPDATE_ORDERBOOK, SET_ORDERBOOK } from "../actionTypes";

const initialState = {
  lastUpdateId: 0,
  bids: [],
  asks: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ORDERBOOK: {
      let orderbook = state;
      let orderbookAsks = orderbook.asks.reduce((o, i) => (o[i.price] = i.size, o), {});
      let orderbookBids = orderbook.bids.reduce((o, i) => (o[i.price] = i.size, o), {});

      let orderbookUpdate = action.payload.orderbook;

      if (orderbookUpdate.u <= orderbook.lastUpdateId){
        return orderbook;
      } else {
        for (let i=0; i < orderbookUpdate.asks.length; i++) {
          let askOrder = orderbookUpdate.asks[i];
          if (askOrder[0] in orderbookAsks) {
            if (askOrder[1] === 0){
              delete orderbookAsks[askOrder[0]];
            } else {
              orderbookAsks[askOrder[0]] = askOrder[1];
            }
          }
        }
        for (let i=0; i < orderbookUpdate.bids.length; i++) {
          let bidOrder = orderbookUpdate.bids[i];
          if (bidOrder[0] in orderbookBids) {
            if (bidOrder[1] === 0){
              delete orderbookBids[bidOrder[0]];
            } else {
              orderbookBids[bidOrder[0]] = bidOrder[1];
            }
          }
        }

        orderbook.asks = Object.entries(orderbookAsks).map(([price, size]) => ({price,size}));
        orderbook.bids = Object.entries(orderbookBids).map(([price, size]) => ({price,size}));

        return orderbook;
      }
    }
    case SET_ORDERBOOK: {
      const { orderbook } = action.payload;
      return orderbook;
    }
    default:
      return state;
  }
}
