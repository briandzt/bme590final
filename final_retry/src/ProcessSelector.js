import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';




const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl1: {
    margin: theme.spacing.unit * 4,
  },
    formControl2: {
    margin: theme.spacing.unit,
  },
});

class Checkboxes extends React.Component {
  state = {
      process: 'HistEq',
      value: 'rgb',
      count: 0,
  };

   handleColorType = event => {
    this.setState({ value: event.target.value });
  };
   handleProcess = event => {
       this.setState({process: event.target.value});
   };

  render() {

    return (
      <div>

          <FormControl component="fieldset">
              <FormLabel component="legend">Process Which Type of Image?</FormLabel>
              <RadioGroup
                  aria-label="Processing Type"
                  value={this.state.value}
                  onChange={this.handleColorType}>
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
      </div>
    );
  }
}



        Checkboxes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkboxes);