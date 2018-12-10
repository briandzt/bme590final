import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createMuiTheme, withStyles, MuiThemeProvider} from '@material-ui/core/styles';
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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import GPSIcon from '@material-ui/icons/GpsFixed';
import MailIcon from '@material-ui/icons/Mail';
import VerticalLinearStepper from "./BetterStepper";
import Beginning from './Beginning'
import { Redirect, BrowserRouter as Router, Route, Link, Switch, } from 'react-router-dom'


const drawerWidth = 240;
var activeDrawer = 0;

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

class Routelet extends Component  {
  render() {
    return (
        <Router>
          <div>
            <Route path="/UserLogin" component={Home} />
              <Route path="/ImageProcessor" component={ImageProcessor} />
            <Route path="/Statistics" component={Statistics} />

          </div>

        </Router>

    )

  }

}

const Home = () => (
  <div>
    <h1>
      PLEASE LOAD
    </h1>
  </div>
);

const ImageProcessor = () => (
  <div>
      An image
  </div>
);

const Statistics = () => (
  <div>
      Statistics
  </div>
);

function handleGPS() {
  activeDrawer = 6;
  return (
      <main>
          <div margin ="90px"/>
          <h1>
          {activeDrawer}
          </h1>
          <h1>
          {activeDrawer}
          </h1>
          <h1>
          {activeDrawer}
          </h1>
      </main>

  )

}



function PermanentDrawerLeft(props) {
  const { classes } = props;




        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline/>

                    <AppBar position="fixed" className={classes.appBar} color='primary'>
                        <Toolbar>
                            <Typography variant="h6" color="inherit" noWrap>
                                The Superior Image Processor
                            </Typography>
                        </Toolbar>
                    </AppBar>


                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        anchor="left"
                    >
                        <div className={classes.toolbar}/>
                        <Divider/>
                        <Router>
                            <List>
                                {['Fluffy', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                                    <ListItem key={text} component={Link} to="https://www.google.com">
                                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                        <ListItemText primary={text}/>
                                    </ListItem>
                                ))}


                                <ListItem button type = "submit" onClick={function(){handleGPS()}}>
                                    <ListItemIcon>
                                        <GPSIcon/>
                                    </ListItemIcon>

                                    <ListItemText path="/UserLogin">
                                        Attempt
                                    </ListItemText>
                                </ListItem>


                            </List>
                        </Router>
                    </Drawer>


                    <main className={classes.content}>
                        <div className={classes.toolbar}/>

                       <VerticalLinearStepper/>

                    </main>
                </div>
            </MuiThemeProvider>
        );
    }

PermanentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PermanentDrawerLeft);
