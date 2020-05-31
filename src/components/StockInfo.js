import React from 'react';
import './StockInfo.css';
import { Row, Col } from 'reactstrap';

export class StockInfo extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.volume);
    this.transactions = [];
  }
  // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    //const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    const time = this.strPad(hour) + ':' + this.strPad(min) + ':' + this.strPad(sec) ;
    return time;
  }

  strPad(n) {
    return String("00" + n).slice(-2);
  }

  render() {
    let data = this.props.trade;
    if (typeof(data) === "undefined") data = [];
    let transactions = data.map((o) => {return o});
    this.transactions.push(transactions[0]);
    this.transactions.sort((a,b) => b.time - a.time );


    // Information
  

    return (
      <Row>
        <Col xs="12" md="12" lg="6">
          <div className="StockData">
            <table>
              <tbody>
              <tr>
                <th>Volume:</th>
                <td>{this.props.volume}</td>
              </tr>
              <tr>
                <th>High:</th>
                <td>{this.props.high}</td>
              </tr>
              <tr>
                <th>Low:</th>
                <td>{this.props.low}</td>
              </tr>
              <tr>
                <th>Last Price:</th>
                <td>{this.props.last}</td>
              </tr>
              <tr>
                <th>Variation:</th>
                <td>{this.props.variation}%</td>
              </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs="12" md="12" lg="6">
        <div className="StockTradesData">
          {<table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Amount</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
            { this.transactions.map((o, i) => {
                if (o.side === "buy") {
                  return (
                    <tr key={i} className="buyOrder">
                      <td>{this.timeConverter(o.time)}</td>
                      <td>{o.amount}</td>
                      <td>{parseInt(o.price)}</td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={i} className="sellOrder">
                      <td>{this.timeConverter(o.time)}</td>
                      <td>{o.amount}</td>
                      <td>{parseInt(o.price)}</td>
                    </tr>
                  );
                }
              })
            }
            </tbody>

          </table>
        }</div>
        </Col>
      </Row>

    );
  }
}
