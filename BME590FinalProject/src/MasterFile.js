import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import {createMuiTheme, withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OutputIcon from '@material-ui/icons/Mood';
import PhotoIcon from '@material-ui/icons/AddAPhoto';
import UserIcon from '@material-ui/icons/AccountBox';
import VerticalLinearStepper from "./BetterStepper";
import {BrowserRouter as Router, Link} from "react-router-dom";

const drawerWidth = 240;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#009688'
    },
    secondary: {
      main: '#651fff'
    },
      error: {
        main:'#757575'
      },
  },
});

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
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});





class Master extends Component {

    constructor(props) {
      super(props);
    this.state = {
        name: "",
        page: 0,
        activeDrawer: 0,
        currentImageString: '',
        HistEq: false,
        LogComp: false,
        RevVid: false,
        ContStretch: false,
        visible: false,
        process: "",
        value: 'rgb',
        count: 0,
        activeStep: 0,
        JPEG: false,
        PNG: false,
        TIFF: false,
        type: 'JPEG',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


}
handleChange = name => event => {
    this.setState({
      name: event.target.value,
    });
  };

  handleSubmit = name => {
      this.setState({
          page: 1
      })
  }

  handleImagProc = name => {
      this.setState({
          activeDrawer: 0
      })
  }

  handleUser = name => {
      this.setState({
          activeDrawer: 1
      })
  }

  handleOutput = name => {


  }

  handleDrawer = name => {
      if (this.state.activeDrawer === 0) {
          return(
              <div>
                  <VerticalLinearStepper/>
              </div>
              )
      }
      else {
          return(
              <div>
                  SOMETHING'S WRONG
              </div>
          )

      }
  }


    render() {


        if (this.state.page === 0) {
        return(
            <MuiThemeProvider theme = {theme}>




                <Paper elevation={6} style={{width:"550px", height:"170px", backgroundColor:"#F2F2F2", margin:"0 auto"}}>
                    <div style={{
                        marginLeft:"70px"
                    }}>
                        <Typography variant="h5" component="h3">
                            Please Enter Your Project Name Below
                        </Typography>
                    </div>

                    <div style={{
                        marginLeft:"180px"
                    }}>
                        <form>
                            <TextField
                                id="user-email"
                                label="Project Name"
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                                variant="filled"

                            />
                        </form>
                        <div style={{
                            marginLeft:"50px",
                            marginBottom:"30px"
                        }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.handleSubmit}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </Paper>


            </MuiThemeProvider>
        )
      }
      if (this.state.page === 1 && this.state.activeDrawer === 0) {
          return (
              <MuiThemeProvider theme={theme}>
                  <div>
                      <CssBaseline/>



                          <AppBar>
                              <div style={{
                            marginLeft: '230px',
                              }}>
                                  <Toolbar>
                                      <Typography variant="h6" color="inherit" noWrap>
                                          The Superior Image Processor Welcomes {this.state.name}
                                      </Typography>
                                  </Toolbar>
                              </div>
                          </AppBar>

                    <Drawer
                        variant="permanent"
                        anchor="left"
                    >
                        <div style={{
                            marginTop: '64px',
                              }}

                        />
                        <Divider/>
                        <Router>
                            <List>

                                <ListItem button onClick={this.handleUser}>
                                    <ListItemIcon>
                                        <UserIcon/>
                                    </ListItemIcon>

                                    <ListItemText>
                                        User Statistics
                                    </ListItemText>
                                </ListItem>

                                <ListItem button onClick={this.handleImagProc}>
                                    <ListItemIcon>
                                        <PhotoIcon/>
                                    </ListItemIcon>

                                    <ListItemText>
                                        Image Processor
                                    </ListItemText>
                                </ListItem>

                                <ListItem button onClick={this.handleOutput}>
                                    <ListItemIcon>
                                        <OutputIcon/>
                                    </ListItemIcon>

                                    <ListItemText>
                                        View Output
                                    </ListItemText>
                                </ListItem>

                            </List>
                        </Router>
                    </Drawer>


                    <main>


                        <div style={{
                            marginLeft: '230px',
                            marginTop: '50px'
                        }}>
                            <VerticalLinearStepper/>
                        </div>



                    </main>
                  </div>
            </MuiThemeProvider>


              )
      }
      if (this.state.page ===1 && this.state.activeDrawer === 1) {
          return (
              <div>
                  :D
              </div>

          )

      }

    }



}
export default Master