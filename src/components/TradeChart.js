import React from 'react';

import { createChart } from 'lightweight-charts';


export class TradeChart extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.lineSeries = null;
  }

  shouldComponentUpdate(next_props) {
    this.lineSeries.setData(next_props.data);
    return false;
  }

  componentDidMount() {
    this.chart = createChart(document.getElementById("TradeChart"), {
        width: 600,
        height: 300,
    });
    this.lineSeries = this.chart.addLineSeries();
    console.log(document.getElementsByClassName("TradeChart")[0]);
  }

  render() {
    return (
      <div id="TradeChart">
      </div>
    );
  }
}