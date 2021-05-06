import React, { Component } from "react";
import './style.css';

export class MusicView extends Component {

    render() {
        return (
            this.props.musicians.length > 0 &&
                <React.Fragment>
                    <div className={"text-center text-dark"}>
                        <small className="occasion-header">{ this.props.name }</small>
                    </div>
                    <div className={"row"}>
                        <div className={"col-7 pr-0"}>
                        <pre>
                            <span className={"text-red text-left musician-name"}>
                                { this.props.musicians.map( m => <div key={ m.id }>
                                    <small>{ `${m.name}` }</small>
                                </div>) }
                            </span>
                        </pre>
                        </div>
                        <div className={"col-5 pl-1"}>
                        <pre>
                            <span className={"font-italic text-info text-left musician-data"}>
                                { this.props.musicians.map( m => <div key={ m.id }><small className={"pr-2"}>{ `${this.props.dataToShow(m)}` }</small></div>) }
                            </span>
                        </pre>
                        </div>
                    </div>
                </React.Fragment>
        )
    }
}