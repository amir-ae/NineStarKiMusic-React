import React, { Component } from "react";
import { ValidateData } from "./validation";
import { ValidationContext } from "./ValidationContext";

export class FormValidator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            dirty: {},
            formSubmitted: false,
            getMessagesForField: this.getMessagesForField
        }
    }

    static getDerivedStateFromProps(props, state) {
        state.errors = ValidateData(props.data, props.rules);
        if (state.formSubmitted && Object.keys(state.errors).length === 0) {
            let formErrors = props.validateForm(props.data);
            if (formErrors.length > 0) {
                state.errors.form = formErrors;
            }
        }
        return state;
    }

    get formValid() {
        return Object.keys(this.state.errors).length === 0;
    }

    handleChange = (event) => {
        let name = event.target.name;
        this.setState(state => state.dirty[name] = true);
    };

    handleClick = (event) => {
        this.setState({ formSubmitted: true }, () => {
            if(this.formValid) {
                this.props.submit(this.props.data);
            }
        })
    };

    getButtonClasses() {
        return this.state.formSubmitted && !this.formValid
            ? "btn-danger" : "btn-light";
    }

    getMessagesForField = (field) => {
        return (this.state.formSubmitted || this.state.dirty[field])
            ? this.state.errors[field] || [] : []
    };

    render() {
        return (
            <React.Fragment>
                <ValidationContext.Provider value={ this.state }>
                    <div onChange={ this.handleChange }>
                        { this.props.children }
                    </div>
                </ValidationContext.Provider>

                <div className={"text-center"}>
                    <button className={`btn ${ this.getButtonClasses() }`}
                            onClick={ this.handleClick }
                            disabled={ this.state.formSubmitted && !this.formValid } >
                        Select
                    </button>
                </div>
            </React.Fragment>
        )
    }
}