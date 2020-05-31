import React from 'react';

import './StockList.css';

export class StockList extends React.Component {
  render() {
    return (
      <div className="StockList">
        <ul>
        { this.props.markets.map((o, i) =>
            <li key={i}
                onClick={this.props.clickAction}
                stockId={o.id} >
              {o.id}
            </li>
          )
        }
        </ul>
      </div>
    );
  }
}
