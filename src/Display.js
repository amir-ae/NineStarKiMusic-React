import React, { Component } from "react";
import { NumbersView } from "./NumbersView";
import { MusicView } from "./MusicView";
import { processNumbers, processNumber } from "./NineStarKi.js";
import { russian, classical, essential, occasions, genres } from "./Musicians";

export class Display extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedNumber: "",
            classical: "",
            essential: "",
            russian: "",
            dataType: 0,
            buttonLabel: "Recordings",
            windowHeight: window.innerHeight
        };
        this.classical = React.createRef();
    }

    handleClick = () => {
        switch (this.state.dataType)
        {
            case 0:
                this.setState({ dataType: 1, buttonLabel: "Numbers" });
                break;
            case 1:
                this.setState({ dataType: 2, buttonLabel: "Genres" });
                break;
            case 2:
            default:
                this.setState({ dataType: 0, buttonLabel: "Recordings" });
                break;
        }
    };

    getUnique = (arr, comp, cond) => cond ? arr : arr.map(e => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter((e) => arr[e]).map(e => arr[e]);

    format = ( r ) => {
        let f = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let k = f.findIndex( p => p.c === r[i][j].c);
                if (k !== -1) {
                    f[k].n.push(r[i][j].n);
                }
                else
                    f.push({ c: r[i][j].c, n: [ r[i][j].n ]});
            }
        }
        f.sort((a,b) => (a.c > b.c) ? 1 : ((b.c > a.c) ? -1 : 0));
        if (f.findIndex(p => p.c === "5%") !== -1)
            f.splice(f.findIndex(p => p.c === "0%") + 1 || 0, 0, f.splice(f.findIndex(p => p.c === "5%"), 1)[0]);
        if (f.findIndex(p => p.c === "100%") !== -1)
            f.splice(f.length - 1, 0, f.splice(f.findIndex(p => p.c === "100%"), 1)[0]);

        f.forEach(p => p.c = p.c.length === 2 ? "  " + p.c : p.c.length === 3 ? " " + p.c : p.c);
        f.forEach(p => p.nl = p.n.join("  "));

        return f;
    };

    handleSuggestion = () => {
        let allMusicians = [], musicians = [];
        for (let i = 0; i < occasions.length; i++ ) {
            musicians[i] = [];
            allMusicians[i] = essential
                .filter( a => a.hasOwnProperty('numbers'))
                .filter( a => a.occasion.includes(i));

            allMusicians[i].forEach(musician => {
                if (this.check(musician)) {
                    musicians[i].push(musician);
                }
            });
        }

        this.setState({
            selectedNumber: null,
            classical: null,
            essential: musicians,
            russian: null,
            showMusicians: true });

        this.props.showEditor(false);
    };

    check = (musician) => {
        if (!musician.hasOwnProperty('numbers') || !musician['numbers'].includes(',')
            || !musician['numbers'].includes('&') && musician['numbers'].split(",").length - 1 < 2)
        {
            return false;
        }

        let numbers = musician['numbers']
            .replace(" & ", ", ")
            .split(", ");

        let result = [];

        numbers.forEach(num =>
        {
            if (num.length === 1)
            {
                return false;
            }
            let personality = `${num[0]}.${num[1]}.${num[2]}`;
            result.push(processNumbers(this.props.data["number"], personality));
        });

        const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

        return arrAvg(result) > 50;
    };

    handleSelect = (number) => {
        let classicalMusicians = classical.filter( m => m.number === number);
        let russianMusicians = russian.filter( m => m.number === number);
        let essentialMusicians = [];
        for (let i = 0; i < occasions.length; i++ ) {
            essentialMusicians[i] = essential
                .filter( a => a.hasOwnProperty('numbers') && a.numbers.includes(number))
                .filter( a => a.occasion.includes(i));
        }

        this.setState({
            selectedNumber: number,
            classical: classicalMusicians,
            essential: essentialMusicians,
            russian: russianMusicians,
            showMusicians: true });

        this.props.showEditor(false);
    };

    dataToShow = (musician) => {
        switch (this.state.dataType) {
            case 2:
                return musician.numbers;
            case 1:
                return musician.recording;
            case 0:
            default:
                return musician.genre.map(g => genres[g].name).join(", ");
        }
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({ showMusicians: false });
        }
    }

    render() {
        let keys = Object.keys(this.props.data);
        if (keys.length === 0) {
            return <div className={"bg-dark"} style={{ height: this.state.windowHeight}}>
            </div>
        } else {
            let numbers = this.format(processNumber(this.props.data["number"])).reverse();
            return (
                <div className={"bg-white"}>
                    { !this.state.showMusicians ?
                        <React.Fragment>
                            <NumbersView numbers = { numbers } handleSelect = { this.handleSelect } />
                            <div className="text-center m-2 p-1">
                                <button className={`btn btn-primary mx-1 px-2`} onClick={ this.handleSuggestion }>
                                    Suggestions
                                </button>
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div style={{ height: this.state.windowHeight-65, overflowX: 'hidden' }}>
                                { this.state.selectedNumber ?
                                    <div className={"text-brown text-center m-2 p-2"}>
                                        { `${this.state.selectedNumber[0]}.${this.state.selectedNumber[1]}.${this.state.selectedNumber[2]}` }
                                    </div>
                                    :
                                    <div className={"text-red text-center m-2 p-2"}>
                                        { `${this.props.data["number"]}` }
                                    </div>
                                }

                                { this.state.russian && <MusicView name="RUSSIAN MUSICIANS"
                                                                   musicians={ this.state.russian }
                                                                   dataToShow={ m => m.city ? m.city : m.country } />
                                }
                                { this.state.classical && <MusicView name="CLASSIC COMPOSERS"
                                                                     musicians={ this.state.classical }
                                                                     dataToShow={ m => m.country } />
                                }
                                {
                                    occasions.map( (o, i) =>
                                        this.state.essential[i].some(a => a.occasion.includes(i)) &&
                                        <MusicView name={ o.name.toString() }
                                                   key={ i }
                                                   musicians={ this.getUnique(this.state.essential[i], 'name', this.state.showRecordings) }
                                                   dataToShow={ m => this.dataToShow(m) } />
                                    )
                                }
                            </div>
                            <div className="text-center m-2 p-1">
                                <button className={`btn btn-secondary mx-1 px-2`}
                                        onClick={ () => {
                                            this.setState({ showMusicians: false });
                                            this.props.showEditor(true);
                                        } }>
                                    Back
                                </button>
                                <button className={`btn btn-primary mx-1 px-2`}
                                        onClick={ this.handleClick }>
                                    { this.state.buttonLabel }
                                </button>
                            </div>
                        </React.Fragment>
                    }
                </div>
            )}
        }
    }