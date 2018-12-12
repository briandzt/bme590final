import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 4,
  },
});


class RadioButtons extends React.Component {
    state = {
        JPEG: false,
      PNG: false,
      TIFF: false,
      type: 'JPEG',
      count: 0,
  };

    handleSelect = event => {
    this.setState({ type: event.target.value });
  };

render()
{
    const {classes} = this.props;


    return (
        <div>
            <FormGroup>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Select Download Format:</FormLabel>
                <RadioGroup
                    className={classes.group}
                    value={this.state.type}
                    onChange={this.handleSelect}>
                    <FormControlLabel value="JPEG" control={<Radio />} label="JPEG" />
                    <FormControlLabel value="PNG" control={<Radio />} label="PNG" />
                    <FormControlLabel value="TIFF" control={<Radio />} label="TIFF" />
                </RadioGroup>
            </FormControl>
            </FormGroup>
        </div>

    )

}
}

RadioButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtons);