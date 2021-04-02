import React, {Component} from "react";
import { Editor } from "./Editor";
import { Display } from "./Display";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            showEditor: true
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

    toggleEditor = ( showEditor ) => {
        this.setState({ showEditor: showEditor });
    };

    render() {
        return (
            <React.Fragment>
                <Editor submit={ this.submitData }
                    clear={this.clearData} show={this.state.showEditor}
                    numberRef={this.numberRef} />
                <Display data={ this.state.formData} showEditor={ this.toggleEditor }/>
            </React.Fragment>
        )
    }
}

