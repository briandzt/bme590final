import React from "react";
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Upload from './Upload'
import Checkboxes from "./ProcessSelector";
import RadioButtons from './DownloadSelector'


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


function getSteps() {
  return ['Upload Images', 'Select Processing Method', 'Select Download Format'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
          <div>
              <Upload />
          </div>

    );
    case 1:
      return (
          <div>
              <Checkboxes/>
          </div>
      );
    case 2:
      return (
          <div>
              <RadioButtons/>
          </div>

      );
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    handleSubmit = () => {
    };


      render() {
    const classes  = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
        <MuiThemeProvider theme={theme}>
        <div>

            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>

                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>

                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}



            </Stepper>
            {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer} style={{margin: '20px'}}>
            <Typography>All steps completed </Typography>
              <Button onClick={this.handleReset}
                    color = "error"
                    variant="contained"
                    className={classes.button}
            >
              Start Over
            </Button>

              <Button onClick={this.handleSubmit}
                    color = "primary"
                    variant="contained"
                    className={classes.button}
            >
              Submit
            </Button>
          </Paper>
        )}

        </div>
             </MuiThemeProvider>
    );
  }

}



export default VerticalLinearStepper;



