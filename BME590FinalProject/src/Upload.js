import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';
import { UploadField } from '@navjobs/upload';
import Button from "@material-ui/core/Button/Button";

class Upload extends Component {
	constructor() {
		super();
		this.state = {
			currentImageString: '',
		}
	}

	onUpload = (files) => {
		const reader = new FileReader()
		const file = files[0]
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			console.log(reader.result);
			this.setState({currentImageString: reader.result});
		}
	}

	render() {
		return (
			<div>
				<h2>Upload your image</h2>
				<UploadField onFiles={this.onUpload}>
					<div>
					<Button
                        variant="contained"
                        color="secondary"
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
				<img src={this.state.currentImageString} />
			</div>
		)
	}
}

export default Upload;