import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



class GetStats extends Component {

	componentDidMount() {
		this.getData();
	}

    state = {
        'stats': []

    }

    getData = () => {
        axios.get('http://10.0.1.223/cgi-bin/UserStats.cgi?' + this.props.email).then( (data) => {
            console.log(data)
            this.setState({'stats': data.data})
        });


    }

    render() {
        return (
        <div>

            <div style={{margin: '10px'}}>
            Reports for user:  {(this.state.stats.length > 0) ? this.state.name: "No Data"}
            </div>
	<Table>
        <TableHead>
          <TableRow>
            <TableCell>Report Type</TableCell>
            <TableCell numeric>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
            	<TableCell>Report A</TableCell>
                <TableCell numeric>{this.state.stats[0]}</TableCell>
            </TableRow>
            <TableRow>
            	<TableCell>Report B</TableCell>
                <TableCell numeric>{this.state.stats[1]}</TableCell>
            </TableRow>
            <TableRow>
            	<TableCell>Report C</TableCell>
                <TableCell numeric>{this.state.stats[2]}</TableCell>
            </TableRow>
            <TableRow>
            	<TableCell>Report D</TableCell>
                <TableCell numeric>{this.state.stats[3]}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
        </div>
        );
    }


}

export default GetStats;