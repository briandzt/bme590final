import React, { Component } from 'react';
import App from "./App";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ReactDOM from "react-dom";
import VerticalLinearStepper from "./BetterStepper";
import { Redirect, BrowserRouter as Router, Route, Link, Switch, } from 'react-router-dom'


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});
    var userInput = ""


class Beginning extends Component {
        constructor(props) {
      super(props);

      this.state = {
         name: 'Cat in the Hat',
          fireRedirect: false

      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   };

  handleChange = name => event => {
    this.setState({
      name: event.target.value,
    });
  };

  handleSubmit = name => {
      this.setState({ fireRedirect: true })

  }



    render()
    {
        const { fireRedirect } = this.state

        return (
<div>
    <form >
        <TextField
          id="filled-name"
          label="Name"
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
          variant="filled"

        />
    </form>

    <Button
        variant="contained"
        color="secondary"
        onClick={this.handleSubmit}
     >
        Submit
    </Button>
    {fireRedirect && (<Redirect to={`./BetterDrawer`}/>)}
</div>
        )

    }
}

export default Beginning;