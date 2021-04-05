import React, { Component } from "react";
import { NumbersView } from "./NumbersView";
import { MusicView } from "./MusicView";
import { starMap, starElement } from "./stars.js";
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
            buttonLabel: "Записи",
            windowHeight: window.innerHeight
        };
        this.classical = React.createRef();
    }

    handleClick = () => {
        switch (this.state.dataType)
        {
            case 0:
                this.setState({ dataType: 1, buttonLabel: "Числа" });
                break;
            case 1:
                this.setState({ dataType: 2, buttonLabel: "Жанры" });
                break;
            case 2:
            default:
                this.setState({ dataType: 0, buttonLabel: "Записи" });
                break;
        }
    };

    getUnique = (arr, comp, cond) => cond ? arr : arr.map(e => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter((e) => arr[e]).map(e => arr[e]);

    compareNumbers = (a, b) => {
        const q = starElement[a] - starElement[b];

        if (a === b)
            return 'I';
        else if (q === 0)
            return 'i';
        else if (q === 1 || q === -4)
            return 's';
        else if (q === -1 || q === 4)
            return 't';
        else if (q === -2 || q === 3)
            return 'd';
        else if (q === 2 || q === -3)
            return 'c';
        else
            return 'n';
    };

    evaluate = (r1, r2, r3, r4) => {
        let x = 0;

        switch(r1) {
            case 's':
            case 't':
                x += 50;
                break;
            case 'I':
            case 'i':
				x += 35;
				if (r3 === 'c')
                    x += 10;
                break;
            case 'd':
                x += 10;
                break;
            default :
                break;
        }

        switch(r2) {
            case 's':
            case 't':
                x += 35;
                break;
            case 'I':
            case 'i':
                x += 20;
                break;
            case 'd':
                x += 5;
                break;
            case 'c':
                if (r1 !== 'c')
                    x += 10;
                break;
            default :
                x += 5;
                break;
        }

        switch(r3) {
            case 'I':
                x += 30;
                if ( r1 === 's')
                    x += 5;
                break;
            case 'i':
            case 't':
                if (r1 !== 'c') {
                    x += 10;
                    if (r1 === 'i' || r1 === 'I')
                        x += 5;
                }
                break;
            case 's':
                x += 30;
                if (r2 === 'i' || r2 === 'I')
                    x += 5;
                if (r1 === 'd' || r1 === 'i' || r1 === 'I')
                    x += 10;
                break;
            case 'c':
                if (r1 === 't' || (r2 === 't' && (r1 === "i" || r1 === "I")))
                    x += 5;
                break;
            default :
                break;
        }

        switch(r4) {
            case 'i':
            case 'I':
                x += 5;
                if (r1 === 'i' || r1 === 't')
                    x += 15;
                break;
            default :
                break;
        }

        if (r1 === 'c' && r2 === 'c' && r3 === 'I') {
            x += 50;
        }

        if (r1 === 's' && r2 === 's' && r3 === 's') {
            x -= 20;
        }

        if (x > 100) {
            x = 100;
        }

        return x;
    };

    processNumber = (x) => {
        let x1 = x.substring(0, 1);
        let x2 = x.substring(2, 3);
        let x3 = x.substring(4);
        let r = new Array(9);

        for ( let i = 0; i < 9; i++) {
            let y1 = (i + 1).toString();
            let r1 = this.compareNumbers(x1, y1);
            r[i] = new Array(9);

            for (let j = 0; j < 9; j++) {
                let k = starMap[y1][j];
                let y2 = k.substring(0, 1);
                let y3 = k.substring(2);
                let r2 = this.compareNumbers(x2, y2);
                let r3 = this.compareNumbers(x3, y3);
                let r4 = this.compareNumbers(x3, y2);

                r[i][j] = {
                    n: `${y1}${y2}${y3}`,
                    c: `${this.evaluate(r1, r2, r3, r4)}%`
                }
            }
        }
        return r;
    };

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
            return <div className={"h5 bg-light py-2"}>
            </div>
        } else {
            let numbers = this.format(this.processNumber(this.props.data["number"])).reverse();
            return (
                <div className="bg-light pl-1">
                    { !this.state.showMusicians ?
                        <NumbersView numbers = { numbers } handleSelect = { this.handleSelect } />
                        :
                        <React.Fragment>
                            <div style={{ height: this.state.windowHeight-55, overflowX: 'hidden' }}>
                                <div className={"text-center text-warning p-1 mt-2"}>
                                    { `${this.state.selectedNumber[0]}.${this.state.selectedNumber[1]}.${this.state.selectedNumber[2]}` }
                                </div>
                                <MusicView name="РУССКИЕ МУЗЫКАНТЫ"
                                           musicians={ this.state.russian }
                                           dataToShow={ m => m.city ? m.city : m.country } />
                                <MusicView name="КЛАССИЧЕСКИЕ КОМПОЗИТОРЫ"
                                           musicians={ this.state.classical }
                                           dataToShow={ m => m.country } />
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
                            <div className="text-center pb-2 m-1">
                                <button className={`btn btn-secondary mx-1 px-2`}
                                        onClick={ () => {
                                            this.setState({ showMusicians: false });
                                            this.props.showEditor(true);
                                        } }>
                                    Назад
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