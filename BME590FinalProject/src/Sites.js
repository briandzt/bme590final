import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton'
import axios from 'axios';

class Sites extends Component {

    state = {
        'sites': []

    }

    getData = () => {
        axios.get('http://adpl.suyash.io/api/sites').then( (data) => {
            console.log(data)
            this.setState({'sites': data.data})
        });


    }

    render() {
        return (
        <div>
            <RaisedButton label="Test" primary={true} onClick={this.getData} style={{margin: '20px'}}/>

            <div style={{margin: '10px'}}>
            {
                (this.state.sites.length > 0) ? this.state.sites[1]: "NOPE"
            }
            </div>

        </div>
        );
    }


}

export default Sites;