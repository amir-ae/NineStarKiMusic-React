import React, { Component } from "react";
import './style.css';

export class NumbersView extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="row text-center m-0 pt-3">
                    <div className={"col-2 text-right pr-2"}>
                        <pre>
                            {
                                this.props.numbers.map( p => <div key={ p.c } className={"text-secondary"}>
                                    { p.c }
                                </div>)
                            }
                        </pre>
                    </div>
                    <div className={"col-10 text-left number"}>
                        <pre>
                            {
                                this.props.numbers.map( p => <div key={ p.c } className={"text-brown number"}>
                                    { p.n.map( n => <span key={ n } onClick={ () => this.props.handleSelect(n) } className={"number mx-1"}>{ n }</span>)}
                                </div>)
                            }
                        </pre>
                    </div>
                </div>
                <div className={"text-center pb-2"}>
                    <small>{ "Click a number for music!" }</small>
                </div>
            </React.Fragment>
        )
    }
}