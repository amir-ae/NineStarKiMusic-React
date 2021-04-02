import React, { Component } from "react";
import './style.css';

export class NumbersView extends Component {

    render() {
        return (
            <div className={"py-2 pr-3"}>
                <div className="row text-center pt-2">
                    <div className={"col-2 text-right"} style={{padding: "2px 5px"}}>
                        {
                            this.props.numbers.map( p => <div key={ p.c } className={"text-secondary"}>
                                { p.c }
                            </div>)
                        }
                    </div>
                    <div className={"col-10 text-left number"} style={{padding: "2px 13px"}}>
                        {
                            this.props.numbers.map( p => <div key={ p.c } className={"text-primary number"}>
                                { p.n.map( n => <span key={ n } onClick={ () => this.props.handleSelect(n) } className={"number mx-1"}>{ n }</span>)}
                            </div>)
                        }
                    </div>
                </div>
                <div className={"text-center"}>
                    <small>{ "Нажмите номер для музыки!" }</small>
                </div>
            </div>
        )
    }
}