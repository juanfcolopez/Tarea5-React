import React from 'react';

// Components
import { StockOrderBook }  from './StockOrderBook';
import { StockInfo } from './StockInfo';

const ccxws = require("ccxws");

export class Stock extends React.Component {
  constructor(props) {
    super(props);

    this.state =  { orderbookAsks: [],
                    orderbookBids: [],
                    volume: 0,
                    High: 0, 
                    Low: 0,
                    LastPrice: 0,
                    Variation: 0,
                    price: 0,
                    side: 0,
                    time: 0,
                    amount: ''
                  };

    this.socket = null;
    this.socket2 = null;
  }

  componentDidMount() {
    this.connectSocket();
  }

  connectSocket() {
    const market = this.props.market;

    this.socket = new ccxws.binance();
    this.socket2 =  new ccxws.binance();

    this.socket.on("ticker", ticker => {
      this.setState({
        volume: ticker.quoteVolume,
        High: ticker.high,
        Low: ticker.low,
        LastPrice: ticker.last,
        Variation: ticker.changePercent
      })
     
    });
    this.socket.on("trade", trades => {
      
      this.setState({
        price: trades.price,
        side: trades.side,
        time: trades.unix,
        amount: trades.amount

      })
    })
 

    // handle level2 orderbook snapshots
    this.socket2.on("l2snapshot", snapshot => {
      console.log(snapshot);
      this.setState({ orderbookAsks: snapshot.asks,
                      orderbookBids: snapshot.bids})
    });

    // subscribe to level2 orderbook snapshots
    this.socket2.subscribeLevel2Snapshots(market);
    this.socket.subscribeTicker(market);
    this.socket.subscribeTrades(market);
  }

/*   shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.market.id !== this.props.market.id) {
      this.socket.unsubscribeLevel2Snapshots(this.props.market);
      this.socket.subscribeLevel2Snapshots(nextProps.market)

      return true;
    }

  
    if (nextState) return true;

    return false;
  } */

  render() {
    return (
      <div className="Stock">
         <StockInfo volume={parseInt(this.state.volume)}
                         high={parseInt(this.state.High)}
                         low={parseInt(this.state.Low)}
                         last = {parseInt(this.state.LastPrice)}
                         variation = {this.state.Variation}
                         time = {this.state.unix}
                         trade = {[this.state]}
                         />
        <StockOrderBook asks={this.state.orderbookAsks} bids={this.state.orderbookBids} />
       
      </div>
    );
  }
}
