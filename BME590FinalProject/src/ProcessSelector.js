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
      HistEq: false,
      LogComp: false,
      RevVid: false,
      ContStretch: false,
      visible: false,
      process: "",
      value: 'rgb',
      count: 0,
  };

  handleChange1 = process => event => {
    this.setState({ [process]: event.target.checked });
    this.setState({'count': this.state.count + 1});

      if(this.state.count % 2 === 0) {
           this.setState({visible:true})
        }
        else{
            this.setState({visible:false})
      }

  };
  handleChange = process => event => {
    this.setState({ [process]: event.target.checked });
  };
   handleSelect = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const vision = this.state.visible

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl1}>
          <FormLabel component="legend">Select Processing Techniques</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                    checked={this.state.HistEq}
                    onChange={this.handleChange1('HistEq')}
                    value="HistEq" />
              }
              label="Histogram Equalization"
            />



               <div>
            {
                (vision) ? (
                    <div>
                        <FormControl component="fieldset" className={classes.formControl2}>
                        <FormLabel component="legend">Process Which Type of Image?</FormLabel>
                        <RadioGroup
                        aria-label="Processing Type"
                        className={classes.group}
                        value={this.state.value}
                        onChange={this.handleSelect}>

                            <FormControlLabel value="rgb" control={<Radio />} label="Original RGB Image" />
                            <FormControlLabel value="gray" control={<Radio />} label="Grayscale Image" />
                        </RadioGroup>
                        </FormControl>

                    </div>
                ) : (
                    <div>
                    </div>
                )
            }
            </div>

          <FormControlLabel
              control={
                <Checkbox
                    checked={this.state.LogComp}
                    onChange={this.handleChange('LogComp')}
                    value="LogComp" />
              }
              label="Log Compression"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.RevVid}
                  onChange={this.handleChange('RevVid')}
                  value="RevVid"
                />
              }
              label="Reverse Video"
            />
              <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.ContStretch}
                  onChange={this.handleChange('ContStretch')}
                  value="ContStretch"
                />
              }
              label="Contrast Stretching"
            />
          </FormGroup>
          <FormHelperText>Select as many or as few as you'd like (as long as it's >0)</FormHelperText>
        </FormControl>
      </div>
    );
  }
}



        Checkboxes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkboxes);