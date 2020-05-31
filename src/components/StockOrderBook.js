import React from 'react';
import './StockOrderBook.css';
import { Row, Col } from 'reactstrap';

export class StockOrderBook extends React.Component {

  render() {
    let asks = this.props.asks;
    let bids = this.props.bids;

    let asksTotalSize = 0;
    let bidsTotalSize = 0;

    asks = asks.map((o,i) => {
      asksTotalSize = asksTotalSize + parseFloat(o.size);
      return({price: o.price, size: asksTotalSize})
    });

    bids = bids.map((o,i) => {
      bidsTotalSize = bidsTotalSize + parseFloat(o.size);
      return({price: o.price, size: bidsTotalSize})
    });

    return (
      <Row>
        <Col xs="12" md="12" lg="12">
        <div className="StockOrderBookTitle">
          <h3>Orderbook</h3>
        </div>
        <div className="StockOrderBook">
          <table className="StockOrderBookBids">
            <thead>
              <tr>
                <th>Size</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
            { bids.map((o, i) => {
                return (<tr key={i} className="askRow">
                  <td>{Math.round(o.size * 100) / 100}</td>
                  <td>{Math.round(o.price * 100) / 100}<div className="bg" style={{width: (o.size/bidsTotalSize)*80 + "%"}}/></td>
                </tr>)
              })
            }
            </tbody>
          </table>
          <table className="StockOrderBookAsks">
            <thead>
              <tr>
                <th>Price</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
            { asks.map((o, i) => {
                return (<tr key={i} className="bidRow">
                  <td>{Math.round(o.price * 100) / 100}<div className="bg" style={{width: (o.size/asksTotalSize)*80 + "%"}}/></td>
                  <td>{Math.round(o.size * 100) / 100}</td>
                </tr>)
              })
            }
            </tbody>
          </table>
        </div>
        </Col>
      </Row>
    );
  }
}
