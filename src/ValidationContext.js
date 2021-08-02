import React from 'react';

const ValidationContext = React.createContext({
    getMessagesForField: () => []
});

export default ValidationContext;
