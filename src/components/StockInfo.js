import React from 'react';
import '../css/StockInfo.css';
import { Row, Col } from 'reactstrap';

// Redux
import { connect } from "react-redux";
import { getTrades, getStockInfo } from "../redux/selectors";

class StockInfo extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.transactions = [];
  }

  // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp);
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = this.strPad(hour) + ':' + this.strPad(min) + ':' + this.strPad(sec) ;
    return time;
  }

  strPad(n) {
    return String("00" + n).slice(-2);
  }

  render() {
    return (
      <Row>
        <Col xs="12" md="12" lg="6">
          <div className="StockData">
            <table>
              <tbody>
              <tr>
                <th>Volume 24hs:</th>
                <td>{this.props.info.volume}</td>
              </tr>
              <tr>
                <th>High 24hs:</th>
                <td>{this.props.info.high}</td>
              </tr>
              <tr>
                <th>Low 24hs:</th>
                <td>{this.props.info.low}</td>
              </tr>
              <tr>
                <th>Last Price:</th>
                <td>{this.props.info.last}</td>
              </tr>
              <tr>
                <th>Variation 24hs:</th>
                <td>{this.props.info.variation}%</td>
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
            { this.props.trades.map((o, i) => {
                if (o.side === "buy") {
                  return (
                    <tr key={i} className="buyOrder">
                      <td>{this.timeConverter(o.time)}</td>
                      <td>{o.amount}</td>
                      <td>{Math.round(o.price*100)/100}</td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={i} className="sellOrder">
                      <td>{this.timeConverter(o.time)}</td>
                      <td>{o.amount}</td>
                      <td>{Math.round(o.price*100)/100}</td>
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

const mapStateToProps = state => {
  const info = getStockInfo(state);
  const trades = getTrades(state);
  return { info: info,
           trades: trades};
};

export default connect(
  mapStateToProps,
  { }
)(StockInfo);
