import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face'

// Import image to test api
const testImg = require('../img/test.jpg')

// Import face profile
const JSON_PROFILE = require('../descriptors/bnk48.json');

// Initial State
const INIT_STATE = {
    imageURL: testImg,
    fullDesc: null,
    detections: null,
    descriptors: null,
    match: null
};

class ImageInput extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INIT_STATE, faceMatcher: null };
    }

    componentDidMount = async () => {
        await loadModels();
        this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
        await this.handleImage(this.state.imageURL);
    }

    handleImage = async (image = this.state.imageURL) => {
        await getFullFaceDescription(image).then(fullDesc => {
            console.log(fullDesc);
            this.setState({ fullDesc });
            if (!!fullDesc) {
                this.setState({
                    fullDesc,
                    detections: fullDesc.map(fd => fd.detection),
                    descriptors: fullDesc.map(fd => fd.descriptor)
                });
            }
        });

        if (!!this.state.descriptors && !! this.state.faceMatcher) {
            let match = await this.state.descriptors.map(descriptor => 
                this.state.faceMatcher.findBestMatch(descriptor)
            );
            this.setState({ match });
        }
    }

    handleFileChange = async event => {
        this.resetState();
        await this.setState({
            imageURL: URL.createObjectURL(event.target.files[0]),
            loading: true
        });
        this.handleImage();
    }

    resetState = () => {
        this.setState({ ...INIT_STATE });
    }

    render() {
        const { imageURL, detections, match } = this.state;

        let drawBox = null;
        if (!!detections) {
            drawBox = detections.map((detections, i) => {
                let _H = detections.box.height;
                let _W = detections.box.width;
                let _X = detections.box._x;
                let _Y = detections.box._y;
                return (
                    <div key={i}>
                        <div 
                            style={{
                                position: 'absolute',
                                border: 'solid',
                                borderColor: 'blue',
                                height: _H,
                                width: _W,
                                transform: `translate(${_X}px,${_Y}px)`
                            }}
                        >
                            {!!match && !!match[i] ? (
                                <p
                                    style={{
                                        backgroundColor: 'blue',
                                        border: 'solid',
                                        borderColor: 'blue',
                                        width: _W,
                                        marginTop: 0,
                                        color: '#fff',
                                        transform: `translate(-3px,${_H}px)`
                                    }}
                                >
                                    {match[i]._label}
                                </p>
                            ) : null}
                        </div>
                    </div>
                );

            });
        }

        return (
            <div>
                <input 
                    id="myFileUpload"
                    type="file"
                    onChange={this.handleFileChange}
                    accept=".jpg, .jpeg, .png"
                />
                <div stype={{ position: 'relative' }}>
                    <div style={{ position: 'absolute' }}>
                        <img src={imageURL} alt="imageURL" />
                    </div>
                    {!!drawBox ? drawBox : null}
                </div>
            </div>
        )
    }
}

export default withRouter(ImageInput);