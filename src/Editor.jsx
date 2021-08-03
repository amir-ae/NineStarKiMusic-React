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
            firstSelect: '',
            secondSelect: '',
            number: ''
        };
        this.rules = {
            number: { required: true }
        };
    }

    handleFirstLevelChange = (event) => {
        const { clear } = this.props;
        clear();
        this.setState({
            firstSelect: event.target.value,
            secondSelect: '',
            date: '',
            number: ''
        });
    };

    handleSecondLevelChange = (event) => {
        const { clear } = this.props;
        clear();
        this.setState({
            secondSelect: event.target.value,
            date: '',
        }, () => {
            const { firstSelect, secondSelect } = this.state;
            if (secondSelect === '') {
                this.setState({
                    number: ''
                });
            } else {
                this.setState({
                    number: `${firstSelect}.${secondSelect}`
                });
            }
        });
    };

    handleDateChange = (date) => {
        const { clear } = this.props;
        clear();
        if (date !== null) {
            this.setState({
                date,
                firstSelect: '',
                secondSelect: '',
                number: personality(date),
            }, () => {
                const { number } = this.state;
                this.setState({
                    firstSelect: number.substring(0, 1),
                    secondSelect: number.substring(2)
                });
            });
        } else {
            this.setState({
                date: '',
                firstSelect: '',
                secondSelect: '',
                number: ''
            });
        }
    };

    getFirstOptions = () => Object.keys(starMap).map(
        (el) => <option key={el} value={el}>{el}</option>
    );

    getSecondOptions = (key) => {
        if (!starMap[key]) {
            return null;
        }
        return starMap[key].map(
            (el) => <option key={el} value={el}>{el}</option>
        );
    };

    render() {
        const { firstSelect, secondSelect, date } = this.state;
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
                                <select
                                    name="firstSelect"
                                    value={firstSelect}
                                    onChange={this.handleFirstLevelChange}
                                    style={{ width: '70px' }}
                                >
                                    <option value="">---</option>
                                    { this.getFirstOptions() }
                                </select>
                                <select
                                    name="secondSelect"
                                    value={secondSelect}
                                    onChange={this.handleSecondLevelChange}
                                    style={{ width: `${date ? 87 : 85}px` }}
                                    disabled={!firstSelect}
                                >
                                    <option value="">---</option>
                                    { this.getSecondOptions(firstSelect) }
                                </select>
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
