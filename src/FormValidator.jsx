import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ValidateData from './validation';
import ValidationContext from './ValidationContext';

export default class FormValidator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            dirty: {},
            formSubmitted: false,
            getMessagesForField: this.getMessagesForField,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { data, rules } = props;
        state.errors = ValidateData(data, rules);
        if (state.formSubmitted && Object.keys(state.errors).length === 0) {
            const formErrors = props.validateForm(data);
            if (formErrors.length > 0) {
                state.errors.form = formErrors;
            }
        }
        return state;
    }

    get formValid() {
        const { errors } = this.state;
        return Object.keys(errors).length === 0;
    }

    handleChange = (event) => {
        const { name } = event.target.name;
        this.setState((state) => { state.dirty[name] = true; });
    };

    handleClick = () => {
        const { submit, data } = this.props;
        this.setState({ formSubmitted: true }, () => {
            if (this.formValid) {
                submit(data);
            }
        });
    };

    getButtonClasses() {
        const { formSubmitted } = this.state;
        return formSubmitted && !this.formValid
            ? 'btn-danger' : 'btn-light';
    }

    getMessagesForField = (field) => {
        const { formSubmitted, dirty, errors } = this.state;
        return ((formSubmitted || dirty[field])
            ? errors[field] || [] : []);
    };

    render() {
        const { children } = this.props;
        const { formSubmitted } = this.state;
        return (
            <>
                <ValidationContext.Provider value={this.state}>
                    <div onChange={this.handleChange}>
                        {children}
                    </div>
                </ValidationContext.Provider>
                <div className="text-center">
                    <button
                        type="submit"
                        className={`btn ${this.getButtonClasses()}`}
                        onClick={this.handleClick}
                        disabled={formSubmitted && !this.formValid}
                    >
                        Select
                    </button>
                </div>
            </>
        );
    }
}

FormValidator.propTypes = {
    data: PropTypes.object.isRequired,
    rules: PropTypes.object.isRequired,
    validateForm: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
};
