import React from 'react';

// Components
import { StockOrderBook }  from './StockOrderBook';
import { StockInfo } from './StockInfo';
import { TradeChart } from './TradeChart';

// Services
import exchangeService from '../services/exchangeService'

export class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.service = exchangeService
  }

  componentDidMount() {
    this.startGettingData(this.props.market);
  }

  startGettingData(market) {
    // Get previous chart data
    fetch("https://api.binance.com/api/v3/klines?symbol="+market.id+"&interval=1h")
        .then(res => res.json())
        .then((data) => {
          const candles = data.map((o,i) => { return({  time: o[0],
                                                        open: o[1],
                                                        high: o[2],
                                                        low: o[3],
                                                        close: o[4]
                                                     }); });
          this.setState({ candles: candles });
          // Connect to websocket and retrieve last data
          this.connectSocket(market);
        })
        .catch(console.log)
  }

  changeStock(newMarket) {
    this.disconnectSockets();
    this.startGettingData(newMarket);
  }

  disconnectSockets() {
    this.klineStream.close();
    this.tradeStream.close();
    this.infoStream.close();
  }

  connectSocket(market) {
    this.klineStream = new WebSocket("wss://stream.binance.com:9443/ws/"+market.id.toLowerCase()+"@kline_1h");
    this.tradeStream = new WebSocket("wss://stream.binance.com:9443/ws/"+market.id.toLowerCase()+"@aggTrade");
    this.infoStream = new WebSocket("wss://stream.binance.com:9443/ws/"+market.id.toLowerCase()+"@ticker");


    this.klineStream.onmessage = (evt) =>  {
      const data = JSON.parse(evt.data);

      const candle = {  time: data.k.t,
                        open: data.k.o,
                        high: data.k.h,
                        low: data.k.l,
                        close: data.k.c
                     }
       if (this.state.candles.length > 0 && this.state.candles[this.state.candles.length-1].time === candle.time){
         this.setState({ candles: [...this.state.candles.slice(0, -1), candle] });
       }  else {
         this.setState({ candles: [...this.state.candles, candle] });
       }
    };

    this.tradeStream.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      const trade =  {  time: data.E,
                        amount: data.q,
                        price: data.p,
                        side: data.m ? "buy" : "sell"
                     }

      this.setState({ trades: [trade, ...this.state.trades.slice(0,20)] });
    };

    this.infoStream.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      this.setState({ info: {
                              volume: Math.round(data.v*100)/100,
                              variation: Math.round((data.c - data.o)/data.o*10000)/100,
                              high: Math.round(data.h*100)/100,
                              low: Math.round(data.l*100)/100,
                              last: Math.round(data.c*100)/100
                            } });
    };



  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.market.id !== this.props.market.id) {
      this.changeStock(nextProps.market);
      return true;
    }

    if (nextState) return true;

    return false;
  }

  render() {
    return (
      <div className="Stock">
        <TradeChart data={this.state.candles}/>
        <StockInfo   info = {this.state.info}
                     trades = {this.state.trades}
                     />
        <StockOrderBook asks={this.state.orderbookAsks} bids={this.state.orderbookBids} />

      </div>
    );
  }
}
