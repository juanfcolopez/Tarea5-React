import React from 'react';

// Components
import { StockOrderBook }  from './StockOrderBook';

const ccxws = require("ccxws");

export class Stock extends React.Component {
  constructor(props) {
    super(props);

    this.state =  { orderbookAsks: [],
                    orderbookBids: [],
                  };

    this.socket = null;
  }

  componentDidMount() {
    this.connectSocket();
  }

  connectSocket() {
    const market = this.props.market;

    this.socket = new ccxws.binance();

    // handle level2 orderbook snapshots
    this.socket.on("l2snapshot", snapshot => {
      this.setState({ orderbookAsks: snapshot.asks,
                      orderbookBids: snapshot.bids})
    });

    // subscribe to level2 orderbook snapshots
    this.socket.subscribeLevel2Snapshots(market);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.market.id !== this.props.market.id) {
      this.socket.unsubscribeLevel2Snapshots(this.props.market);
      this.socket.subscribeLevel2Snapshots(nextProps.market)

      return true;
    }

    if (nextState) return true;

    return false;
  }

  render() {
    return (
      <div className="Stock">
        <StockOrderBook asks={this.state.orderbookAsks} bids={this.state.orderbookBids} />
      </div>
    );
  }
}
