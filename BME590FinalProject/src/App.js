import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import VerticalLinearStepper from './BetterStepper';
import PermanentDrawerLeft from './BetterDrawer'
import Beginning from './Beginning'
import Master from './MasterFile'


class App extends Component {
  render() {
    return (
        <MuiThemeProvider>
      <div>


        <Master />
      </div>
        </MuiThemeProvider>



    );
  }
}

export default App;
