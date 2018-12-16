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
import FileSaver from 'file-saver';
import saveAs from 'file-saver';
import Plot from 'react-plotly.js'


const drawerWidth = 240;
var imgformat = "";
var valid = false
var message = ""
var modifier = 0
var imagepresent = false
var iszip = false
var zipfile = new JSZip();
var zipoutputfile = new JSZip();
var read_zip = new JSZip;
var fileoutput = "";
var validemail = false
var filetitle = ""
var stringarray = []
var uploadsuccess = false
var img = ""
var imageOutputString = ""
var zippedString = ""
var imagedata
var receivedZip
var finalZip = []
var testingZip = []
var originalhist = []
var processhist = []
var imagesizes = 0
var brewedimagesizes = []
var data = []
var data1 = []
var base64reps = []
var brewedbase64reps = []
var imagenum = 1
var brewedimagenum = 1
var prefix = ""
var xvar = []


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
        stats: [],
        contrast: 5,
        imgformat: '',
        message: "",
        zippedString: "",
        actionList: ['','',''],
        uploadedImage: "",

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getStepContent = this.getStepContent.bind(this)
        this.imageValidate = this.imageValidate.bind(this)
        this.zipThis = this.zipThis.bind(this)
        this.zipOutput = this.zipOutput.bind(this)
}

