import { useState, createContext } from 'react';

const Type = createContext();

const Context = ({ children }) =>
{
    const [id, setID] = useState('');

    return (
        <Type.Provider value={{ id, setID }}>
            {children}
        </Type.Provider>
    );
}

export { Type, Context }
