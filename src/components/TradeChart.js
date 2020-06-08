import React from 'react';
import '../css/TradeChart.css';
import { createChart } from 'lightweight-charts';

// Redux
import { connect } from "react-redux";
import { getCandles } from "../redux/selectors";


class TradeChart extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.lineSeries = null;

    this.chartTooltip = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    console.log(nextProps.data);
    this.lineSeries.setData(nextProps.data);
    this.chart.timeScale().applyOptions({ fixLeftEdge: true,
                                          crosshair: {
                                            labelVisible: false,
                                            visible: false,
                                          },
                                          timeScale: {
                                            timeVisible: true,
                                            visible: false
                                          },
                                        });
    return false;
  }

  componentDidMount() {
    // Generate chart
    this.chart = createChart(document.getElementById("TradeChart"),
                              { width: 600,
                                height: 350,
                                fixLeftEdge: true,
                                crosshair: {
                                  labelVisible: false,
                                  visible: false,
                                },
                                localization: {
                                  locale: 'es-CL',
                                  dateFormat: 'dd/mm/yyyy',
                                  timeFormatter: function(timestamp) {
                                    const a = new Date(timestamp*1000);
                                    const hour = a.getHours();
                                    const min = a.getMinutes();
                                    const sec = a.getSeconds();
                                    const time = String("00" + hour).slice(-2) + ':' + String("00" + min).slice(-2) + ':' + String("00" + sec).slice(-2) ;
                                    return time;
                                  },
                                },
                              	priceScale: {
                              		scaleMargins: {
                              			top: 0.3,
                              			bottom: 0.25,
                              		},
                              		borderVisible: false,
                              	},
                              	layout: {
                              		backgroundColor: '#131722',
                              		textColor: '#d1d4dc',
                              	},
                              	grid: {
                              		vertLines: {
                              			color: 'rgba(42, 46, 57, 0)',
                              		},
                              		horzLines: {
                              			color: 'rgba(42, 46, 57, 0.6)',
                              		},
                              	},
                                timeScale: {
                                  timeVisible: true,
                                  visible: false,
                                },
    });

    this.lineSeries = this.chart.addCandlestickSeries();
    this.chart.timeScale().applyOptions({ fixLeftEdge: true,
                                          crosshair: {
                                            labelVisible: false,
                                            visible: false,
                                          },
                                          timeScale: {
                                            timeVisible: true,
                                            visible: false
                                          },
                                        });

    window.addEventListener('resize', (event) => {
      this.chart.resize(document.getElementById("TradeChart").clientWidth, 350);
    });

    this.chart.resize(document.getElementById("TradeChart").clientWidth, 350);

    const toolTipWidth = 120;
    const toolTipHeight = 100;
    const toolTipMargin = 15;
    const width = 600;
    const height = 300;

    let tooltip = document.getElementById("TradeChartTooltip");
    // update tooltip
    this.chart.subscribeCrosshairMove((param) => {
    	if (!param.time || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
    		tooltip.style.display = 'none';
    		return;
    	}

    	var dateStr = this.datetimeConverter(param.time*1000);

    	tooltip.style.display = 'block';
    	var candle = param.seriesPrices.get(this.lineSeries);

    	tooltip.innerHTML = '<div style="font-size: 8px; margin: 4px 0px"> o: '+Math.round(candle.open)+' - h: '+Math.round(candle.high)+' - l: '+Math.round(candle.low)+' - c: '+Math.round(candle.close)+'</div>' +
    		'<div>' + dateStr + '</div>';

    	var y = param.point.y;

    	var left = param.point.x + toolTipMargin;
    	if (left > width - toolTipWidth) {
    		left = param.point.x - toolTipMargin - toolTipWidth;
    	}

    	var top = y + toolTipMargin;
    	if (top > height - toolTipHeight) {
    		top = y - toolTipHeight - toolTipMargin;
    	}

    	tooltip.style.left = left + 'px';
    	tooltip.style.top = top + 'px';
    });
  }

  // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  datetimeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const datetime = date + ' ' + month + ' ' + year + ' ' + this.strPad(hour) + ':' + this.strPad(min) + ':' + this.strPad(sec) ;
    return datetime;
  }

  strPad(n) {
    return String("00" + n).slice(-2);
  }

  render() {
    return (
      <div id="TradeChart">
        <div ref={this.chartTooltip} id="TradeChartTooltip" className="floating-tooltip-2"></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const candles = getCandles(state);
  return { data: candles };
};

export default connect(
  mapStateToProps,
  { }
)(TradeChart);
