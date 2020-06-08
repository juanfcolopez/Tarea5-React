import { ADD_TRADE, SET_STOCK, ADD_CANDLE, SET_CANDLES, SET_INFO, SET_ORDERBOOK, UPDATE_ORDERBOOK } from "./actionTypes";


export const addTrade = trade => ({
  type: ADD_TRADE,
  payload: {
    trade: trade
  }
});

export const setStock = stock => ({
  type: SET_STOCK,
  payload: {
    stock: stock
  }
});

export const setCandles = candles => ({
  type: SET_CANDLES,
  payload: {
    candles
  }
});

export const addCandle = candle => ({
  type: ADD_CANDLE,
  payload: {
    candle: candle
  }
});

export const setStockInfo = info => ({
  type: SET_INFO,
  payload: {
    info: info
  }
});

export const setOrderBook = orderbook => ({
  type: SET_ORDERBOOK,
  payload: {
    orderbook: orderbook
  }
});

export const updateOrderBook = orderbook => ({
  type: UPDATE_ORDERBOOK,
  payload: {
    orderbook: orderbook
  }
});
