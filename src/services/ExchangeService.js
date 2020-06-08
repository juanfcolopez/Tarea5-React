import React from 'react';

// Redux
import { connect } from "react-redux";
import { addCandle, setCandles, addTrade, setStockInfo, setOrderBook, updateOrderBook } from "../redux/actions";
import { getStockShowing } from "../redux/selectors";

class ExchangeService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockShowing: "",
    }
  }

  componentDidMount() {
    this.setState({ stockShowing: this.props.stockShowing.id });
    this.start(this.props.stockShowing.id);
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.stockShowing != nextProps.stockShowing.id){
      this.changeStock(nextProps.stockShowing.id);
    }
    return false;
  }

  changeStock(stock_ticker) {
    this.setState({ stockShowing: stock_ticker });
    this.restart(stock_ticker);
  }

  start(ticker) {
    // Get past data from ticker
    this.getCandles(ticker);
    this.getOrderBook(ticker);

    // Connect to ticker websocket updates
    this.connectTradesWebsocket(ticker);
    this.connectTickerWebsocket(ticker);
    this.connectCandleWebsocket(ticker);
    this.connectOrderBookWebsocket(ticker);
  }

  stop() {
    // Close sockets
    if (this.tradeStream)  this.tradeStream.close();
    if (this.infoStream)  this.infoStream.close();
    if (this.klineStream)  this.klineStream.close();
    if (this.orderbookStream)  this.orderbookStream.close();
  }

  restart(ticker) {
    this.stop();
    this.start(ticker);
  }

  getCandles(ticker) {
    // Get previous chart data
    fetch("https://api.binance.com/api/v3/klines?symbol="+ticker+"&interval=1h")
        .then(res => res.json())
        .then((data) => {
          const candles = data.map((o,i) => { return({  time: o[0],
                                                        open: o[1],
                                                        high: o[2],
                                                        low: o[3],
                                                        close: o[4] });
          });
          this.props.setCandles(candles);
        })
        .catch(console.log);
  }

  getOrderBook(ticker) {
    // Get previous chart data
    fetch("https://www.binance.com/api/v3/depth?symbol="+ticker+"&limit=1000")
        .then(res => res.json())
        .then((data) => {
          let orderbook = { lastUpdateId: data.lastUpdateId }
          orderbook.asks = data.asks.map((o,i) => { return({  price: o[0],
                                                              size: o[1] });
          });
          orderbook.bids = data.bids.map((o,i) => { return({  price: o[0],
                                                              size: o[1] });
          });

          this.props.setOrderBook(orderbook);
        })
        .catch(console.log);
  }

  connectTradesWebsocket(ticker) {
    this.tradeStream = new WebSocket("wss://stream.binance.com:9443/ws/"+ticker.toLowerCase()+"@aggTrade");

    this.tradeStream.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      const trade =  {  time: data.E,
                        amount: data.q,
                        price: data.p,
                        side: data.m ? "buy" : "sell"
                     }

      this.props.addTrade(trade);
    };
  }

  connectTickerWebsocket(ticker) {
    this.infoStream = new WebSocket("wss://stream.binance.com:9443/ws/"+ticker.toLowerCase()+"@ticker");

    this.infoStream.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      const info = {
        volume: Math.round(data.v*100)/100,
        variation: Math.round((data.c - data.o)/data.o*10000)/100,
        high: Math.round(data.h*100)/100,
        low: Math.round(data.l*100)/100,
        last: Math.round(data.c*100)/100
      };

      this.props.setStockInfo(info);
    };
  }

  connectCandleWebsocket(ticker) {
    this.klineStream = new WebSocket("wss://stream.binance.com:9443/ws/"+ticker.toLowerCase()+"@kline_1h");

    this.klineStream.onmessage = (evt) =>  {
      const data = JSON.parse(evt.data);

      const candle = {  time: data.k.t,
                        open: data.k.o,
                        high: data.k.h,
                        low: data.k.l,
                        close: data.k.c
                     }

       this.props.addCandle(candle);
    };
  }

  connectOrderBookWebsocket(ticker) {
    this.orderbookStream = new WebSocket("wss://stream.binance.com:9443/ws/"+ticker.toLowerCase()+"@depth");

    this.orderbookStream.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      const orderbookUpdate =  {  u: data.u,
                                  U: data.U,
                                  asks: data.a,
                                  bids: data.b
      }

      this.props.updateOrderBook(orderbookUpdate);
    };
  }

  render(){
    return (null);
  }
}

const mapStateToProps = state => {
  const stockShowing = getStockShowing(state);
  return { stockShowing: stockShowing };
};

export default connect(
  mapStateToProps,
  { setCandles, addCandle, addTrade, setStockInfo, setOrderBook, updateOrderBook }
)(ExchangeService);
