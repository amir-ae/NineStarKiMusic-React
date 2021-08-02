import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import PropTypes from 'prop-types';
import FormValidator from './FormValidator';
import ValidationMessage from './ValidationMessage';
import ValidateForm from './wholeFormValidation';
import { starMap } from './stars';
import { personality } from './NineStarKi';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            firstValue: '',
            secondValue: '',
            number: ''
        };

        this.rules = {
            number: { required: true }
        };
    }

    getOptions = (key) => {
        if (!starMap[key]) {
            return null;
        }

        return starMap[key].map(
            (el) => <option key={el} value={el}>{el}</option>
        );
    };

    handleFirstLevelChange = (event) => {
        const { clear } = this.props;
        clear();
        this.setState({
            firstValue: event.target.value,
            secondValue: '',
            date: '',
            number: ''
        });
    };

    handleSecondLevelChange = (event) => {
        const { clear } = this.props;
        clear();
        this.setState({
            secondValue: event.target.value,
            date: '',
        }, () => {
            const { firstValue, secondValue } = this.state;
            if (secondValue === '') {
                this.setState({
                    number: ''
                });
            } else {
                this.setState({
                    number: `${firstValue}.${secondValue}`
                });
            }
        });
    };

    getFirstLevelField = () => {
        const { firstValue } = this.state;
        return (
            <select onChange={this.handleFirstLevelChange} value={firstValue} style={{ width: '70px' }}>
                <option value="">---</option>
                {
                    Object.keys(starMap).map(
                        (el) => <option key={el} value={el}>{el}</option>
                    )
                }
            </select>
        );
    };

    getSecondLevelField = () => {
        const { firstValue, secondValue, date } = this.state;
        return (
            <select
                onChange={this.handleSecondLevelChange}
                value={secondValue}
                style={{ width: `${date ? 87 : 85}px` }}
                disabled={!firstValue}
            >
                <option value="">---</option>
                { this.getOptions(firstValue) }
            </select>
        );
    };

    handleDateChange = (date) => {
        const { number } = this.state;
        const { clear } = this.props;
        clear();
        if (date !== null) {
            this.setState({
                date,
                firstValue: '',
                secondValue: '',
                number: personality(date),
            }, () => {
                this.setState({
                    firstValue: number.substring(0, 1),
                    secondValue: number.substring(2)
                });
            });
        } else {
            this.setState({
                date: '',
                firstValue: '',
                secondValue: '',
                number: ''
            });
        }
    };

    render() {
        const { date } = this.state;
        const { show, submit, numberRef } = this.props;
        return (
            show && (
            <div className="bg-black text-white text-center p-4">
                <FormValidator
                    data={this.state}
                    rules={this.rules}
                    submit={submit}
                    validateForm={ValidateForm}
                >
                    <ValidationMessage field="form" />
                    <div className="p-1">
                        <div className="form-group">
                            <h6>Date of Birth</h6>
                            <div className="px-5">
                                <DatePicker
                                    value={date}
                                    onChange={(d) => this.handleDateChange(d)}
                                    className="bg-white text-body"
                                    calendarClassName="text-info"
                                    format="dd.MM.yyyy"
                                    locale="en"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <h6>Nine Star Ki</h6>
                            <div className="h5 px-5" ref={numberRef}>
                                {this.getFirstLevelField()}
                                {this.getSecondLevelField()}
                            </div>
                        </div>
                    </div>
                </FormValidator>
            </div>
            )
        );
    }
}

Editor.propTypes = {
    submit: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    numberRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired
};
