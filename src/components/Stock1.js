import React from 'react';

// Components
import StockOrderBook from './StockOrderBook';
import StockInfo from './StockInfo';
import TradeChart from './TradeChart';

// Services
import ExchangeService from '../services/ExchangeService'

class Stock1 extends React.Component {

  render() {
    return (
      <div className="Stock">
        <ExchangeService />
        <TradeChart />
        <StockInfo />
        <StockOrderBook />
      </div>
    );
  }
}

export default Stock1;
