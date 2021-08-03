import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ValidationContext from './validationContext';

export default class ValidationMessage extends Component {
    render() {
        const { field } = this.props;
        const { getMessagesForField } = this.context;
        const messages = getMessagesForField(field);
        return messages.map((err) => (
            <div className="small bg-danger text-white mt-1 p-1" key={err}>
                { err }
            </div>
        ));
    }
}

ValidationMessage.contextType = ValidationContext;

ValidationMessage.propTypes = {
    field: PropTypes.string.isRequired
};
