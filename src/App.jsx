import React, { Component } from 'react';
import Editor from './Editor';
import Display from './Display';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            showEditor: true,
        };
        this.numberRef = React.createRef();
    }

    submitData = (newData) => {
        this.setState({ formData: newData });
    };

    clearData = () => {
        this.setState({ formData: [] });
        this.numberRef.current.focus();
    };

    toggleEditor = (showEditor) => {
        this.setState({ showEditor });
    };

    render() {
        const { formData, showEditor } = this.state;
        return (
            <>
                <Editor
                    submit={this.submitData}
                    clear={this.clearData}
                    show={showEditor}
                    numberRef={this.numberRef}
                />
                <Display
                    data={formData}
                    showEditor={this.toggleEditor}
                />
            </>
        );
    }
}
