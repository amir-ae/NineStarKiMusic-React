import React, { Component } from "react";
import { FormValidator } from "./FormValidator";
import { ValidationDisplay } from "./ValidationDisplay";
import { ValidateForm } from "./wholeFormValidation";
import DatePicker from "react-date-picker";
import { starMap } from "./stars.js";
import { personality } from "./NineStarKi";

export class Editor extends Component {

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
            (el, i) => <option key={i} value={ el }>{ el }</option>
        );
    };

    handleFirstLevelChange = (event) => {
        this.props.clear();
        this.setState({
            firstValue: event.target.value,
            secondValue: '',
            date: '',
            number: ''
        });
    };

    handleSecondLevelChange = (event) => {
        this.props.clear();
        this.setState({
            secondValue: event.target.value,
            date: ''
        }, () => {
            if (this.state.secondValue === "") {
                this.setState({
                    number: ''
                });
            } else {
                this.setState({
                    number: `${this.state.firstValue}.${this.state.secondValue}`
                });
            }
        });
    };

    getFirstLevelField = () => {
        return (
            <select onChange={this.handleFirstLevelChange} value={this.state.firstValue} style={{width: "70px"}}>
                <option value="">---</option>
                {
                    Object.keys(starMap).map(
                        (el, i) => <option key={i} value={ el }>{ el }</option>
                    )
                }
            </select>
        )
    };

    getSecondLevelField = () => {
        return (
            <select onChange={this.handleSecondLevelChange} value={this.state.secondValue}
                    style={{width: `${this.state.date ? 87 : 85}px`}}
                    disabled={!this.state.firstValue}>
                <option value="">---</option>
                { this.getOptions(this.state.firstValue) }
            </select>
        )
    };

    handleDateChange = ( date ) => {
        this.props.clear();
        if ( date !== null ) {
            this.setState({
                date: date,
                firstValue: '',
                secondValue: '',
                number: personality(date)
            }, () => {
                this.setState({
                    firstValue: this.state.number.substring(0, 1),
                    secondValue: this.state.number.substring(2)
                })
            })
        }
        else {
            this.setState({
                date: '',
                firstValue: '',
                secondValue: '',
                number: ''
            });
        }

};
    render() {
        return (
            this.props.show && <div className={"bg-black text-white text-center p-4"}>
                <FormValidator data={ this.state } rules={ this.rules }
                               submit={ this.props.submit }
                               validateForm={ ValidateForm } >

                    <ValidationDisplay field={"form"} />
                    <div className="p-1">
                        <div className="form-group">
                            <label className={"h6"}>Date of Birth</label>
                            <div className="px-5">
                                <DatePicker
                                    value={ this.state.date }
                                    onChange={ date => this.handleDateChange( date ) }
                                    className={"bg-white text-body"}
                                    calendarClassName={"text-info"}
                                    format={"dd.MM.yyyy"}
                                    locale="en"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className={"h6"}>Nine Star Ki</label>
                            <div className={"h5 px-5"} ref={ this.props.numberRef }>
                                {this.getFirstLevelField()}
                                {this.getSecondLevelField()}
                            </div>
                        </div>
                    </div>
                </FormValidator>
            </div>

        )
    }
}