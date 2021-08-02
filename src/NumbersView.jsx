import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function NumbersView(props) {
    const { numbers, handleSelect } = props;
    return (
        <>
            <div className="row text-center m-0 pt-3">
                <div className="col-2 text-right pr-2">
                    <pre>
                        {
                            numbers.map((p) => (
                                <div key={p.c} className="text-secondary">
                                    { p.c }
                                </div>
                            ))
                        }
                    </pre>
                </div>
                <div className="col-10 text-left number">
                    <pre>
                        {
                            numbers.map((p) => (
                                <div key={p.c} className="text-brown number">
                                    { p.n.map((n, i) => (
                                        <span
                                            onClick={() => handleSelect(n)}
                                            onKeyDown={() => handleSelect(n)}
                                            className="number mx-1"
                                            role="button"
                                            tabIndex={i}
                                            key={n}
                                        >
                                            { n }
                                        </span>
                                    ))}
                                </div>
                            ))
                        }
                    </pre>
                </div>
            </div>
            <div className="text-center pb-2">
                <small>Click a number for music!</small>
            </div>
        </>
    );
}

NumbersView.propTypes = {
    numbers: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleSelect: PropTypes.func.isRequired
};
