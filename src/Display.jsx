import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NumbersView from './NumbersView';
import MusicView from './MusicView';
import { processNumbers, processNumber } from './NineStarKi';
import {
    russianMusic, classicalMusic, essentialMusic, occasions, genres,
} from './Musicians';

export default class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedNumber: '',
            russian: '',
            classical: '',
            essential: '',
            dataType: 0,
            showMusicians: false,
            buttonLabel: 'Recordings',
            windowHeight: window.innerHeight
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps) {
        const { data } = this.props;
        if (prevProps.data !== data) {
            this.setState({ showMusicians: false });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        this.setState({ windowHeight: window.innerHeight });
    }

    handleClick = () => {
        const { dataType } = this.state;
        switch (dataType) {
        case 0:
            this.setState({ dataType: 1, buttonLabel: 'Numbers' });
            break;
        case 1:
            this.setState({ dataType: 2, buttonLabel: 'Genres' });
            break;
        case 2:
        default:
            this.setState({ dataType: 0, buttonLabel: 'Recordings' });
            break;
        }
    };

    getUnique = (arr, comp, cond) => {
        if (cond) {
            return arr;
        }
        return arr.map((e) => e[comp])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter((e) => arr[e]).map((e) => arr[e]);
    }

    format = (r) => {
        const f = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const k = f.findIndex((p) => p.c === r[i][j].c);
                if (k !== -1) {
                    f[k].n.push(r[i][j].n);
                } else {
                    f.push({ c: r[i][j].c, n: [r[i][j].n] });
                }
            }
        }
        f.sort((a, b) => {
            if (a.c > b.c) {
                return 1;
            }
            if (b.c > a.c) {
                return -1;
            }
            return 0;
        });
        if (f.findIndex((p) => p.c === '5%') !== -1) {
            f.splice(f.findIndex((p) => p.c === '0%') + 1 || 0, 0, f.splice(f.findIndex((p) => p.c === '5%'), 1)[0]);
        }
        if (f.findIndex((p) => p.c === '100%') !== -1) {
            f.splice(f.length - 1, 0, f.splice(f.findIndex((p) => p.c === '100%'), 1)[0]);
        }
        f.forEach((p) => {
            let padding = '';
            if (p.c.length === 2) {
                padding = '  ';
            } else if (p.c.length === 3) {
                padding = ' ';
            }
            p.c = padding + p.c;
        });
        f.forEach((p) => { p.nl = p.n.join('  '); });

        return f;
    };

    handleSuggestion = () => {
        const allMusicians = [];
        const musicians = [];
        for (let i = 0; i < occasions.length; i++) {
            musicians[i] = [];
            allMusicians[i] = essentialMusic
                .filter((a) => Object.prototype.hasOwnProperty.call(a, 'numbers'))
                .filter((a) => a.occasion.includes(i));
            allMusicians[i].forEach((musician) => {
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
            showMusicians: true
        });
        const { showEditor } = this.props;
        showEditor(false);
    };

    check = (musician) => {
        const numbers = musician.numbers
            .replace(' & ', ', ')
            .split(', ')
            .filter((n) => n.length !== 1);

        if (numbers.length < 2) {
            return false;
        }

        const result = [];
        numbers.forEach((num, i) => {
            const personality = `${num[0]}.${num[1]}.${num[2]}`;
            const { data } = this.props;
            result.push(this.normal(i + 1) * processNumbers(
                data.number, personality
            ));
        });

        const average = (array) => array.reduce((a, b) => a + b) / array.length;

        const threshold = result.map((r, i) => 50 * this.normal(i + 1));

        return average(result) > average(threshold);
    };

    normal = (x) => {
        const f = 1 / (Math.sqrt(2 * Math.PI * 10)
            * Math.exp(-(x ** 2) / (2 * 10)));
        return 0.12 + 2.4 * Math.sqrt(f);
    };

    handleSelect = (number) => {
        const classical = classicalMusic.filter((m) => m.number === number);
        const russian = russianMusic.filter((m) => m.number === number);
        const essential = [];
        for (let i = 0; i < occasions.length; i++) {
            essential[i] = essentialMusic
                .filter((a) => Object.prototype.hasOwnProperty.call(a, 'numbers')
                    && a.numbers.includes(number))
                .filter((a) => a.occasion.includes(i));
        }

        this.setState({
            selectedNumber: number,
            russian,
            classical,
            essential,
            showMusicians: true
        });

        const { showEditor } = this.props;
        showEditor(false);
    };

    dataToShow = (musician) => {
        const { dataType } = this.state;
        switch (dataType) {
        case 2:
            return musician.numbers;
        case 1:
            return musician.recording;
        case 0:
        default:
            return musician.genre.map((g) => genres[g].name).join(', ');
        }
    };

    titleToShow = () => {
        const { selectedNumber } = this.state;
        let color;
        let number;
        if (selectedNumber) {
            number = `${selectedNumber[0]}.${selectedNumber[1]}.${selectedNumber[2]}`;
            color = 'brown';
        } else {
            const { data } = this.props;
            number = `${data.number}`;
            color = 'danger';
        }
        const theme = `text-${color} text-center m-2 p-2`;
        return (
            <div className={theme}>
                { number }
            </div>
        );
    }

    render() {
        const { data, showEditor } = this.props;
        const {
            windowHeight, showMusicians, dataType,
            russian, classical, essential, buttonLabel,
        } = this.state;
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return <div className="bg-dark" style={{ height: windowHeight }} />;
        }
        const numbers = this.format(processNumber(data.number)).reverse();
        return (
            <div className="bg-white">
                { !showMusicians ? (
                    <>
                        <NumbersView numbers={numbers} handleSelect={this.handleSelect} />
                        <div className="text-center m-2 p-1">
                            <button type="button" className="btn btn-primary mx-1 px-2" onClick={this.handleSuggestion}>
                                Suggestions
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ height: windowHeight - 65, overflowX: 'hidden' }}>
                            { this.titleToShow() }
                            { russian && (
                            <MusicView
                                name="RUSSIAN MUSICIANS"
                                musicians={russian}
                                dataToShow={(m) => (m.city !== null ? m.city : m.country)}
                            />
                            )}
                            { classical && (
                            <MusicView
                                name="CLASSIC COMPOSERS"
                                musicians={classical}
                                dataToShow={(m) => m.country}
                            />
                            )}
                            { occasions.map((o, i) => essential[i].some(
                                (m) => m.occasion.includes(i),
                            ) && (
                                <MusicView
                                    name={o.name.toString()}
                                    key={o.name.toString()}
                                    musicians={this.getUnique(essential[i], 'name', dataType === 1)}
                                    dataToShow={(m) => this.dataToShow(m)}
                                />
                            ))}
                        </div>
                        <div className="text-center m-2 p-1">
                            <button
                                type="button" className="btn btn-secondary mx-1 px-2"
                                onClick={() => {
                                    this.setState({ showMusicians: false });
                                    showEditor(true);
                                }}
                            >
                                Back
                            </button>
                            <button
                                type="button" className="btn btn-primary mx-1 px-2"
                                onClick={this.handleClick}
                            >
                                {buttonLabel}
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

Display.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    showEditor: PropTypes.func.isRequired
};
