import { combineReducers } from "redux";
import stockShowing from "./stockShowing";
import candles from "./candles";
import stockInfo from "./information";
import trades from "./trades";
import orderbook from "./orderbook";

export default combineReducers({ candles, stockShowing, stockInfo, trades, orderbook });
