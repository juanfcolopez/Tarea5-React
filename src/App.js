import React from 'react';
import { connect } from "react-redux";

import './css/App.css';

// Components
import { Container, Row, Col } from 'reactstrap';
import Stock  from './components/Stock';
import StockList  from './components/StockList';
import { getStockShowing } from "./redux/selectors";
//import ClipLoader from "react-spinners/ClipLoader";


class App extends React.Component {

  render() {
    return (
      <div className="App">
          <Container>
            <Row>
              <Col xs="12" md="12" lg="3">
                <StockList />
              </Col>
              <Col xs="12" md="12" lg="9">
                { (this.props.stockShowing) ?
                <Stock />
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

const mapStateToProps = state => {
  const stockShowing = getStockShowing(state);
  return { stockShowing };
};

export default connect(mapStateToProps)(App);
