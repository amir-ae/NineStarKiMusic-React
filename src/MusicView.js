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
                        <div className={"col-7"}>
                        <pre>
                            <span className={"text-primary text-left musician-name"}>
                                { this.props.musicians.map( m => <div key={ m.id }>
                                    { `${m.name}` }
                                </div>) }
                            </span>
                        </pre>
                        </div>
                        <div className={"col-5 text-left"}>
                        <pre>
                            <span className={"font-italic text-info musician-data"}>
                                { this.props.musicians.map( m => <div key={ m.id }><small className={"pr-2"}>{ `${this.props.dataToShow(m)}` }</small></div>) }
                            </span>
                        </pre>
                        </div>
                    </div>
                </React.Fragment>
        )
    }
}