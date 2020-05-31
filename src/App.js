import React from 'react';
//import logo from './logo.svg';
import './App.css';

// Components
import { Container, Row, Col } from 'reactstrap';
import { Stock }  from './components/Stock';
import { StockList }  from './components/StockList';
//import Switch from 'react-switch';
//import ClipLoader from "react-spinners/ClipLoader";

// Utils
import markets from './data/markets';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state =  { stockShowing: ""
                  };
  }

  onStockClick(event) {
    // Change chart and current stock info
    console.log(event.target.getAttribute("stockId"));
    const stock_id = event.target.getAttribute("stockId");
    this.updateStock(stock_id);
  }

  updateStock(stock_id) {
    this.setState({ stockShowing: stock_id })
  }

  render() {

    const marketsList = Object.values(markets);
    return (
      <div className="App">
          <Container>
            <Row>
              <Col xs="12" md="12" lg="3">
                <StockList markets={marketsList}
                           clickAction={this.onStockClick.bind(this)} />
              </Col>
              <Col xs="12" md="12" lg="9">
                { (this.state.stockShowing) ?
                <Stock market={markets[this.state.stockShowing]}/>
              :
                <h4 style={{width:"100%"}}>Select a stock...</h4>
              }
              </Col>
            </Row>

          </Container>
      </div>
    );
  }
}

export default App;
