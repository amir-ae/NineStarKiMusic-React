import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function MusicView(props) {
    const { name, musicians, dataToShow } = props;
    return (
        musicians.length > 0
        && (
            <>
                <div className="text-center text-dark">
                    <small className="occasion-header">{name}</small>
                </div>
                <div className="row">
                    <div className="col-7 pr-0">
                        <pre>
                            <span className="text-red text-left musician-name">
                                {musicians.map((m) => (
                                    <div key={m.id}>
                                        <small>{ `${m.name}` }</small>
                                    </div>
                                ))}
                            </span>
                        </pre>
                    </div>
                    <div className="col-5 pl-1">
                        <pre>
                            <span className="font-italic text-info text-left musician-data">
                                { musicians.map((m) => <div key={m.id}><small className="pr-2">{ `${dataToShow(m)}` }</small></div>) }
                            </span>
                        </pre>
                    </div>
                </div>
            </>
        )
    );
}

MusicView.propTypes = {
    name: PropTypes.string.isRequired,
    musicians: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataToShow: PropTypes.func.isRequired
};
