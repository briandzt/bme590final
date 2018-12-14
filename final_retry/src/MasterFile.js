import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
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
import {BrowserRouter as Router, Link} from "react-router-dom";
import Stepper from "@material-ui/core/Stepper/Stepper";
import Step from "@material-ui/core/Step/Step";
import StepLabel from "@material-ui/core/StepLabel/StepLabel";
import StepContent from "@material-ui/core/StepContent/StepContent";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Radio from "@material-ui/core/Radio/Radio";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import {UploadField} from "@navjobs/upload";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import JSZip from 'jszip'
import axios from 'axios';
import DownloadLink from 'react-download-link'


const drawerWidth = 240;
var imgformat = "";
var valid = false
var message = ""
var modifier = 0
var imagepresent = false
var iszip = false
var zipfile = new JSZip();
var fileoutput = "";
var validemail = false
var filetitle = ""
var stringarray = []


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

function getSteps() {
  return ['Upload Images', 'Select Processing Method', 'Select Download Format'];
}

class Master extends Component {

    constructor(props) {
      super(props);
    this.state = {
        name: "",
        page: 0,
        activeDrawer: 1,
        currentImageString: '',
        brewedImageString: '',
        HistEq: false,
        LogComp: false,
        RevVid: false,
        ContStretch: false,
        visible: false,
        process: 'HistEq',
        value: 'rgb',
        count: 0,
        activeStep: 0,
        type: 'JPEG',
        stats: [1,15,10,6],
        contrast: 5,
        imgformat: '',
        message: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getStepContent = this.getStepContent.bind(this)
        this.imageValidate = this.imageValidate.bind(this)

}

getDrawerContent(drawer, steps) {
        switch (drawer) {
            case 0:
                return(
                      <div style={{marginTop: '70px', marginLeft: '30px'}}>

            <div >
                <h3>
                    Reports for user:  {(this.state.stats.length > 0) ? this.state.name: "No Data"}
                </h3>

            </div>
	<Table style={{width:'350px'}}>
        <TableHead>
          <TableRow>
            <TableCell>Processing Method</TableCell>
            <TableCell numeric>Number of Uses</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
            	<TableCell>Histogram Equalization</TableCell>
                <TableCell numeric>{this.state.stats[0]}</TableCell>
            </TableRow>
            <TableRow>
            	<TableCell>Log Compression</TableCell>
                <TableCell numeric>{this.state.stats[1]}</TableCell>
            </TableRow>
            <TableRow>
            	<TableCell>Reverse Video</TableCell>
                <TableCell numeric>{this.state.stats[2]}</TableCell>
            </TableRow>
            <TableRow>
            	<TableCell>Contrast Stretching</TableCell>
                <TableCell numeric>{this.state.stats[3]}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
        </div>
                )
            case 1:
                return(
                    <MuiThemeProvider theme={theme}>
        <div>

            <Stepper activeStep={this.state.activeStep} orientation="vertical">
                {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{this.getStepContent(index)}</Typography>
                  <div>
                    <div>

                      <Button
                        disabled={this.state.activeStep === 0}
                        onClick={this.handleBack}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                      >
                        {this.state.activeStep === steps.length - 1 ? 'Finish'  : 'Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
            </Stepper>
            {this.state.activeStep === steps.length && (
          <Paper square elevation={0} style={{margin: '20px'}}>
            <Typography>Confirm Selections </Typography>
              <div>
                  Selected Image:
              </div>
              <div>
                  {
                      (iszip)? (<div>Zip File</div>) : (<img src={this.state.currentImageString} width={200} height={200}/>)

                  }

              </div>
              <div>
                  Color Scheme: {this.state.value}
                  </div>
              <div>
                  Processing Method: {this.state.process}
                  </div>
              {this.state.process === 'ContStretch' ? (
                  <div>
                      Contrast: {this.state.contrast}
                  </div>

              ): (
                  <div></div>
              )}
              <div>
                  Download Type: {this.state.type}
                  </div>

              <Button
                        disabled={this.state.activeStep === 0}
                        onClick={this.handleBack}
                      >
                        Back
                      </Button>
              <Button onClick={this.handleSubmit}
                    color = "primary"
                    variant="contained"
              >
                  Submit
              </Button>
              <div>
                  <Button onClick={this.handleReset}
                    color = "error"
                    variant="contained"
              >
              Start Over
            </Button>
              </div>


          </Paper>
        )}
        </div>
             </MuiThemeProvider>
                )

            case 2:
                return(
                    <div style={{marginTop: '70px', marginLeft: '30px'}}>
                        <div >
                            <h3>
                                Output Comparison
                            </h3>
                        </div>
                        <div>
                            <Table style={{width:'350px', height:"100px"}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>MetaData</TableCell>
                                        <TableCell numeric>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Processing Method Used</TableCell>
                                        <TableCell>{this.state.process}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Color Type </TableCell>
                                        <TableCell>{this.state.value}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>File Size</TableCell>
                                        <TableCell numeric>{this.state.stats[2]}</TableCell>
                                    </TableRow>
                                </TableBody>
                                <DownloadLink
                                    filename={filetitle}
                                    exportFile={() => Promise.resolve(stringarray)}
                                    tagName = "button"
                                >
                                    <Button
                                    variant = "contained"
                                    color = "secondary">
                                        Download
                                    </Button>

                                </DownloadLink>
                              </Table>
                            <Divider />
                            <div>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <h3>
                                                    Original Image
                                                </h3>
                                            </TableCell>
                                            <TableCell>
                                                <h3>
                                                    Processed Image
                                                </h3>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><img src={this.state.currentImageString} width={300} height={300}/></TableCell>
                                            <TableCell><img src={this.state.currentImageString} width={300} height={300}/></TableCell>
                                        </TableRow>
                                    </TableBody>

                                </Table>




                            </div>


                        </div>

                    </div>
                )

            default:
                return 'Unknown step';
        }

}

getStepContent(step) {
  switch (step) {
    case 0:
      return (
          <div>
              <h2>Upload your image</h2>
				<UploadField onFiles={this.onUpload}>
					<div>
					<Button
                        variant="contained"
                        color="primary"
                      >
						Click to Upload
                      </Button>
					</div>
					<div style={{
							width: '0px',
						height: '0px',
						borderRight: '60px solid transparent',
						borderTop: '60px solid #009688',
						borderLeft: '60px solid #009688',
						borderBottom: '60px solid #009688',
						borderTopLeftRadius: '60px',
						borderTopRightRadius: '60px',
						borderBottomLeftRadius: '60px',
						borderBottomRightRadius: '60px',
						textAlign: 'right',
					margin: '20px'}}>
					</div>

				</UploadField>
				<div style={{margin: '10px'}}>
					{
						(this.state.currentImageString.length > 0) ? (
						    <div>
                                <div>
                                    {this.imageValidate()}
                                </div>
                                <div>
                                    {
                                        (valid) ? (
                                            (iszip) ? (
                                                <div>
                                                    Image(s) Uploaded
                                                </div>
                                            ) : (
                                                <div><img src={this.state.currentImageString} width={200} height={200}/>
                                                </div>)
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                </div>
                            </div>

						) : (
							<div>
							</div>
						)

					}
					<div>
                        {
                            (imagepresent) ? (<div>{message}</div>) : (<div></div>)
                        }
                        </div>

					</div>
          </div>
    );
    case 1:
      return (
          <div>
              <FormControl component="fieldset">
              <FormLabel component="legend">Process Which Type of Image?</FormLabel>
              <RadioGroup
                  aria-label="Processing Type"
                  value={this.state.value}
                  onChange={this.handleColorType}
              >
                  <FormControlLabel value="rgb" control={<Radio />} label="Original RGB Image" />
                  <FormControlLabel value="gray" control={<Radio />} label="Grayscale Image" />
              </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
              <FormLabel component="legend">
                  Select Processing Technique
              </FormLabel>
                  <RadioGroup
                  aria-label="Processing Technique"
                  value={this.state.process}
                  onChange={this.handleProcess}>
                      <FormControlLabel value='HistEq' control={<Radio/>} label="Histogram Equalization"/>
                      <FormControlLabel value='LogComp' control={<Radio/>} label="Log Compression"/>
                      <FormControlLabel value='RevVid' control={<Radio/>} label="Reverse Video"/>
                      <FormControlLabel value='ContStretch' control={<Radio/>} label="Contrast Stretching"/>
                  </RadioGroup>
          </FormControl>
              {this.state.process === 'ContStretch' ? (
                  <div>
                      <FormControl component="fieldset">
                          <FormLabel component="legend">
                              Amount of Contrast
                          </FormLabel>
                          <RadioGroup
                              aria-label="Contrast Number"
                              value={this.state.contrast}
                              onChange={this.handleContrast}>
                              <FormControlLabel value='0.1' control={<Radio/>} label="0.1"/>
                              <FormControlLabel value='0.2' control={<Radio/>} label="0.2"/>
                              <FormControlLabel value='0.3' control={<Radio/>} label="0.3"/>
                              <FormControlLabel value='0.4' control={<Radio/>} label="0.4"/>
                              <FormControlLabel value='0.5' control={<Radio/>} label="0.5"/>
                          </RadioGroup>
                      </FormControl>
                  </div>
              ): (
                  <div>
                  </div>
              )}

          </div>
      );
    case 2:
      return (
          <div>
              <FormGroup>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Download Format:</FormLabel>
                <RadioGroup
                    value={this.state.type}
                    onChange={this.handleSelect}>
                    <FormControlLabel value="JPEG" control={<Radio />} label="JPEG" />
                    <FormControlLabel value="PNG" control={<Radio />} label="PNG" />
                    <FormControlLabel value="TIFF" control={<Radio />} label="TIFF" />
                </RadioGroup>
            </FormControl>
            </FormGroup>
          </div>

      );
    default:
      return 'Unknown step';
  }
}

imageValidate() {
        if (imgformat === 'png' || imgformat === 'jpeg' ||
            imgformat === 'tiff') {
            iszip = false
            valid = true
            message ="User submitted a Valid Format: ." + imgformat
        }
        else if (imgformat === 'zip') {
            iszip = true
            valid = true

            message ="User submitted a Valid Format: ." + imgformat
        }
        else {
            valid = false
            modifier = 1
            message = "This is not a valid file format."
        }
}



handleNext = () => {

        if (this.state.activeStep === 0) {
            if(valid) {
                this.setState(state => ({
            activeStep: state.activeStep + 1,
                }));
                alert("Image Successfully Uploaded to Database")
            }
            else {
                if(modifier === 1) {
                    alert(message)
                }
                else{
                    alert("Please upload an image in a valid file format (.png, .jpg, .tiff, or .zip.)")
                }
            }
        }
        else {
            this.setState(state => ({
            activeStep: state.activeStep + 1,
                }));
        }
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        valid = false
        imagepresent = false
        iszip = false
        this.setState({
            activeStep: 0,
            process: '',
            type: '',
            value: '',
            currentImageString: '',
            message: '',
        });
    };

    handleSubmit = () => {
    };

handleChange = name => event => {
    this.setState({
      name: event.target.value,
    });
  };

  handleEmail = name => {
      axios.post("http://0.0.0.0:5000/api/testing", {
        "email": this.state.name
      }).then((response) => {
          if(response.data.response === "ok") {
            this.setState({
                page: 1
            })
            alert("Email is valid")
        }
        else{
            alert("This email is not valid")
        }
      })
  }

  handleImagProc = name => {
      this.setState({
          activeDrawer: 1
      })
  }

  handleUser = name => {
      this.setState({
          activeDrawer: 0
      })
  }
  handleSelect = event => {
    this.setState({ type: event.target.value });
  };
  handleColorType = event => {

      this.setState({value: event.target.value})

    if (this.state.value === 'rgb') {
           this.setState({valueString: "RGB"});
           }
       else {
           this.setState({valueString: "GRAYSCALE"});
       }
  };
   handleProcess = event => {
       this.setState({process: event.target.value});
   };
   handleContrast = event => {
       this.setState({contrast: event.target.value})
   }

   onUpload = (files) => {
		const reader = new FileReader()
		const file = files[0]
       filetitle = file.name
       imagepresent = true
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			console.log(reader.result);
            imgformat = reader.result.split(";")[0].split("/")[1]
			this.setState({currentImageString: reader.result});
		}
	}

  handleOutput = name => {
       var base64js = require('base64-js')
      stringarray = base64js.toByteArray(this.state.currentImageString)

       this.setState({
          activeDrawer: 2
      })
  }
  handleValidate = name => {
       this.setState({
           imgformat: imgformat
       })
  }

    render() {
      const steps = getSteps();

        if (this.state.page === 0) {
        return(
            <MuiThemeProvider theme = {theme}>
                <Paper elevation={6} style={{width:"550px", height:"170px", backgroundColor:"#F2F2F2", margin:"0 auto"}}>
                    <div style={{
                        marginLeft:"70px"
                    }}>
                        <Typography variant="h5" component="h3">
                            Please Enter Your Email Below
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
                                onClick={this.handleEmail}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </Paper>


            </MuiThemeProvider>
        )
      }
      if (this.state.page === 1) {
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
                        </div>
                        <div style={{
                            marginLeft: '230px',
                            marginTop: '50px'}}>
                        <Typography>{this.getDrawerContent(this.state.activeDrawer, steps)}</Typography>
                        </div>
                    </main>
                  </div>
            </MuiThemeProvider>
              )
      }
   }
}
export default Master