getDrawerContent(drawer, steps) {
        switch (drawer) {
            case 0:
                return(
                    <div>
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
                      (iszip)? (<div>Zip File</div>) : (<img src={this.state.uploadedImage} width={200} height={200}/>)

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
              <div>

                  Image Size: {imagesizes}
              </div>
              <div>
                  Histogram: {processhist}
                  {console.log(typeof processhist)}
                  {console.log(typeof originalhist)}
              </div>
              <div>
                    Number of images:
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
                                        <TableCell numeric>{imagesizes.split(",")[0]} X {imagesizes.split(",")[1]}</TableCell>
                                    </TableRow>
                                </TableBody>
                              </Table>
                            <Divider />
                            <div>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <h3>
                                                    Original Image(s)
                                                </h3>
                                            </TableCell>
                                            <TableCell>
                                                <h3>
                                                    Processed Image(s)
                                                </h3>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><img src={this.state.currentImageString} width={300} height={300}/></TableCell>
                                            <TableCell><img src={this.state.brewedImageString} width={300} height={300}/></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                    {
                                                    (originalhist.length > 0)?
                                                        (
                                                            <Plot
                                                            data={data}
                                                            layout={{title: 'Original Histogram'}}
                                                            />
                                                        ):(<div></div>)
                                                }

                                            </TableCell>
                                        </TableRow>

                                            <TableRow>
                                            <TableCell>
                                                {
                                                    (originalhist.length > 0)?
                                                        (
                                                            <Plot
                                                            data={data}
                                                            layout={{title: 'Processed Histogram'}}
                                                            />
                                                        ):(<div></div>)
                                                }
                                            </TableCell>
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
                                    {this.zipThis(0)}
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

zipThis(count){
            imageOutputString = this.state.currentImageString.split(",")[1]
        zipfile.file(filetitle, imageOutputString, {base64: true});
        zipfile.generateAsync({type:"blob"})
            .then(function(content) {
                let Newreader = new FileReader();
                Newreader.readAsDataURL(content);
                Newreader.onloadend = function() {
                    zippedString = Newreader.result
                    if (count === 1) {
                        saveAs(content, "archive.zip")
                    }

                }
            });

        if (count === 2) {
            for (let i = 0; i < testingZip.length; i++) {
                return (
                    <div>
                        <img src={finalZip[i]} width={200} height={200}/>
                        Hello?
                    </div>
                )
            }
        }
}

zipOutput() {
        testingZip = testingZip.split(",")[1]
    read_zip.loadAsync(testingZip, {base64: true}).then(function (read_zip) {
        Object.keys(read_zip.files).forEach(function (filename) {
            JSZip.file(filename).async('nodebuffer').then(function (content) {
                finalZip.push(content)
                console.log(content)
            });
        });
    });
}



handleNext = () => {
        if (this.state.activeStep === 0) {
            if (iszip) {
                imagedata = this.state.currentImageString
            }
            else {
                imagedata = zippedString
            }
            if(valid) {
                axios.post("http://vcm-7306.vm.duke.edu:5000/api/upload", {
                "email": this.state.name,
                "imageset":imagedata,
            }).then((response) => {
                if(response.data.response === "ok") {
                    valid = true
                    uploadsuccess = true
                    originalhist = response.data.hist.toString()
                    let histvalues = originalhist.split(',')

                    var traceblue = {
                        x:xvar,
                        y:histvalues.slice(0,255),
                        type: 'lines+points',
                        marker: {color: 'blue'}
                    }
                    var tracegreen = {
                        x:xvar,
                        y:histvalues.slice(256,512),
                        type: 'lines+points',
                        marker: {color: 'green'}
                    }
                    var tracered = {
                        x:xvar,
                        y:histvalues.slice(513,768),
                        type: 'lines+points',
                        marker: {color: 'red'}
                    }
                    data = [traceblue, tracegreen, tracered];

                    imagesizes = response.data.imgsize[0].toString()
                    console.log(imagesizes.substring(0,3))
                    base64reps = prefix + "," + response.data.image[0]
                    imagenum = response.data.image.length
                    this.setState(state => ({
                        activeStep: state.activeStep + 1,
                        uploadedImage: base64reps
                    }));

                }
                else if (response.data.response === "The user does not exist"){
                    valid = false
                    uploadsuccess = false
                    alert("hello?")
                }
            })


            }
            else {
                if(modifier === 1) {
                    alert(message)
                }
                else if (uploadsuccess = false) {
                    alert("Upload error, either click submit again or try a different image.")
                }
                else{
                    alert("Please upload an image in a valid file format (.png, .jpg, .tiff, or .zip.)")
                }
            }
        }
        else if(this.state.activeStep === 2) {
            if (this.state.process === "ContStretch") {
                var cont = this.state.contrast
            }
            else {
                cont = ""
            }

            this.setState({
                activeStep: this.state.activeStep + 1,
                actionList: [this.state.process, this.state.value, cont]
            })

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
        axios.post("http://vcm-7306.vm.duke.edu:5000/api/image-processing/action", {
        "email": this.state.name,
            "action": this.state.actionList,
      }).then((response) => {
          if(response.data.response !== "KeyError" && response.data.response !== "image processing failed") {
            alert("Images Successfully Submitted For Processing")
              /*
              processhist = response.data.hist.toString()

              let processvalues = processhist.split(',')
                    var processblue = {
                        x:xvar,
                        y:processvalues.slice(0,255),
                        type: 'lines+points',
                        marker: {color: 'blue'}
                    }
                    var processgreen = {
                        x:xvar,
                        y:processvalues.slice(256,512),
                        type: 'lines+points',
                        marker: {color: 'green'}
                    }
                    var processred = {
                        x:xvar,
                        y:processvalues.slice(513,2768),
                        type: 'lines+points',
                        marker: {color: 'red'}
                    }
                    data1 = [processblue, processgreen, processred];
                    */
                    brewedimagesizes = response.data.imgsize[0]
                    brewedbase64reps = prefix + "," + response.data.image[0]
                    brewedimagenum = response.data.image.length
                    this.setState({
                        brewedImageString: brewedbase64reps
                    });
        }


      })
    };

handleChange = name => event => {
    this.setState({
      name: event.target.value,
    });
  };

  handleEmail = name => {
      axios.post("http://vcm-7306.vm.duke.edu:5000/api/toolbox/validate_email", {
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
            imgformat = reader.result.split(";")[0].split("/")[1]
            prefix = reader.result.split(",")[0]
            testingZip = reader.result
			this.setState({currentImageString: reader.result});
		}
	}

  handleOutput = name => {
       for (var i = 1; i <= 768; i++) {
           xvar.push(i);
       }
       this.setState({
          activeDrawer: 2
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