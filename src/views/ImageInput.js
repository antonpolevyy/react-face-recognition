import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { loadModels, getFullFaceDescription } from '../api/face'

// Import image to test api
const testImg = require('../img/test.jpg')

// Instal State
const INIT_STATE = {
    // imageURL: '../img/test.jpg',
    imageURL: testImg,
    fullDesc: null
};

class ImageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {...INIT_STATE};
    }

    componentDidMount = async () => {
        await loadModels();
        await this.handleImage(this.state.imageURL);
    }

    handleImage = async (image = this.state.imageURL) => {
        await getFullFaceDescription(image).then(fullDesc => {
            console.log(fullDesc);
            this.setState({ fullDesc });
        });
    }

    render() {
        const { imageURL } = this.state;
        return (
            <div>
                <img src={imageURL} alt="imageURL" />
            </div>
        )
    }
}

export default withRouter(ImageInput);