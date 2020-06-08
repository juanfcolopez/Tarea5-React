import React from 'react';

import '../css/StockList.css';
import { connect } from "react-redux";
import { setStock } from "../redux/actions";

import marketsDict from '../data/markets';

class StockList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockShowing: "",
    }
    this.handleClickStock = this.handleClickStock.bind(this);
  }

  handleClickStock(event) {
    this.setState({ stockShowing: event.target.getAttribute("stockId") });
    console.log(this.state.stockShowing);
    this.props.setStock(marketsDict[event.target.getAttribute("stockId")]);
  }

  render() {
    const markets = Object.values(marketsDict);
    return (
      <div className="StockList">
        <ul>
        { markets.map((o, i) =>
            <li key={i}
                onClick={this.handleClickStock}
                stockId={o.id}
                className={this.state.stockShowing === o.id? "selected":"unselected"}>
              {o.id}
            </li>
          )
        }
        </ul>
      </div>
    );
  }
}

export default connect(
  null,
  { setStock }
)(StockList);
