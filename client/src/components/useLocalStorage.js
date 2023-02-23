import { useState, useEffect } from 'react';


export function useLocalStorage(key, initialValue) {

    const [state, setState] = useState(() => {

        localStorage.clear()
        if(initialValue !== undefined) {

            const localStorageValue = localStorage.getItem(key);
            console.log('local', localStorageValue)
            if (localStorageValue !== undefined) {
                return JSON.parse(localStorageValue);
            } else {
                return initialValue;
            }
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}